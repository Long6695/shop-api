'use strict'
const userModel = require('../models/user.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const TokenService = require('./token.service')
const {createTokenPair} = require("../auth/auth");
const {getInfoData} = require("../ultis");

const UserRole = {
    ADMIN: '00000',
    WRITER: '00001',
    EDITOR: '00002',
    USER: '00003',
}

class AccessService {
    static signUp = async ({name, email, password}) => {
        try {
            const existUser = await userModel.findOne({email}).lean()
            if (existUser) {
                return {
                    code: 409,
                    message: 'Email has already registered!',
                    status: 'fail'
                }
            }

            const hashPassword = await bcrypt.hash(password, 10)
            const newUser = await userModel.create({
                name,
                email,
                password: hashPassword,
                roles: [UserRole.USER]
            })

            if (newUser) {
                const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 4096,
                    publicKeyEncoding: {
                        type: 'pkcs1',
                        format: 'pem',
                    },
                    privateKeyEncoding: {
                        type: 'pkcs1',
                        format: 'pem',
                    }
                })
                const publicKeyString = await TokenService.createToken({userId: newUser?._id, publicKey})

                if (!publicKeyString) {
                    return {
                        code: 401,
                        message: 'token error',
                        status: 'fail'
                    }
                }

                const publicKeyObject = crypto.createPublicKey(publicKeyString)

                const tokens = await createTokenPair({
                    userId: newUser?._id,
                    email
                }, publicKeyObject, privateKey)

                return {
                    code: 201,
                    message: 'Success',
                    status: 'success',
                    data: {
                        user: getInfoData({fields: ['_id', 'email', 'name'], object: newUser}),
                        tokens,
                    }
                }
            }

            return {
                code: 200,
                data: null
            }

        } catch (e) {
            return {
                code: 500,
                message: e.message,
                status: 'error'
            }
        }
    }
}

module.exports = AccessService