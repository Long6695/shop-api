const J = require('joi')

exports.loginSchema = J.object({
    email: J.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),
    password: J.string().required(),
})

exports.signUpSchema = J.object({
    name: J.string().required(),
    email: J.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),
    password: J.string().required(),
})

exports.refreshTokenSchema = J.object({
    refreshToken: J.string().required(),
})
