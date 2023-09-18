const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const asyncHandler = require('../helpers/asyncHandler')
const { HEADER } = require('../constants/auth')
const {
    UnauthorizedResponse,
    NotFoundResponse,
} = require('../core/error.response')
const TokenService = require('../services/token.service')

const createTokenPair = async (payload, publicKey, privateKey) => {
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

    return {
        accessToken,
        refreshToken,
    }
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

const authentication = asyncHandler(async (req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID]

    if (!userId) {
        throw new UnauthorizedResponse('Invalid Request')
    }

    const token = await TokenService.findByUserId({ userId })

    if (!token) {
        throw new NotFoundResponse('Not Found')
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) throw new UnauthorizedResponse('Invalid Request')

    // eslint-disable-next-line no-useless-catch
    try {
        const publicKeyObject = crypto.createPublicKey(
            token?.publicKey?.toString()
        )
        const decodeUser = jwt.verify(accessToken, publicKeyObject)
        if (userId !== decodeUser.userId) {
            throw new UnauthorizedResponse('Invalid User Id')
        }
        req.token = token
        next()
    } catch (e) {
        throw e
    }
})

module.exports = {
    createTokenPair,
    generateKeyPair,
    authentication,
}
