const { BadErrorResponse } = require('../core/error.response')
const { product, food, drink } = require('../models/product.model')

class Product {
    constructor({
        productName,
        productThumb,
        productDescription,
        productPrice,
        productQuantity,
        productType,
        productShop,
        productAttributes,
    }) {
        this.productName = productName
        this.productThumb = productThumb
        this.productDescription = productDescription
        this.productPrice = productPrice
        this.productQuantity = productQuantity
        this.productType = productType
        this.productShop = productShop
        this.productAttributes = productAttributes
    }

    async createProduct(productId) {
        return product.create({ ...this, _id: productId })
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
    static async createProduct({ type, payload }) {
        switch (type) {
            case 'food':
                return new Food(payload).createProduct()
            case 'drink':
                return new Drink(payload).createProduct()
            default:
                throw new BadErrorResponse('Invalid Product Types')
        }
    }
}

module.exports = ProductFactory
