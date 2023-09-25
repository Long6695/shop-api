const { Schema, model } = require('mongoose')
const slugify = require('slugify')

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
        productSlug: String,
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
        productRating: {
            type: Number,
            default: 4.5,
            min: [1, 'Rating must be above 1.0'],
            max: [5, 'Rating must be under 5.0'],
            set: (val) => Math.round(val * 10) / 10,
        },
        isDraft: {
            type: Boolean,
            default: true,
            index: true,
        },
        isPublish: {
            type: Boolean,
            default: false,
            index: true,
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
)

productSchema.index({ productName: 'text', productDescription: 'text' })

productSchema.pre('save', function (next) {
    this.productSlug = slugify(this.productName, {
        lower: true,
    })
    next()
})

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
