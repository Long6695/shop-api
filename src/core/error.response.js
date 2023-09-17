const STATUS_CODE = {
    FORBIDDEN: 403,
    CONFLICT: 409,
    UNAUTHORIZED: 401,
}

const MESSAGE = {
    FORBIDDEN: 'Bad request',
    CONFLICT: 'Conflict request',
    UNAUTHORIZED: 'Unauthorized',
}

class ErrorResponse extends Error {
    constructor(message, status) {
        super(message)
        this.status = status
    }
}

class ConflictErrorResponse extends ErrorResponse {
    constructor(message = MESSAGE.CONFLICT, statusCode = STATUS_CODE.CONFLICT) {
        super(message, statusCode)
    }
}

class BadErrorResponse extends ErrorResponse {
    constructor(
        message = MESSAGE.FORBIDDEN,
        statusCode = STATUS_CODE.FORBIDDEN
    ) {
        super(message, statusCode)
    }
}

class UnauthorizedResponse extends ErrorResponse {
    constructor(
        message = MESSAGE.UNAUTHORIZED,
        statusCode = STATUS_CODE.UNAUTHORIZED
    ) {
        super(message, statusCode)
    }
}

module.exports = {
    ConflictErrorResponse,
    BadErrorResponse,
    UnauthorizedResponse,
}
