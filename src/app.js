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

module.exports = app
