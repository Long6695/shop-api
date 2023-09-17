require('dotenv').config()
const express = require('express');
const morgan = require("morgan")
const helmet = require("helmet")
const compression = require("compression")
const bodyParser = require("body-parser")
const app = express()

//middleware
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
//db
require('./dbs/init.mongodb')
//routes
app.use('/', require('./routes'))
//handling error
app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    return next(error)
})

app.use((error, req, res, next) => {
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status: 'error',
        statusCode,
        message: error.message || 'Internal Server Error'
    })
})

module.exports = app
