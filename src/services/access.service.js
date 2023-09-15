'use strict'
const userModel = require('../models/user.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

const UserRole = {
    ADMIN: '00000',
    WRITER: '00001',
    EDITOR: '00003',
    USER: '00004',
}

class AccessService {
    signUp = async ({name, email, password}) => {
        try {
            const existUser = await userModel.findOne({email}).lean()
            if (existUser) {
                return {
                    code: 'xxx',
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
                    modulusLength: 4096
                })

                return {
                    code: '200',
                    message: 'Success',
                    status: 'success',
                    data: {
                        user: newUser,
                        token: {
                            accessToken: privateKey,
                            refreshToken: publicKey,
                        }
                    }
                }
            }

        } catch (e) {
            return {
                code: 'xxx',
                message: e.message,
                status: 'error'
            }
        }
    }
}

module.exports = new AccessService()