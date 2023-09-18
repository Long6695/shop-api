const { ReasonPhrases, StatusCodes } = require('../ultis/httpStatusCode')

class ErrorResponse extends Error {
    constructor(message, status) {
        super(message)
        this.status = status
    }
}

class ConflictErrorResponse extends ErrorResponse {
    constructor(
        message = ReasonPhrases.CONFLICT,
        statusCode = StatusCodes.CONFLICT
    ) {
        super(message, statusCode)
    }
}

class BadErrorResponse extends ErrorResponse {
    constructor(
        message = ReasonPhrases.FORBIDDEN,
        statusCode = StatusCodes.FORBIDDEN
    ) {
        super(message, statusCode)
    }
}

class UnauthorizedResponse extends ErrorResponse {
    constructor(
        message = ReasonPhrases.UNAUTHORIZED,
        statusCode = StatusCodes.UNAUTHORIZED
    ) {
        super(message, statusCode)
    }
}

class NotFoundResponse extends ErrorResponse {
    constructor(
        message = ReasonPhrases.NOT_FOUND,
        statusCode = StatusCodes.NOT_FOUND
    ) {
        super(message, statusCode)
    }
}

module.exports = {
    ConflictErrorResponse,
    BadErrorResponse,
    UnauthorizedResponse,
    NotFoundResponse,
}
