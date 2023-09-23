const { CreatedResponse } = require('../../core/success.response')
const ProductService = require('../../services/product.service')

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
}

module.exports = new ProductController()
