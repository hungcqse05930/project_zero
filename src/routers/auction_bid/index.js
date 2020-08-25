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
        Auction.hasMany(AuctionBid, { foreignKey: 'auction_id' })
        AuctionBid.belongsTo(Auction, { foreignKey: 'auction_id' })

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
    router.get('/auction/:id', async (req, res) => {
        // find by primary key = find by id
        User.hasMany(AuctionBid, { foreignKey: 'bidder_user_id' })
        AuctionBid.belongsTo(User, { foreignKey: 'bidder_user_id' })

        const autionBid = await AuctionBid.findAll(
            {
                where: { auction_id: req.params.id },
                order: [['date_created', 'DESC'], ['amount', 'DESC']],
                attributes: [
                    'id',
                    'amount',
                    'date_created',
                    [Sequelize.literal('User.name'), 'user_name']
                ],
                include: [{
                    model: User,
                    attributes: [],
                    required: true,
                }],
                limit: 10
            }
        )
        if (autionBid) {
            res.send(autionBid)
        } else {
            res.sendStatus(404)
        }
    })

     // aprove
    // count all bid of users
    router.get('/countBid/:id', async (req, res) => {
        // find by primary key = find by id
        const autionBid = await AuctionBid.count(
            {
                where: { bidder_user_id: req.params.id },
            }
        )
        if (typeof autionBid == "number") {
            res.send({
                times: autionBid,
            })
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
                    res.status(404).send({
                        message: 'Bản ghi này không tồn tại trong hệ thống.'
                    });
                } else {
                    res.status(204).send({
                        message: 'Xóa bản ghi thành công.'
                    });
                }
            }).catch(function (e) {
                res.status(500).send({
                    message: 'Yêu cầu không hợp lệ.'
                });
            });
    })

    // get all bids from auction
    router.get('')

    return router
}

module.exports = {
    createAuctionBidRouter,
}
