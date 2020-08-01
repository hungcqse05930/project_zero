// library
const express = require('express')

// middlewares
const auth = require('../../middlewares/auth')

const createAuctionRouter = ({ Auction, Product }) => {
    const router = express.Router()
    
    //get aution_id by product_id
    router.get('/product/:id', async (req, res) => {
        // find by primary key = find by id
        const auctions = await Auction.findAll(
            { attributes: ['id'] },
            { where: { product_id: req.params.id, auction_status: 1 } },
            {
                include: [
                    {
                        model: Product,
                        required: false,
                    }]
            }
        ).then(auctions => {
            if (auctions) {
                res.send(auctions)
            } else {
                res.sendStatus(404)
            }
        });
    })

    return router
}

module.exports = {
    createAuctionRouter,
}