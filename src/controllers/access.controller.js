'use strict'
const AccessService = require('../services/access.service')
class AccessController {
    static signUp = async (req, res, next) => {
        console.log(req.body)
        try {
            return res.status(200).json(await AccessService.signUp(req.body))
        } catch (e) {
            next(e)
        }
    }
}

module.exports = AccessController