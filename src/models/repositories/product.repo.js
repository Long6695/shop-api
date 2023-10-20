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
        .findById({ productId: new Types.ObjectId(productId) })
        .populate('productShop', 'name email -_id')
        .select(unselectData(unselect))
        .lean()
        .exec()
}

const findAllProductsPublishByShop = async ({
    productShop,
    limit,
    skip,
    productIds,
}) => {
    const filters = {
        productShop: new Types.ObjectId(productShop),
        isPublish: true,
    }
    if (productIds) {
        filters._id = {
            $in: productIds.map((id) => new Types.ObjectId(id)),
        }
    }
    return product
        .find(filters)
        .sort({
            updateAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}

const findAllProductsDraftByShop = async ({ productShop, limit, skip }) => {
    return product
        .find({ productShop: new Types.ObjectId(productShop), isDraft: true })
        .sort({
            updateAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}

const findAllProductsBySearch = async ({ limit, skip, keySearch }) => {
    // eslint-disable-next-line security/detect-non-literal-regexp
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
            productShop: new Types.ObjectId(data.productShop)(),
            _id: new Types.ObjectId(productId)(),
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
