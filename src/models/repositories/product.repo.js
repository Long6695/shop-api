const { Types } = require('mongoose')
const { product, drink, food } = require('../product.model')
const { getSelectData, unselectData } = require('../../ultis')

const findAllProducts = async ({ limit, page, sort, filters, select }) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    return product
        .find(filters)
        .populate('productShop', 'name email -_id')
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()
}

const findProduct = async ({ productId, unselect }) => {
    return product
        .findById(productId)
        .populate('productShop', 'name email -_id')
        .select(unselectData(unselect))
        .lean()
        .exec()
}

const findAllProductsPublishByShop = async ({ limit, skip }) => {
    return product
        .find({
            isPublish: true,
        })
        .sort({
            updateAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}

const findAllProductsDraftByShop = async ({ limit, skip }) => {
    return product
        .find({ isDraft: true })
        .sort({
            updateAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}

const findAllProductsBySearch = async ({ limit, skip, keySearch }) => {
    const regexSearch = new RegExp(keySearch)

    return product
        .find(
            {
                isPublish: true,
                $text: { $search: regexSearch },
            },
            {
                score: {
                    $meta: 'textScore',
                },
            }
        )
        .sort({
            $score: {
                $meta: 'textScore',
            },
            updateAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}

const updateProductByShop = async ({ model, productId, data = {} }) => {
    return model.findByIdAndUpdate(
        {
            productShop: new Types.ObjectId(data.productShop),
            _id: new Types.ObjectId(productId),
        },
        data,
        {
            new: true,
        }
    )
}

module.exports = {
    findAllProducts,
    updateProductByShop,
    findAllProductsBySearch,
    findProduct,
    findAllProductsPublishByShop,
    findAllProductsDraftByShop,
}
