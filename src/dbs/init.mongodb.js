const mongoose = require('mongoose')
const { user, password } = require('../configs/config.mongodb')

const connectString = `mongodb+srv://${user}:${password}@cluster0.mtmrkkp.mongodb.net/?retryWrites=true&w=majority`

class Database {
    constructor(type) {
        this.connect()
    }

    static connect(type = 'mongodb') {
        if (process.env.NODE_ENV === 'develop') {
            mongoose.set('debug', true)
            mongoose.set('debug', {
                color: true,
            })
        }
        if (type === 'mongodb') {
            mongoose
                .connect(connectString, {
                    maxPoolSize: 50,
                })
                .then((_) => console.log(`Connect to database`))
                .catch((error) => console.log(`Error Connect`))
        }
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database()
        }
        return Database.instance
    }
}

const instanceMongodb = Database.getInstance()

module.exports = instanceMongodb
