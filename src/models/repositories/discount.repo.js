const { Types } = require('mongoose')
const { unselectData, getSelectData } = require('../../ultis')
const discountModel = require('../discount.model')

const findAllDiscountCodeUnselectSpecificData = async ({
    limit = 50,
    page = 1,
    sort = 'ctime',
    filters,
    unSelect = [],
}) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    return discountModel
        .find(filters)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(unselectData(unSelect))
        .lean()
}

const findAllDiscountCodeSelectSpecificData = async ({
    limit = 50,
    page = 1,
    sort = 'ctime',
    filters,
    select,
}) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    return discountModel
        .find(filters)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()
}

const findOneDiscount = async ({ code, isActive = true, shopId }) => {
    return discountModel
        .findOne({
            code,
            isActive,
            shopId: Types.ObjectId(shopId),
        })
        .lean()
}

module.exports = {
    findAllDiscountCodeUnselectSpecificData,
    findAllDiscountCodeSelectSpecificData,
    findOneDiscount,
}
