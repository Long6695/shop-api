const express = require('express')
const { apiKey, permission } = require('../auth/checkAuth')
const { USER_ROLES } = require('../constants/user.constant')

const router = express.Router()

// check api key
router.use(apiKey)
// check permission
router.use(permission(USER_ROLES.ADMIN))

router.use('/v1/api', require('./product'))
router.use('/v1/api', require('./access'))
router.use('/v1/api', require('./discount'))

module.exports = router
