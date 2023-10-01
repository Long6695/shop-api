const J = require('joi')

exports.createDiscountCodeSchema = J.object({
    name: J.string().required(),
    description: J.string().required(),
    type: J.string()
        .valid(...['food', 'drink'])
        .optional(),
    value: J.number().required(),
    code: J.string().required(),
    startDate: J.date().required().greater(Date.now()),
    endDate: J.date().required().greater(J.ref('startDate')),
    maxUses: J.number().required(),
    usesCount: J.number().required(),
    usersUsed: J.array().optional(),
    maxUsesPerUser: J.number().required(),
    minOrderValue: J.number().required(),
    isActive: J.boolean().optional(),
    appliesTo: J.string()
        .valid(...['all', 'special'])
        .optional(),
    productIds: J.array().optional(),
})

exports.updateDiscountCodeSchema = J.object({
    name: J.string().optional(),
    description: J.string().optional(),
    type: J.string()
        .valid(...['food', 'drink'])
        .optional(),
    value: J.number().optional(),
    code: J.string().optional(),
    startDate: J.date().optional().greater(Date.now()),
    endDate: J.date().optional().greater(J.ref('startDate')),
    maxUses: J.number().optional(),
    usesCount: J.number().optional(),
    usersUsed: J.array().optional(),
    maxUsesPerUser: J.number().optional(),
    minOrderValue: J.number().optional(),
    isActive: J.boolean().optional(),
    appliesTo: J.string()
        .valid(...['all', 'special'])
        .optional(),
    productIds: J.array().optional(),
})

exports.discountByUserSchema = J.object({
    code: J.string().required(),
    shopId: J.string().required(),
})

exports.discountByShopSchema = J.object({
    code: J.string().required(),
})

exports.getDiscountAmountByUserSchema = J.object({
    code: J.string().required(),
    shopId: J.string().required(),
    products: J.array().required(),
})
