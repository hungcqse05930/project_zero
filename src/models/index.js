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
const { createCollectionAuctionModel } = require('./collection_auction')
const { createCollectionModel } = require('./collection')
const { createAffairModel } = require('./affair')
const { createAffairChatModel } = require('./affair_chat')
const { createAffairContractModel } = require('./affair_contract')
const { createAffairContractUpdateModel } = require('./affair_contract_update')
const { createDepositModel } = require('./deposit')
const { createTransactionModel } = require('./transaction')
// like entities
const createModels = async ({ dbName, dbUser, dbPass, dbHost }) => {
    // establish a connection
    // const sequelize = new Sequelize(process.env.DATABASE_URL, {
    //     host: dbHost,
    //     dialect: 'mysql'
    // })
    const path = require('path');
    const sequelize = new Sequelize(dbName, dbUser, dbPass, {
        host: dbHost,
        dialect: 'mysql',
        dialectOptions: {
            ssl: {
                key: require('fs').readFileSync(path.join(__dirname, 'client-key.pem')),
                cert: require('fs').readFileSync(path.join(__dirname, 'client-cert.pem')),
                ca: require('fs').readFileSync(path.join(__dirname, 'server-ca.pem')),
            }
        }
    })

    // wait for authentication
    await sequelize.authenticate()

    return {
        Address : createAddressModel (sequelize),
        Admin: createAdminModel(sequelize),
        Affair : createAffairModel(sequelize),
        AffairChat : createAffairChatModel (sequelize),
        AffairContract : createAffairContractModel (sequelize),
        AffairContractUpdate: createAffairContractUpdateModel (sequelize),
        Auction : createAuctionModel (sequelize),
        AuctionBid : createAuctionBidModel (sequelize),
        Collection : createCollectionModel(sequelize),
        CollectionAuction : createCollectionAuctionModel(sequelize),
        Deposit: createDepositModel(sequelize),
        Fruit: createFruitModel(sequelize),
        Identity: createIdentityModel(sequelize),
        Institution: createInstitutionModel(sequelize),
        Product: createProductModel(sequelize),
        ProductMedia : createProductMediaModel (sequelize),
        ProductUpdate : createProductUpdateModel(sequelize),
        ProductUpdateRequest : createProductUpdateRequestModel(sequelize),
        User: createUserModel(sequelize),
        Transaction: createTransactionModel(sequelize),
        Wallet : createWalletModel (sequelize),
    }
}

module.exports = { createModels }
