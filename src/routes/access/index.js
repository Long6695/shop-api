const express = require('express')
const AccessController = require('../../controllers/access.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const { authentication } = require('../../auth/auth')

const router = express.Router()

router.post('/user/login', asyncHandler(AccessController.login))
router.post('/user/sign-up', asyncHandler(AccessController.signUp))

router.use(authentication)
router.post('/user/logout', asyncHandler(AccessController.logout))

module.exports = router
