const bcrypt = require('bcrypt')
const crypto = require('crypto')
const userModel = require('../models/user.model')
const TokenService = require('./token.service')
const { createTokenPair, verifyJWT } = require('../auth/auth')
const { getInfoData } = require('../ultis')
const {
    ConflictErrorResponse,
    UnauthorizedResponse,
    BadErrorResponse,
} = require('../core/error.response')
const { findUserByEmail, findUserById } = require('./user.service')
const { USER_ROLES } = require('../constants/user.constant')

class AccessService {
    static handleRefreshToken = async ({ refreshToken, user, tokens }) => {
        const { id, email } = user

        if (tokens.refreshTokensUsed.includes(refreshToken)) {
            await TokenService.deleteTokenByUserId({ userId: id })
            throw new UnauthorizedResponse('refresh token invalid')
        }

        if (tokens.refreshToken !== refreshToken) {
            throw new UnauthorizedResponse('refresh token invalid')
        }

        const foundUser = await findUserById({ id })
        if (!foundUser) throw new UnauthorizedResponse(`User doesn't exist!`)

        const newTokens = await createTokenPair({
            user: foundUser,
            usedRefreshToken: refreshToken,
        })

        return {
            user: { _id: id, email },
            tokens: newTokens,
        }
    }

    static login = async ({ email, password, refreshToken = null }) => {
        const existUser = await findUserByEmail({ email })
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
            roles: [USER_ROLES.USER],
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
        return TokenService.removeTokenByUserId(token._id)
    }
}

module.exports = AccessService
