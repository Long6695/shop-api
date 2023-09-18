const bcrypt = require('bcrypt')
const crypto = require('crypto')
const userModel = require('../models/user.model')
const TokenService = require('./token.service')
const { createTokenPair, generateKeyPair } = require('../auth/auth')
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
    static login = async ({ email, password, refreshToken = null }) => {
        const existUser = await findByEmail({ email })
        if (!existUser) {
            throw new BadErrorResponse(`User doesn't exist!`)
        }

        const match = bcrypt.compare(password, existUser.password)

        if (!match) {
            throw new UnauthorizedResponse()
        }

        const { privateKey, publicKey } = generateKeyPair()
        const publicKeyString = await TokenService.createToken({
            userId: existUser?._id,
            publicKey,
        })

        if (!publicKeyString) {
            throw new UnauthorizedResponse()
        }

        const publicKeyObject = crypto.createPublicKey(publicKeyString)

        const tokens = await createTokenPair(
            {
                userId: existUser?._id,
                email,
            },
            publicKeyObject,
            privateKey
        )

        await TokenService.createToken({
            userId: existUser?._id,
            publicKey,
            refreshToken: tokens.refreshToken,
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
            const { privateKey, publicKey } = generateKeyPair()
            const publicKeyString = await TokenService.createToken({
                userId: newUser?._id,
                publicKey,
            })

            if (!publicKeyString) {
                throw new UnauthorizedResponse()
            }

            const publicKeyObject = crypto.createPublicKey(publicKeyString)

            const tokens = await createTokenPair(
                {
                    userId: newUser?._id,
                    email,
                },
                publicKeyObject,
                privateKey
            )
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
