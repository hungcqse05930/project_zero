// library
const express = require('express')
const { Sequelize, Op } = require('sequelize')
// middlewares
const auth = require('../../middlewares/auth')
const product = require('../product')

const createAuctionRouter = ({ Auction, Product }) => {
    const router = express.Router()

    // get auction date created
    // chưa rõ chức năng
    router.get('/product/:id', async (req, res) => {
        // find by primary key = find by id
        // Product.hasMany(Auction , {foreignKey: 'product_id'})
        // Auction.belongsTo(Product)
        // TODO: findAll where datediff: 
        const auctions = await Auction.findAll(
            {
                attributes : ['date_created'],
                where: { product_id: req.params.id, auction_status: 1 },
            }
        ).then(auctions => {
            if (auctions) {
                res.send(auctions)
            } else {
                res.sendStatus(404)
            }
        });
    })

    router.get("/latest", async (request, response) => {
        const auctions = await Auction.findAll({
            // attributes : ['price_cur'],
            order: [
                [Sequelize.fn('timestampdiff', 'minute', Sequelize.col('date_closure'), Sequelize.literal('CURRENT_TIMESTAMP')), 'DESC'],
            ]
        })

        response.send(auctions);
    })

    return router
}

module.exports = {
    createAuctionRouter,
}