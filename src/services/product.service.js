const { BadErrorResponse } = require('../core/error.response')
const { product, food, drink } = require('../models/product.model')
const { insertInventory } = require('../models/repositories/inventory.repo')
const {
    findAllProducts,
    updateProductByShop,
    findAllProductsBySearch,
    findProduct,
    findAllProductsPublishByShop,
    findAllProductsDraftByShop,
} = require('../models/repositories/product.repo')
const { removeUndefinedObject, updateNestedObjectParser } = require('../ultis')

class Product {
    constructor({
        productName,
        productThumb,
        productDescription,
        productPrice,
        productQuantity,
        productType,
        productShop,
        productSlug,
        // productRating,
        isPublish,
        isDraft,
        productAttributes,
    }) {
        this.productName = productName
        this.productThumb = productThumb
        this.productDescription = productDescription
        this.productPrice = productPrice
        this.productQuantity = productQuantity
        this.productType = productType
        this.productShop = productShop
        this.productSlug = productSlug
        this.productAttributes = productAttributes
        // this.productRating = productRating
        this.isPublish = isPublish
        this.isDraft = isDraft
    }

    async createProduct(productId) {
        const newProduct = product.create({ ...this, _id: productId })

        if (newProduct) {
            await insertInventory({
                productId,
                shopId: this.productShop,
                stock: this.productQuantity,
            })
        }

        return newProduct
    }

    async updateProduct(productId, data) {
        return updateProductByShop({
            model: product,
            productId,
            data,
        })
    }
}

class Food extends Product {
    async createProduct() {
        const newFood = await food.create({
            ...this.productAttributes,
            productShop: this.productShop,
        })
        if (!newFood) {
            throw new BadErrorResponse('Create new food fail')
        }
        const newProduct = await super.createProduct(newFood._id)
        if (!newProduct) {
            throw new BadErrorResponse('Create new product fail')
        }

        return newProduct
    }

    async updateProduct(productId) {
        const objectParams = removeUndefinedObject(this)
        if (objectParams.productAttributes) {
            await updateProductByShop({
                model: food,
                productId,
                data: updateNestedObjectParser(objectParams.productAttributes),
            })
        }
        return super.updateProduct(
            productId,
            updateNestedObjectParser(objectParams)
        )
    }
}

class Drink extends Product {
    async createProduct() {
        const newDrink = await drink.create({
            ...this.productAttributes,
            productShop: this.productShop,
        })
        if (!newDrink) {
            throw new BadErrorResponse('Create new drink fail')
        }
        const newProduct = await super.createProduct(newDrink._id)
        if (!newProduct) {
            throw new BadErrorResponse('Create new product fail')
        }

        return newProduct
    }
}

class ProductFactory {
    static productRegistry = {}

    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef
    }

    static async createProduct({ type, payload }) {
        const ProductClass = ProductFactory.productRegistry[type]
        if (!ProductClass) {
            throw new BadErrorResponse('Invalid Product Types')
        }
        return new ProductClass(payload).createProduct()
    }

    static async findAllProducts({ limit = 50, sort = 'ctime', page = 1 }) {
        const filters = { isPublish: true }
        return findAllProducts({
            filters,
            limit,
            sort,
            page,
            select: ['productName', 'productThumb', 'productPrice'],
        })
    }

    static async findProduct({ productId }) {
        return findProduct({ productId, unselect: ['__v'] })
    }

    static async findAllProductsBySearch({ limit = 50, skip = 0, keySearch }) {
        return findAllProductsBySearch({ limit, skip, keySearch })
    }

    static async updateProductByShop({ type, productId, payload }) {
        const ProductClass = ProductFactory.productRegistry[type]
        if (!ProductClass) {
            throw new BadErrorResponse('Invalid Product Types')
        }
        return new ProductClass(payload).updateProduct(productId)
    }

    static async findAllProductsPublishByShop({ limit = 50, skip = 0 }) {
        return findAllProductsPublishByShop({ limit, skip })
    }

    static async findAllProductsDraftByShop({ limit = 50, skip = 0 }) {
        return findAllProductsDraftByShop({ limit, skip })
    }
}

ProductFactory.registerProductType('food', Food)
ProductFactory.registerProductType('drink', Drink)

module.exports = ProductFactory
