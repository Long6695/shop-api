'use strict'

const tokenModel = require('../models/token.model')

class TokenService {
    static createToken = async ({userId, publicKey}) => {
        try {
            const publicKeyString = publicKey.toString()
            const token = await tokenModel.create({
                user: userId,
                publicKey: publicKeyString
            })
            return token ? publicKeyString : null
        } catch (e) {
            throw new Error(e)
        }
    }
}

module.exports = TokenService