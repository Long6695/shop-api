const { UnprocessableEntityResponse } = require('../core/error.response')

function validate(schema, property) {
    return (req, res, next) => {
        const { error } = schema.validate(req.body)
        const valid = !error

        if (valid) {
            next()
        } else {
            const { details } = error
            const message = details
                .map((i) => i.message.replace(/[^a-zA-Z0-9 ]/g, '')) // remove special chars
                .join(',')
            throw new UnprocessableEntityResponse(message)
        }
    }
}

module.exports = {
    validate,
}
