const { CreatedResponse, OkResponse } = require('../../core/success.response')
const DiscountService = require('../../services/discount.service')

class DiscountController {
    static async createDiscountCode(req, res, next) {
        new CreatedResponse({
            message: 'Created discount code success',
            data: await DiscountService.createDiscountCode({
                payload: {
                    ...req.data,
                    shopId: req.user.id,
                },
            }),
        }).send(res)
    }

    static async updateDiscountCode(req, res, next) {
        new OkResponse({
            message: 'Updated discount code success',
            data: await DiscountService.updateDiscountCode({
                shopId: req.user.id,
                data: req.body,
            }),
        }).send(res)
    }

    static async getAllProductsFromDiscountCodeByUser(req, res, next) {
        const { code, shopId } = req.body
        new OkResponse({
            message: 'Get all discount codes with product success',
            data: await DiscountService.getAllProductsFromDiscountCodeByUser({
                code,
                shopId,
            }),
        }).send(res)
    }

    static async getAllDiscountByShop(req, res, next) {
        const { code } = req.body
        new OkResponse({
            message: 'Get all discount codes by shop',
            data: await DiscountService.getAllDiscountCodesWithProductByUser({
                code,
                shopId: req.user.id,
            }),
        }).send(res)
    }

    static async getDiscountAmount(req, res, next) {
        const { code, shopId, products } = req.body
        new OkResponse({
            message: 'Get discount amount success',
            data: await DiscountService.getDiscountAmount({
                code,
                shopId,
                userId: req.user.id,
                products,
            }),
        }).send(res)
    }

    static async deleteDiscountCodeByShop(req, res, next) {
        const { code } = req.body
        new OkResponse({
            message: 'Delete discount code success',
            data: await DiscountService.deleteDiscountCodeByShop({
                code,
                shopId: req.user.id,
            }),
        }).send(res)
    }

    static async cancelDiscountCodeByUser(req, res, next) {
        const { code, shopId } = req.body

        new OkResponse({
            message: 'Cancel discount code success',
            data: await DiscountService.cancelDiscountCodeByUser({
                code,
                userId: req.user.id,
                shopId,
            }),
        }).send(res)
    }
}

module.exports = DiscountController
