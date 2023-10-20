const express = require('express')
const asyncHandler = require('../../helpers/asyncHandler')
const { validate } = require('../../middlewares/validate')
const { authentication } = require('../../auth/auth')
const {
    createDiscountCodeSchema,
    updateDiscountCodeSchema,
    discountByUserSchema,
    getDiscountAmountByUserSchema,
} = require('../../controllers/discount/discount.request')
const DiscountController = require('../../controllers/discount/discount.controller')

const router = express.Router()

router.get(
    '/discount/user/products',
    validate(discountByUserSchema),
    asyncHandler(DiscountController.getAllProductsFromDiscountCodeByUser)
)

router.use(authentication)

router.post(
    '/discount/user/cancel',
    validate(discountByUserSchema),
    asyncHandler(DiscountController.cancelDiscountCodeByUser)
)

router.get(
    '/discount/user/amount',
    validate(getDiscountAmountByUserSchema),
    asyncHandler(DiscountController.getDiscountAmount)
)

router.get(
    '/discount/shop/all',
    asyncHandler(DiscountController.getAllDiscountByShop)
)

router.post(
    '/discount/shop/create',
    validate(createDiscountCodeSchema),
    asyncHandler(DiscountController.createDiscountCode)
)

router.patch(
    '/discount/shop/update/:id',
    validate(updateDiscountCodeSchema),
    asyncHandler(DiscountController.updateDiscountCode)
)

router.delete(
    '/discount/shop/delete/:id',
    asyncHandler(DiscountController.deleteDiscountCodeByShop)
)

module.exports = router
