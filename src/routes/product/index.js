const express = require('express')
const asyncHandler = require('../../helpers/asyncHandler')
const { validate } = require('../../middlewares/validate')
const ProductController = require('../../controllers/product/product.controller')
const {
    createProductSchema,
} = require('../../controllers/product/product.request')
const { authentication } = require('../../auth/auth')

const router = express.Router()

router.get(
    '/product/all/:keySearch',
    asyncHandler(ProductController.getAllProductsBySearch)
)

router.get('/product/all', asyncHandler(ProductController.getAllProducts))

router.get('/product/:productId', asyncHandler(ProductController.getProduct))

router.use(authentication)

router.post(
    '/product/shop/create',
    validate(createProductSchema),
    asyncHandler(ProductController.createProduct)
)
router.patch(
    '/product/shop/update/:productId',
    asyncHandler(ProductController.updateProductByShop)
)

router.get(
    '/product/shop/publish',
    asyncHandler(ProductController.getAllProductsPublishByShop)
)

router.get(
    '/product/shop/draft',
    asyncHandler(ProductController.getAllProductsDraftByShop)
)

module.exports = router
