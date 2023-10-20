const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const compression = require('compression')
const bodyParser = require('body-parser')
const { nodeEnv } = require('./configs/config.env')

const app = express()

// middleware
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// db
require('./dbs/init.mongodb')
// routes
app.use('/', require('./routes'))
// handling error
app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    return next(error)
})

app.use((error, req, res, next) => {
    const statusCode = error?.status || 500
    let options = {
        status: 'error',
        statusCode,
        message: error?.message || 'Internal Server Error',
    }
    if (nodeEnv !== 'production') {
        options = {
            ...options,
            stack: error.stack,
        }
    }
    return res?.status(statusCode).json(options)
})

module.exports = app
