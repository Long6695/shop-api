const _ = require('lodash')

const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields)
}

const convertObjToArray = (object = {}) => {
    return _.values(object)
}

module.exports = {
    getInfoData,
    convertObjToArray,
}
