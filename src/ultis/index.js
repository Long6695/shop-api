const _ = require('lodash')

const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields)
}

const convertObjToArray = (object = {}) => {
    return _.values(object)
}

const getSelectData = (selects = []) => {
    return Object.fromEntries(selects.map((el) => [el, 1]))
}

const unselectData = (selects = []) => {
    return Object.fromEntries(selects.map((el) => [el, 0]))
}

const removeUndefinedObject = (obj) => {
    if (obj === undefined || obj === null) {
        return obj
    }

    if (typeof obj === 'object' && !Array.isArray(obj)) {
        // Recursively process the object's properties
        Object.keys(obj).forEach((el) => {
            obj[el] = removeUndefinedObject(obj[el])
            if (obj[el] === undefined || obj[el] === null) {
                delete obj[el]
            }
        })
    }

    return obj
}

const updateNestedObjectParser = (obj) => {
    const final = {}
    Object.keys(obj).forEach((el) => {
        if (typeof obj[el] === 'object' && !Array.isArray(obj[el])) {
            const response = updateNestedObjectParser(obj[el])
            Object.keys(response).forEach((k) => {
                final[`${el}.${k}`] = response[k]
            })
        } else {
            final[el] = obj[el]
        }
    })
    return final
}

module.exports = {
    getInfoData,
    convertObjToArray,
    getSelectData,
    unselectData,
    removeUndefinedObject,
    updateNestedObjectParser,
}
