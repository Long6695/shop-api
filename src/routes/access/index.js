const express = require('express')
const AccessController = require('../../controllers/access/access.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const { authentication } = require('../../auth/auth')
const {
    loginSchema,
    signUpSchema,
} = require('../../controllers/access/access.request')
const { validate } = require('../../middlewares/validate')

const router = express.Router()

router.post(
    '/user/login',
    validate(loginSchema),
    asyncHandler(AccessController.login)
)
router.post(
    '/user/sign-up',
    validate(signUpSchema),
    asyncHandler(AccessController.signUp)
)

router.use(authentication)
router.post('/user/refresh-token', asyncHandler(AccessController.refreshToken))
router.post('/user/logout', asyncHandler(AccessController.logout))

module.exports = router
