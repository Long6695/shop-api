const { Schema, model } = require('mongoose')

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

const productSchema = new Schema(
    {
        productName: {
            type: String,
            required: true,
        },
        productThumb: {
            type: String,
            required: true,
        },
        productDescription: String,
        productPrice: {
            type: Number,
            required: true,
        },
        productQuantity: {
            type: Number,
            required: true,
        },
        productType: {
            type: String,
            required: true,
            enum: ['food', 'drink'],
        },
        productShop: { type: Schema.Types.ObjectId, ref: 'User' },
        productAttributes: {
            type: Schema.Types.Mixed,
            required: true,
        },
        productRating: Number,
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
)

const foodSchema = new Schema(
    {
        cuisine: {
            type: String,
            required: true,
        },
        ingredients: [String],
        allergens: [String],
        calories: {
            type: Number,
            required: true,
        },
        productShop: { type: Schema.Types.ObjectId, ref: 'User' },
    },
    {
        timestamps: true,
        collection: 'Foods',
    }
)

const drinkSchema = new Schema(
    {
        flavor: {
            type: String,
            required: true,
        },
        volume: {
            amount: {
                type: Number,
                required: true,
            },
            unit: {
                type: String,
                enum: ['ml', 'l'],
                default: 'ml',
            },
        },
        productShop: { type: Schema.Types.ObjectId, ref: 'User' },
    },
    {
        timestamps: true,
        collection: 'Drinks',
    }
)

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    drink: model('Drink', drinkSchema),
    food: model('Food', foodSchema),
}
