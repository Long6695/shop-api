const { ReasonPhrases, StatusCodes } = require('../ultis/httpStatusCode')

class SuccessResponse {
    constructor({ message, status, reasonStatusCode, data = {} }) {
        this.message = !message ? reasonStatusCode : message
        this.status = status
        this.data = data
    }

    send(res, headers = {}) {
        return res.status(this.status).json(this)
    }
}

class OkResponse extends SuccessResponse {
    constructor({
        message,
        status = StatusCodes.OK,
        reasonStatusCode = ReasonPhrases.OK,
        data,
    }) {
        super({ message, status, reasonStatusCode, data })
    }
}

class CreatedResponse extends SuccessResponse {
    constructor({
        message,
        status = StatusCodes.CREATED,
        reasonStatusCode = ReasonPhrases.CREATED,
        data,
    }) {
        super({ message, status, reasonStatusCode, data })
    }
}

module.exports = {
    OkResponse,
    CreatedResponse,
}
