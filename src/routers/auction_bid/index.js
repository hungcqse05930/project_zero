const express = require('express')

const createAuctionBidRouter = ({ AuctionBid, Auction }) => {
    const router = express.Router()

    // PENDING
    // !! model
    //get selectAllBidOfUser
    // query đang sai
    router.get('/:id', async (req, res) => {
        // find by primary key = find by id
        AuctionBid.belongsTo(Auction, { foreignKey: 'auction_id' })
        Auction.hasMany(AuctionBid, { foreignKey: 'bidder_user_id' })
        const auction_bid = await AuctionBid.count({
            include: [
                {
                    model: Auction,
                    required: true,
                    where: {auction_status: 1}
                }],
            where: { bidder_user_id: req.params.id},
            col: 'auction_id'
        })
        if (auction_bid) {
            res.send(auction_bid)
        } else {
            res.sendStatus(404)
        }

    })

    return router
}

module.exports = {
    createAuctionBidRouter,
}
