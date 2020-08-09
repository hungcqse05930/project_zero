// library
const express = require('express')
const { Sequelize, Op, QueryTypes } = require('sequelize')
// middlewares
const auth = require('../../middlewares/auth')
const product = require('../product')

const createAuctionRouter = (models) => {
    const router = express.Router()

    // get auction date created
    // chưa rõ chức năng
    router.get('/product/:id', async (req, res) => {
        // find by primary key = find by id
        // Product.hasMany(Auction , {foreignKey: 'product_id'})
        // Auction.belongsTo(Product)
        // TODO: findAll where datediff: 
        const auctions = await models.Auction.findAll(
            {
                where: { product_id: req.params.id, auction_status: 1 },
                attributes: ['date_created'],
            }
        )
        if (auctions) {
            res.send(auctions)
        } else {
            res.sendStatus(404)
        }

    })

    router.get('/latest', async (req, res) => {
        // product 1 - n auction
        models.Product.hasMany(models.Auction, { foreignKey: 'product_id' })
        models.Auction.belongsTo(models.Product, { foreignKey: 'product_id' })

        // address 1 - n product
        models.Address.hasMany(models.Product, { foreignKey: 'address_id' })
        models.Product.belongsTo(models.Address, { foreignKey: 'address_id' })

        // product 1 - n product_media
        models.Product.hasMany(models.ProductMedia, { foreignKey: 'product_id' })
        models.ProductMedia.belongsTo(models.Product, { foreignKey: 'product_id' })

        const auctions = await models.Auction.findAll({
            attributes: [
                'id',
                [Sequelize.fn('datediff', Sequelize.col('Auction.date_closure'), Sequelize.literal('CURRENT_TIMESTAMP')), 'remain'],
                'price_cur',
                'views'
            ],
            limit: 10,
            order: [['views', 'DESC']],
            include: [
                {
                    model: models.Product,
                    attributes: ['id', 'title', 'weight'],
                    include: [
                        {
                            model: models.Address,
                            attributes: ['province'],
                            required: true
                        },
                        {
                            model: models.ProductMedia,
                            attributes: ['media_url'],
                            order: [['date_created', 'DESC']],
                            // required: true
                        }
                    ],
                    required: true
                }
            ],
        })


        if (auctions) {
            res.send(auctions)
        } else {
            res.sendStatus(404)
        }
    })

    // router.get('/latest', async (req, res) => {
    //     // product 1 - n auction
    //     Product.hasMany(Auction, { foreignKey: 'product_id' })
    //     Auction.belongsTo(Product, { foreignKey: 'product_id' })

    //     // address 1 - n product
    //     Address.hasMany(Product, { foreignKey: 'address_id' })
    //     Product.belongsTo(Address, { foreignKey: 'address_id' })

    //     // product 1 - n product_media
    //     Product.hasMany(ProductMedia, { foreignKey: 'product_id' })
    //     ProductMedia.belongsTo(Product, { foreignKey: 'product_id' })

    //     const auctions = await Sequelize.query(
    //         'SELECT auction.id, product.title, auction.price_cur, datediff(auction.date_closure, CURRENT_TIMESTAMP) as remain, product.weight,       address.province, ( SELECT product_media.media_url FROM product_media WHERE product.id = product_media.product_id LIMIT 1) as media_url FROM address, auction, product WHERE address.id = product.address_id AND auction.product_id = product.id AND auction.auction_status = 1 GROUP BY auction.id ORDER BY remain ASC LIMIT 10',
    //         {
    //             type: QueryTypes.SELECT
    //         })

    //     if (auctions) {
    //         res.send(auctions)
    //     } else {
    //         res.sendStatus(404)
    //     }
    // })

    return router
}

module.exports = {
    createAuctionRouter,
}