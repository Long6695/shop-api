const { Schema, model } = require('mongoose')

const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'Discounts'

const discountSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            default: 'fixed_amount',
            enum: ['fixed_amount', 'percentage'],
        },
        value: {
            type: Number,
            required: true,
        },
        code: {
            type: String,
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        maxUses: {
            type: Number,
            required: true,
        },
        usesCount: {
            type: Number,
            required: true,
        },
        usersUsed: {
            type: Array,
            default: [],
        },
        maxUsesPerUser: {
            type: Number,
            required: true,
        },
        minOrderValue: {
            type: Number,
            required: true,
        },
        shopId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        appliesTo: {
            type: String,
            default: 'all',
            enum: ['all', 'special'],
        },
        productIds: {
            type: Array,
            default: [],
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
)

module.exports = model(DOCUMENT_NAME, discountSchema)
