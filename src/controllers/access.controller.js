'use strict'
const accessService = require('../services/access.service')
class AccessController {
    signUp = async (req, res, next) => {
        console.log(req.body)
        try {
            return res.status(200).json(await accessService.signUp(req.body))
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new AccessController()