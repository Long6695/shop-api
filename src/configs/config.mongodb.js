const develop = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
}

const production = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
}

const config = { develop, production }
const env = process.env.NODE_ENV || 'develop'
module.exports = config[env]
