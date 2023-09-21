const envVars = require('./config.env')

const develop = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
}

const production = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
}

const config = { develop, production }
module.exports = config[envVars]
