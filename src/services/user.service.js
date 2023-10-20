const userModel = require('../models/user.model')

const findUserByEmail = async ({
    email,
    select = {
        email: 1,
        password: 1,
        name: 1,
        status: 1,
        roles: 1,
    },
}) => {
    return userModel.findOne({ email }).select(select).lean()
}

const findUserById = async ({
    id,
    select = {
        email: 1,
        password: 1,
        name: 1,
        status: 1,
        roles: 1,
    },
}) => {
    return userModel.findOne({ _id: id }).select(select).lean()
}

module.exports = {
    findUserByEmail,
    findUserById,
}
