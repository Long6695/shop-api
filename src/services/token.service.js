const { Types } = require('mongoose')
const tokenModel = require('../models/token.model')
const asyncHandler = require('../helpers/asyncHandler')

class TokenService {
    static createToken = async ({ userId, publicKey, refreshToken }) => {
        try {
            const publicKeyString = publicKey.toString()

            let data = {
                publicKey: publicKeyString,
                refreshTokensUsed: [],
            }
            if (refreshToken) {
                data = {
                    ...data,
                    refreshToken,
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
}

module.exports = TokenService
