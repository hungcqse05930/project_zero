const express = require('express')
const { Sequelize, Op } = require('sequelize')
const bodyParser = require('body-parser')
const auth = require('../../middlewares/auth')

const createCollectionRouter = ({ Collection, CollectionAuction, Auction, Product, Address, ProductMedia, Fruit }) => {
    const router = express.Router()

    // Search collection lien quan
    router.get('/search/:title', async (req, res) => {

        const collections = await Collection.findAll({
            attributes: ['title', 'img_url', 'description', 'date_created'],
            where: {
                title: { [Op.like]: '%' + req.params.title + '%' }
            },
        })
        if (collections) {
            res.send(collections)
        } else {
            s
            res.sendStatus(404)
        }
    })
    
    const Company_Product_Person = sequelize.define("company_product_person", {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        companyProductId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "company_product",
                key: "id"
            },
            onDelete: "CASCADE"
        },
        personId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "person",
                key: "id"
            },
            onDelete: "CASCADE"
        },
        thoughts: Sequelize.STRING
    });

    // get all auction trong 1 collection
    router.get('/collection/:id', async (req, res) => {
        Collection.belongsToMany(Auction, { through: CollectionAuction , foreignKey: 'collection_id' })
        Auction.belongsToMany(Collection, { through: CollectionAuction , foreignKey: 'auction_id' })

        CollectionAuction.hasMany(Auction, { foreignKey: 'auction_id' })
        Auction.belongsTo(CollectionAuction, {  foreignKey: 'auction_id' })
        
        Product.hasMany(Auction, { foreignKey: 'product_id' })
        Auction.belongsTo(Product, { foreignKey: 'product_id' })

        Address.hasMany(Product, { foreignKey: 'address_id' })
        Product.belongsTo(Address, { foreignKey: 'address_id' })

        Product.hasMany(ProductMedia, { foreignKey: 'product_id' })
        ProductMedia.belongsTo(Product, { foreignKey: 'product_id' })

        Fruit.hasMany(Product, { foreignKey: 'fruit_id' })
        Product.belongsTo(Fruit, { foreignKey: 'fruit_id' })
        
        const products = await CollectionAuction.findAll({
            where: {collection_id:req.params.id},
            attributes: ['auction_id'],
            include:[{
                model: Auction,
                require: true
            }]
        })
        if (products) {
            res.send(products)
        } else {
            res.sendStatus(404)
        }
    })

    return router
}

module.exports = {
    createCollectionRouter,
}
