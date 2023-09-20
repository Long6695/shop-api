const { Types } = require('mongoose')
const tokenModel = require('../models/token.model')
const asyncHandler = require('../helpers/asyncHandler')

class TokenService {
    static createToken = async ({
        userId,
        publicKey,
        refreshToken,
        refreshTokensUsed,
    }) => {
        try {
            let publicKeyString = null

            if (publicKey) {
                publicKeyString = publicKey.toString()
            }

            let data = {}
            if (publicKeyString) {
                data = {
                    ...data,
                    publicKey: publicKeyString,
                }
            }
            if (refreshToken) {
                data = {
                    ...data,
                    refreshToken,
                }
            }

            if (refreshTokensUsed) {
                data = {
                    ...data,
                    $addToSet: {
                        refreshTokensUsed,
                    },
                }
            }

            const token = await tokenModel.findOneAndUpdate(
                {
                    user: userId,
                },
                data,
                {
                    upsert: true,
                    new: true,
                }
            )

            return token ? publicKeyString : null
        } catch (e) {
            throw new Error(e)
        }
    }

    static findByUserId = async ({ userId }) => {
        return tokenModel.findOne({ user: new Types.ObjectId(userId) }).lean()
    }

    static removeKeyByUserId = async (id) => {
        return tokenModel.deleteOne({ _id: id })
    }

    static findByRefreshTokenUsed = async ({ refreshToken }) => {
        return tokenModel.findOne({ refreshTokenUsed: refreshToken }).lean()
    }

    static findByRefreshToken = async ({ refreshToken }) => {
        return tokenModel.findOne({ refreshToken })
    }

    static deleteTokenByUserId = async ({ userId }) => {
        return tokenModel.findByIdAndDelete({ userId })
    }
}

module.exports = TokenService
