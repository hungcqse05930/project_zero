const express = require('express')

const createAuctionBidRouter = ({ AuctionBid, Auction , User }) => {
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
                    where: { auction_status: 1 }
                }],
            where: { bidder_user_id: req.params.id },
            col: 'auction_id'
        })
        if (auction_bid) {
            res.send(auction_bid)
        } else {
            res.sendStatus(404)
        }

    })

    

    // aprove
    // get all person bid at one auction_id
    router.get('/aution/:id', async (req, res) => {
        // find by primary key = find by id
        User.hasMany(AuctionBid, { foreignKey: 'bidder_user_id' })
        AuctionBid.belongsTo(User, { foreignKey: 'bidder_user_id' })

        const autionBid = await AuctionBid.findAll(
            {
                where: { auction_id: req.params.id },
                include: [{
                    model: User,
                    required: false,
                }]
            }
        )
        if (autionBid) {
            res.send(autionBid)
        } else {
            res.sendStatus(404)
        }
    })

    return router
}

module.exports = {
    createAuctionBidRouter,
}
