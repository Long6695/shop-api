require('dotenv').config()
const J = require('joi')

const envVarsSchema = J.object({
    NODE_ENV: J.string().valid('production', 'develop', 'test').required(),
    PORT: J.number().positive().required(),
    DB_USER: J.string().required(),
    DB_PASSWORD: J.string().required(),
})
    .unknown()
    .required()

const { value: envVars, error } = envVarsSchema
    .prefs({ errors: { label: 'key' } })
    .validate(process.env)

if (error) {
    throw new Error(`Config validation error: ${error.message}`)
}

module.exports = envVars.NODE_ENV
