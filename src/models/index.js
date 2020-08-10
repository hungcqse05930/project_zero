const { Sequelize } = require('sequelize')
const { createProductModel } = require('./product')
const { createUserModel } = require('./user')
const { createFruitModel } = require('./fruit')
const { createInstitutionModel } = require('./institution')
const { createAddressModel } = require('./address') 
const { createAuctionBidModel } = require('./auction_bid') 
const { createAuctionModel } = require('./auction') 
const { createWalletModel } = require('./wallet') 
const { createProductMediaModel } = require('./product_media') 
const { createProductUpdateModel } = require('./product_update') 
const { createProductUpdateRequestModel } = require('./product_update_request') 
const { createIdentityModel } = require('./identity') 
const { createAdminModel } = require('./admin')

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
        User: createUserModel(sequelize),
        Fruit: createFruitModel(sequelize),
        Institution: createInstitutionModel(sequelize),
        Address : createAddressModel (sequelize),
        AuctionBid : createAuctionBidModel (sequelize),
        Auction : createAuctionModel (sequelize),
        Wallet : createWalletModel (sequelize),
        ProductMedia : createProductMediaModel (sequelize),
        ProductUpdate : createProductUpdateModel(sequelize),
        ProductUpdateRequest : createProductUpdateRequestModel(sequelize),
        Identity: createIdentityModel(sequelize),
        Admin: createAdminModel(sequelize),
    }
}

module.exports = { createModels }
