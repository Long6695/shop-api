const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const asyncHandler = require('../helpers/asyncHandler')
const { HEADER } = require('../constants/auth.constant')
const { UnauthorizedResponse } = require('../core/error.response')
const TokenService = require('../services/token.service')

const verifyJWT = async (token, keySecret) => {
    return jwt.verify(token, keySecret)
}

const generateKeyPair = () => {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
        },
    })
    return {
        privateKey,
        publicKey,
    }
}

const generateTokenPair = async ({ user, privateKey, publicKey }) => {
    const payload = {
        userId: user?._id,
        email: user?.email,
    }

    const accessToken = await jwt.sign(payload, privateKey, {
        algorithm: 'RS256',
        expiresIn: '2 days',
    })

    const refreshToken = await jwt.sign(payload, privateKey, {
        algorithm: 'RS256',
        expiresIn: '7 days',
    })

    await jwt.verify(accessToken, publicKey, (err, decode) => {
        if (err) {
            console.error('error verify', err)
        } else {
            console.log('decode verify::', decode)
        }
    })

    return { accessToken, refreshToken }
}

const createTokenPair = async ({ user, usedRefreshToken = null }) => {
    const { privateKey, publicKey } = generateKeyPair()

    const tokens = await generateTokenPair({ user, privateKey, publicKey })

    const publicKeyString = await TokenService.createToken({
        userId: user?._id,
        publicKey,
        refreshToken: tokens.refreshToken,
        refreshTokensUsed: usedRefreshToken,
    })

    if (!publicKeyString) {
        throw new UnauthorizedResponse()
    }

    return tokens
}

const authentication = asyncHandler(async (req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID]
    const refreshToken = req.headers[HEADER.REFRESH_TOKEN]
    if (!userId) {
        throw new UnauthorizedResponse()
    }
    const token = await TokenService.findTokenByUserId({ userId })

    if (!token) {
        throw new UnauthorizedResponse()
    }
    let decodeUser = null

    const publicKeyObject = crypto.createPublicKey(token?.publicKey.toString())

    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) throw new UnauthorizedResponse()

    decodeUser = await verifyJWT(accessToken, publicKeyObject)

    if (!decodeUser || userId !== decodeUser.userId) {
        throw new UnauthorizedResponse()
    }

    if (refreshToken) {
        decodeUser = await verifyJWT(refreshToken, publicKeyObject)
        if (userId !== decodeUser.userId) {
            throw new UnauthorizedResponse()
        }

        req.refreshToken = refreshToken
    }

    req.token = token
    req.user = {
        id: decodeUser.userId,
        email: decodeUser.email,
    }
    return next()
})

module.exports = {
    createTokenPair,
    generateKeyPair,
    authentication,
    verifyJWT,
}
