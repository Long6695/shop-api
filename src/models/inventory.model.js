const { Schema, model } = require('mongoose')

const DOCUMENT_NAME = 'Inventory'
const COLLECTION_NAME = 'Inventories'

const inventorySchema = new Schema(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
        },
        shopId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        reservations: { type: Array, default: [] },
        location: { type: String, default: 'unknown' },
        stock: { type: Number, required: true },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
)

module.exports = model(DOCUMENT_NAME, inventorySchema)
