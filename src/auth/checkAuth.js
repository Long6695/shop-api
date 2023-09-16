'use strict'

const ApiKeyService = require('../services/apiKey.service')

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}

const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString()
        if (!key) {
            return res.status(403).json({
                code: 403,
                message: 'Forbidden'
            })
        }

        const objKey = await ApiKeyService.findById(key)

        if (!objKey) {
            return res.status(403).json({
                code: 403,
                message: 'API Key Forbidden'
            })
        }

        req.objKey = objKey

        return next()
    } catch (e) {
        return e
    }
}

const permission = (permission) => {
    return (req, res, next) => {
        if (!req.objKey.permissions) {
            return res.status(403).json({
                code: 403,
                message: 'Permissions Denied'
            })
        }

        const validPermissions = req.objKey.permissions.includes(permission)
        if (!validPermissions) {
            return res.status(403).json({
                code: 403,
                message: 'Permissions Denied'
            })
        }

        return next()
    }
}

module.exports = {
    apiKey,
    permission
}