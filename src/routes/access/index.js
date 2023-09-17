const express = require('express')
const AccessController = require('../../controllers/access.controller')
const asyncHandler = require('../../ultis')

const router = express.Router()

router.post('/user/sign-up', asyncHandler(AccessController.signUp))

module.exports = router
