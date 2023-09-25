const { CreatedResponse, OkResponse } = require('../../core/success.response')
const ProductService = require('../../services/product.service')
const { getInfoData } = require('../../ultis')

class ProductController {
    createProduct = async (req, res, next) => {
        const { productType } = req.body
        new CreatedResponse({
            message: 'Create new product success',
            data: await ProductService.createProduct({
                type: productType,
                payload: {
                    ...req.body,
                    productShop: req.user.id,
                },
            }),
        }).send(res)
    }

    getAllProducts = async (req, res, next) => {
        const { sort, limit, page } = req.query
        new OkResponse({
            message: 'Get list products success',
            data: await ProductService.findAllProducts({
                sort,
                limit,
                page,
            }),
        }).send(res)
    }

    getProduct = async (req, res, next) => {
        const { productId } = req.params
        new OkResponse({
            message: 'Get products success',
            data: await ProductService.findProduct({
                productId,
            }),
        }).send(res)
    }

    getAllProductsBySearch = async (req, res, next) => {
        const { keySearch } = req.params
        new OkResponse({
            message: 'Get list products success',
            data: await ProductService.findAllProductsBySearch({
                keySearch,
            }),
        }).send(res)
    }

    updateProductByShop = async (req, res, next) => {
        const { productId } = req.params
        new OkResponse({
            message: 'Update product success',
            data: await ProductService.updateProductByShop({
                type: req.body.productType,
                productId,
                payload: {
                    ...req.body,
                    productShop: req.user.id,
                },
            }),
        }).send(res)
    }

    getAllProductsPublishByShop = async (req, res, next) => {
        new OkResponse({
            message: 'Get list products publish success',
            data: await ProductService.findAllProductsPublishByShop({}),
        }).send(res)
    }

    getAllProductsDraftByShop = async (req, res, next) => {
        new OkResponse({
            message: 'Get list products draft success',
            data: await ProductService.findAllProductsDraftByShop({}),
        }).send(res)
    }
}

module.exports = new ProductController()
