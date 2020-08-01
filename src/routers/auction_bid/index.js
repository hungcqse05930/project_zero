const express = require('express')
const bodyParser = require('body-parser')

const createAuctionBidModel = ({ AuctionBid }) => {
    const router = express.Router()

        // get all person bid that product at that aution
        router.get('/', async (req, res) => {
            // find by primary key = find by id
            const products = await Product.findAll({
                include: [{
                    model: User,
                    where: {id: req.params.user_id},
                    required: false,
                   }]
                }).then(products => {
                    if(products){
                        res.send(products)
                    } else {
                        res.sendStatus(404)
                    }
                });
        })

    return router
}

module.exports = {
    createAuctionBidModel,
}
