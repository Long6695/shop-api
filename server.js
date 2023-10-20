const app = require('./src/app')
const { port } = require('./src/configs/config.env')

const PORT = port || 3055

app.listen(PORT, (req, res, next) => {
    console.log(`Server is running on port::${PORT}`)
})
