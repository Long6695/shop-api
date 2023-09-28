const inventoryModel = require('../inventory.model')

const insertInventory = async ({
    productId,
    shopId,
    stock,
    location = 'VN',
}) => {
    return inventoryModel.create({
        productId,
        shopId,
        stock,
        location,
    })
}

module.exports = {
    insertInventory,
}
