const mongoose = require('mongoose')
const { Schema } = require('mongoose')

const DOCUMENT_NAME = 'User'
const COLLECTION_NAME = 'Users'

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            maxLength: 150,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            index: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['inactive', 'active'],
            default: 'inactive',
        },
        verify: {
            type: Schema.Types.Boolean,
            default: false,
        },
        roles: {
            type: Array,
            default: [],
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
)

module.exports = mongoose.model(DOCUMENT_NAME, userSchema)
