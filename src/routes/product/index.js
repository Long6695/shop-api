const express = require('express')
const asyncHandler = require('../../helpers/asyncHandler')
const { validate } = require('../../middlewares/validate')
const ProductController = require('../../controllers/product/product.controller')
const {
    createProductSchema,
} = require('../../controllers/product/product.request')
const { authentication } = require('../../auth/auth')

const router = express.Router()

router.use(authentication)

router.post(
    '/product/create',
    // validate(createProductSchema),
    asyncHandler(ProductController.createProduct)
)
module.exports = router
