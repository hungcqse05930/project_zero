// application logical processes
const express = require('express')
const bodyParser = require('body-parser')
const { createProductRouter } = require('./routers/product')
const { createUserRouter } = require('./routers/user')
const { createFruitRouter } = require('./routers/fruit')
const { createModels } = require('./models/index')

// async func: wait until database connection is authentic ated and succeeded
const createApp = async ({ database }) => {
    const app = express()

    // establish connection and authenticate it
    const models = await createModels(database)
    
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false }))

    app.use('/product', createProductRouter(models))
    app.use('/user', createUserRouter(models))
    app.use('/fruit', createFruitRouter(models))

    return app
}

module.exports = { createApp }
