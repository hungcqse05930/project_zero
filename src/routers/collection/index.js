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

    // get all auction trong 1 collection
    router.get('/collectionAuction/:id', async (req, res) => {
        Product.hasMany(Auction, { foreignKey: 'product_id' })
        Auction.belongsTo(Product, { foreignKey: 'product_id' })

        Address.hasMany(Product, { foreignKey: 'address_id' })
        Product.belongsTo(Address, { foreignKey: 'address_id' })

        Product.hasMany(ProductMedia, { foreignKey: 'product_id' })
        ProductMedia.belongsTo(Product, { foreignKey: 'product_id' })

        Fruit.hasMany(Product, { foreignKey: 'fruit_id' })
        Product.belongsTo(Fruit, { foreignKey: 'fruit_id' })

        Auction.hasMany(CollectionAuction, { foreignKey: 'auction_id' })
        CollectionAuction.belongsTo(Auction, { foreignKey: 'auction_id' })

        Collection.hasMany(CollectionAuction, { foreignKey: 'collection_id' })
        CollectionAuction.belongsTo(Collection, { foreignKey: 'collection_id' })

        Collection.belongsToMany(Auction, { through: CollectionAuction })
        Auction.belongsToMany(Collection, { through: CollectionAuction })

        const products = await CollectionAuction.findAll({
            limit: 20,
            where: { collection_id: req.params.id },
            include: [{
                model: Auction,
                attributes: ['id', 'price_cur', 'views', [Sequelize.fn('datediff', Sequelize.col('date_closure'), Sequelize.literal('CURRENT_TIMESTAMP')), 'remain']],
                where: { auction_status: 1 },
                required: true,
                include: [{
                    model: Product,
                    attributes: ['title', 'id', 'weight', 'fruit_id'],
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
                            required: true
                        }]
                }]
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
