const { Sequelize } = require('sequelize')
const { createProductModel } = require('./product')
const { createUserModel } = require('./user')

// like entities
const createModels = async ({ dbName, dbUser, dbPass, dbHost }) => {
    // establish a connection
    const sequelize = new Sequelize(dbName, dbUser, dbPass, {
        host: dbHost,
        dialect: 'mysql'
    })

    // wait for authentication
    await sequelize.authenticate()

    return {
        Product: createProductModel(sequelize),
        User: createUserModel(sequelize)
    }
}

module.exports = { createModels }
