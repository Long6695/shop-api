const bcrypt = require('bcrypt')
const crypto = require('crypto')
const userModel = require('../models/user.model')
const TokenService = require('./token.service')
const { createTokenPair, generateKeyPair, verifyJWT } = require('../auth/auth')
const { getInfoData } = require('../ultis')
const {
    ConflictErrorResponse,
    UnauthorizedResponse,
    BadErrorResponse,
} = require('../core/error.response')
const { findByEmail } = require('./user.service')

const UserRole = {
    ADMIN: '00000',
    WRITER: '00001',
    EDITOR: '00002',
    USER: '00003',
}

class AccessService {
    static handleRefreshToken = async (refreshToken) => {
        const foundToken = await TokenService.findByRefreshTokenUsed({
            refreshToken,
        })

        if (foundToken) {
            const publicKeyObject = crypto.createPublicKey(foundToken.publicKey)
            const { userId, email } = await verifyJWT(
                refreshToken,
                publicKeyObject
            )

            await TokenService.deleteTokenByUserId({ userId })

            throw new BadErrorResponse('Invalid token')
        }

        const holderToken = await TokenService.findByRefreshToken({
            refreshToken,
        })
        if (!holderToken) throw new UnauthorizedResponse('Please login again')
        const publicKeyObject = crypto.createPublicKey(holderToken.publicKey)
        const { userId, email } = await verifyJWT(refreshToken, publicKeyObject)

        const foundUser = await findByEmail({ email })
        if (!foundUser)
            throw new UnauthorizedResponse('Please register account')
        const tokens = await createTokenPair({
            user: foundUser,
            oldPublicKey: holderToken.publicKey,
            rToken: refreshToken,
        })
        // await holderToken.updateOne(
        //     {
        //         refreshToken: tokens.refreshToken,
        //     },
        //     {
        //         $set: {
        //             refreshToken: tokens.refreshToken,
        //         },
        //         $addToSet: {
        //             refreshTokensUsed: refreshToken,
        //         },
        //     }
        // )

        return {
            user: { _id: userId, email },
            tokens,
        }
    }

    static login = async ({ email, password, refreshToken = null }) => {
        const existUser = await findByEmail({ email })
        if (!existUser) {
            throw new BadErrorResponse(`User doesn't exist!`)
        }

        const match = bcrypt.compare(password, existUser.password)

        if (!match) {
            throw new UnauthorizedResponse()
        }

        const tokens = await createTokenPair({
            user: existUser,
        })

        return {
            user: getInfoData({
                fields: ['_id', 'email', 'name'],
                object: existUser,
            }),
            tokens,
        }
    }

    static signUp = async ({ name, email, password }) => {
        const existUser = await userModel.findOne({ email }).lean()
        if (existUser) {
            throw new ConflictErrorResponse('Email has registered already!')
        }

        const hashPassword = await bcrypt.hash(password, 10)
        const newUser = await userModel.create({
            name,
            email,
            password: hashPassword,
            roles: [UserRole.USER],
        })

        if (newUser) {
            const tokens = await createTokenPair({
                user: newUser,
            })
            return {
                user: getInfoData({
                    fields: ['_id', 'email', 'name'],
                    object: newUser,
                }),
                tokens,
            }
        }
    }

    static logout = async (token) => {
        return TokenService.removeKeyByUserId(token._id)
    }
}

module.exports = AccessService
