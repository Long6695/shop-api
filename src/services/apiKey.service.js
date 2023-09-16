'use strict'

const apiKeyModel = require('../models/apiKey.model')
const crypto = require('crypto')

class ApiKeyService {
    static findById = async (key) => {
       try {
           return apiKeyModel.findOne({key, status: true}).lean();
       }catch (e) {
           console.log(e)
       }
    }
}

module.exports = ApiKeyService