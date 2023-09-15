require('dotenv').config()
const express = require('express')
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const app = express()

//middleware
app.use(morgan('dev'))
app.use(helmet())
app.use(compression());
//db
require('./dbs/init.mongodb')
//routes
app.get('/', (req, res, next) => {
    return res.status(200).json({
        message: 'Hello world'
    })
})

module.exports = app
