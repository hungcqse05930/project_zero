// application logical processes
const express = require('express')
const { createProductRouter } = require('./routers/product')
const { createUserRouter } = require('./routers/user')
const { createModels } = require('./models/index')

// async func: wait until database connection is authentic ated and succeeded
const createApp = async ({ database }) => {
    const app = express()

    // establish connection and authenticate it
    const models = await createModels(database)

    app.use('/product', createProductRouter(models))
    app.use('/user', createUserRouter(models))
    app.use('/fruit', createFruitRouter(models))

    return app
}

module.exports = { createApp }
