const { CreatedResponse, OkResponse } = require('../core/success.response')
const AccessService = require('../services/access.service')

class AccessController {
    static login = async (req, res, next) => {
        new OkResponse({
            message: 'Login success',
            data: await AccessService.login(req.body),
        }).send(res)
    }

    static signUp = async (req, res, next) => {
        new CreatedResponse({
            message: 'Register success',
            data: await AccessService.signUp(req.body),
        }).send(res)
    }

    static logout = async (req, res, next) => {
        new OkResponse({
            message: 'Logout success',
            data: await AccessService.logout(req.token),
        }).send(res)
    }
}

module.exports = AccessController
