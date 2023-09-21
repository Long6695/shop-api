const apiKeyModel = require('../models/apiKey.model')

class ApiKeyService {
    static findApiKeyById = async (key) => {
        try {
            return apiKeyModel.findOne({ key, status: true }).lean()
        } catch (e) {
            throw new Error(e)
        }
    }
}

module.exports = ApiKeyService
