const J = require('joi')

exports.createProductSchema = J.object({
    productType: J.string()
        .valid(...['food', 'drink'])
        .required(),
})
