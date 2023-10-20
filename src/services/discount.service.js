const { Types } = require('mongoose')
const discountModel = require('../models/discount.model')
const { BadErrorResponse, NotFoundResponse } = require('../core/error.response')
const { removeUndefinedObject, updateNestedObjectParser } = require('../ultis')
const {
    findAllProductsPublishByShop,
} = require('../models/repositories/product.repo')
const {
    findAllDiscountCodeUnselectSpecificData,
    findOneDiscount,
} = require('../models/repositories/discount.repo')

class DiscountService {
    static async createDiscountCode({ payload }) {
        const {
            name,
            description,
            type,
            value,
            code,
            startDate,
            endDate,
            maxUses,
            usesCount,
            usersUsed,
            maxUsesPerUser,
            minOrderValue,
            shopId,
            isActive,
            appliesTo,
            productIds,
        } = payload

        const foundDiscount = await findOneDiscount({
            code,
            shopId,
        })

        if (foundDiscount) {
            throw new BadErrorResponse('Discount code is exist')
        }

        return discountModel.create({
            name,
            description,
            type: type || 'food',
            value,
            code,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            maxUses,
            usesCount,
            usersUsed,
            maxUsesPerUser,
            minOrderValue: minOrderValue || 0,
            shopId,
            isActive,
            appliesTo,
            productIds: appliesTo === 'all' ? [] : productIds,
        })
    }

    static async updateDiscountCode({ id, shopId, data }) {
        const objectParams = removeUndefinedObject(data)

        return discountModel.updateOne(
            {
                _id: id,
                shopId: new Types.ObjectId(shopId),
            },
            updateNestedObjectParser(objectParams)
        )
    }

    static async getAllProductsFromDiscountCodeByUser({
        code,
        shopId,
        limit,
        skip,
    }) {
        const foundDiscount = await findOneDiscount({
            code,
            shopId,
        })

        if (!foundDiscount) {
            throw new NotFoundResponse('Discount code not exist')
        }

        if (foundDiscount.appliesTo === 'all') {
            return findAllProductsPublishByShop({
                productShop: shopId,
                limit,
                skip,
            })
        }

        if (foundDiscount.appliesTo === 'specific') {
            return findAllProductsPublishByShop({
                productShop: shopId,
                limit,
                skip,
                productIds: foundDiscount.productIds,
            })
        }
    }

    static async getAllDiscountByShop({
        isActive = true,
        shopId,
        limit,
        page,
        sort,
    }) {
        return findAllDiscountCodeUnselectSpecificData({
            filters: {
                isActive,
                shopId,
            },
            unSelect: ['__v', 'shopId'],
            limit,
            page,
            sort,
        })
    }

    static async getDiscountAmount({ code, userId, shopId, products }) {
        const foundDiscount = await findOneDiscount({
            code,
            shopId,
        })

        if (!foundDiscount) {
            throw new NotFoundResponse('Discount code not exist')
        }

        const {
            isActive,
            maxUses,
            startDate,
            endDate,
            minOrderValue,
            maxUsesPerUser,
            usersUsed,
            type,
            value,
        } = foundDiscount

        if (!isActive) throw new NotFoundResponse('Discount code expired')
        if (!maxUses) throw new NotFoundResponse('Discount code used up')

        if (new Date(startDate) < new Date() || new Date(endDate) < new Date())
            throw new NotFoundResponse('Discount code expired')

        let totalOrderPrice = 0
        if (minOrderValue > 0) {
            totalOrderPrice = products.reduce((acc, curr) => {
                acc += curr.productQuantity * curr.productPrice
                return acc
            }, 0)

            if (totalOrderPrice < minOrderValue) {
                throw new NotFoundResponse(
                    `Discount required a minimum order ${minOrderValue}`
                )
            }
        }
        if (maxUsesPerUser > 0) {
            const userUsedDiscount = usersUsed.find(
                (user) => user._id === userId
            )

            if (userUsedDiscount) {
                throw new BadErrorResponse('Discount code has already used')
            }
        }

        const amount =
            type === 'fixed_amount' ? value : totalOrderPrice * (value / 100)

        return {
            totalOrderPrice,
            discount: amount,
            totalPrice: totalOrderPrice - amount,
        }
    }

    static async deleteDiscountCodeByShop({ shopId, id }) {
        return discountModel.findOneAndDelete({
            shopId: new Types.ObjectId(shopId),
            _id: id,
        })
    }

    static async cancelDiscountCodeByUser({ shopId, code, userId }) {
        const foundDiscount = await findOneDiscount({
            code,
            shopId,
        })

        if (!foundDiscount) {
            throw new NotFoundResponse('Discount code not exist')
        }

        return discountModel.findOneAndUpdate(
            { shopId, code },
            {
                $pull: {
                    usersUsed: userId,
                },
                $inc: {
                    maxUses: 1,
                    usesCount: -1,
                },
            }
        )
    }
}

module.exports = DiscountService
