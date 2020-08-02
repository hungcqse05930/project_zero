const express = require('express')

const createAuctionBidRouter = ({ AuctionBid }) => {
    const router = express.Router()

    //get selectAllBidOfUser
    router.get('/', async (req, res) => {
        // find by primary key = find by id
        const auction_bid = await AuctionBid.count(
            { attributes: ['id'] },
            { where: { bidder_user_id : req.params.bidder_user_id , auction_status: 1 } },
            {
                include: [
                    {
                        model: Auction,
                        required: false,
                    }]
            }
        ).then(auction_bid => {
            if (auction_bid) {
                res.send(auction_bid)
            } else {
                res.sendStatus(404)
            }
        });
    })

    return router
}

module.exports = {
    createAuctionBidRouter,
}
