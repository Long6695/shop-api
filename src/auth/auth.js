const jwt = require('jsonwebtoken')

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = await jwt.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '2 days',
        })

        const refreshToken = await jwt.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '7 days',
        })

        await jwt.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.error('error verify', err)
            } else {
                console.log('decode verify::', decode)
            }
        })

        return {
            accessToken,
            refreshToken,
        }
    } catch (e) {
        return e
    }
}

module.exports = {
    createTokenPair,
}
