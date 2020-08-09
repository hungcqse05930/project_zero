const express = require('express')
const { Sequelize, Op } = require('sequelize')

const createAuctionBidRouter = ({ AuctionBid, Auction, User }) => {
    const router = express.Router()

    // PENDING
    // !! model
    // get selectAllBidOfUser
    // query đang sai
    router.get('/:id', async (req, res) => {
        // find by primary key = find by id
        AuctionBid.belongsTo(Auction, { foreignKey: 'auction_id' })
        Auction.hasMany(AuctionBid, { foreignKey: 'bidder_user_id' })

        const auction_bid = await AuctionBid.count({
            where: { bidder_user_id: req.params.id },
            include: [
                {
                    model: Auction,
                    required: true,
                    where: {
                        auction_status: 1,
                        bidder_user_id: {
                            [Op.eq]: Sequelize.col('AuctionBid.bidder_user_id')
                        }
                    }
                }],
        })
        if (typeof auction_bid == "number") {
            res.send({
                times: auction_bid,
            })
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
                    attributes: ['name'],
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

    // add new auction_bid
    router.post('/', async (req, res) => {
        const newABid = {
            auction_id: req.body.auction_id,
            bidder_user_id: req.body.bidder_user_id,
            amount: req.body.amount,
        }

        await AuctionBid.create(newABid)
            .then(data => res.send(data))
            .catch(err => {
                res.status(500).send({
                    message: err.message
                })
            })
    })

    // delete bid where auction_bid = ?
    router.delete('/delete/:id', async (req, res) => {
        const bid = await AuctionBid.destroy(
            {
                where: {
                    id: req.params.id
                }
            })
            .then(function (rowsDeleted) {
                if (rowsDeleted == 0) {
                    res.status(404).json({
                        "error": "no todo found with that id"
                    });
                } else {
                    res.status(204).send();
                }
            }).catch(function (e) {
                res.status(500).json(e);
            });
    })

    return router
}

module.exports = {
    createAuctionBidRouter,
}
