const app = require("./src/app");

const PORT = process.env.PORT || 3055

app.listen(PORT, (req, res, next) => {
    console.log(`Server is running on port::${PORT}`)
})