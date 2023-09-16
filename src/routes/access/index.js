'use strict'

const express = require('express')
const AccessController = require('../../controllers/access.controller')
const router = express.Router()

router.post('/user/sign-up', AccessController.signUp)

module.exports = router