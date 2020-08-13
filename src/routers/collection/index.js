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
    
    // const Company_Product_Person = sequelize.define("company_product_person", {
    //     id: {
    //         type: Sequelize.INTEGER,
    //         allowNull: false,
    //         autoIncrement: true,
    //         primaryKey: true
    //     },
    //     companyProductId: {
    //         type: Sequelize.INTEGER,
    //         allowNull: false,
    //         references: {
    //             model: "company_product",
    //             key: "id"
    //         },
    //         onDelete: "CASCADE"
    //     },
    //     personId: {
    //         type: Sequelize.INTEGER,
    //         allowNull: false,
    //         references: {
    //             model: "person",
    //             key: "id"
    //         },
    //         onDelete: "CASCADE"
    //     },
    //     thoughts: Sequelize.STRING
    // });

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

    // get collection
    router.get('/id/:id', async (req, res) => {
        // Collection.belongsToMany(Auction, { through: CollectionAuction, foreignKey: 'collection_id' })
        // Auction.belongsToMany(Collection, { through: CollectionAuction, foreignKey: 'auction_id' })

        Auction.hasMany(CollectionAuction, { foreignKey: 'auction_id' })
        CollectionAuction.belongsTo(Auction, { foreignKey: 'auction_id' })

        Collection.hasMany(CollectionAuction, { foreignKey: 'collection_id' })
        CollectionAuction.belongsTo(Collection, { foreignKey: 'collection_id' })

        // product 1 - n auction
        Product.hasMany(Auction, { foreignKey: 'product_id' })
        Auction.belongsTo(Product, { foreignKey: 'product_id' })

        // address 1 - n product
        Address.hasMany(Product, { foreignKey: 'address_id' })
        Product.belongsTo(Address, { foreignKey: 'address_id' })

        // product 1 - n product_media
        Product.hasMany(ProductMedia, { foreignKey: 'product_id' })
        ProductMedia.belongsTo(Product, { foreignKey: 'product_id' })

        let collectionId = req.params.id

        const collection = await Collection.findOne({
            where: {
                id: collectionId
            },
            include: [
                {
                    model: CollectionAuction,
                    attributes: ['auction_id'],
                    required: true,
                    include: [
                        {
                            model: Auction,
                            attributes: ['id', 'price_cur', 'views', [Sequelize.fn('datediff', Sequelize.col('date_closure'), Sequelize.literal('CURRENT_TIMESTAMP')), 'remain']],
                            required: true,
                            where: {
                                id: {
                                    [Op.eq]: Sequelize.col('CollectionAuctions.auction_id')
                                }
                            },
                            include: [
                                {
                                    model: Product,
                                    attributes: ['id', 'title', 'weight'],
                                    required: true,
                                    include: [
                                        {
                                            model: Address,
                                            attributes: ['province'],
                                            required: true
                                        },
                                        {
                                            model: ProductMedia,
                                            attributes: ['media_url'],
                                            // required: true,
                                            limit: 1
                                        }]
                                }
                            ]
                        }
                    ]
                }
            ]
        })

        // const auctions = await Auction.findAll({
        //     attributes: ['id', 'price_cur', 'views', [Sequelize.fn('datediff', Sequelize.col('date_closure'), Sequelize.literal('CURRENT_TIMESTAMP')), 'remain']],
        //     include: [
        //         {
        //             model: Product,
        //             attributes: ['id', 'title', 'weight'],
        //             required: true,
        //             include: [
        //                 {
        //                     model: Address,
        //                     attributes: ['province'],
        //                     required: true
        //                 },
        //                 {
        //                     model: ProductMedia,
        //                     attributes: ['media_url'],
        //                     required: true,
        //                     limit: 1
        //                 }]
        //         },
        //         {
        //             model: CollectionAuction,
        //             attributes: ['id']
        //         } 
        //     ]
        // })

        if (collection) {
            res.status(400).send(collection)
        } else {
            res.sendStatus(404)
        }
    })

    return router
}

module.exports = {
    createCollectionRouter,
}