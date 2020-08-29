// library
const express = require('express')
const { Sequelize, Op, QueryTypes, Transaction } = require('sequelize')

// middlewares
const auth = require('../../middlewares/auth')

const createWalletRouter = ({ Wallet, User, Product, Affair, Auction, AuctionBid, Transaction, Deposit }) => {
    const router = express.Router()

    //get wallet_amount by user_id
    router.get('/user/:id', async (req, res) => {
        // find by primary key = find by id
        Wallet.belongsTo(User, { foreignKey: 'user_id' })
        User.hasOne(Wallet, { foreignKey: 'user_id' })

        await Wallet.findOne({
            where: { user_id: req.params.id },
        }
        ).then(wallet => {
            if (wallet) {
                res.send(wallet)
            } else {
                res.sendStatus(404)
            }
        });
    })

    // update wallet_amount by wallet_id
    router.post('/topUp', async (req, res) => {
        await Transaction.create({
            rcv_wallet_id: req.body.id,
            amount: req.body.amount,
            notes: `Top up for wallet ${req.body.id}`
        }).then(result => {
            if (result) {
                res.send({
                    message: 'Nạp tiền thành công! 🤑'
                })
            } else {
                res.send({
                    message: 'Lỗi rồi. 😣'
                })
            }
        })
    })

    // get amount of money one has to pay
    router.get('/stats/:id/:wallet_id', async (req, res) => {
        // auction deposits (for sellers)
        Wallet.hasMany(Deposit, { foreignKey: 'src_wallet_id' })
        Deposit.belongsTo(Wallet, { foreignKey: 'src_wallet_id' })

        let auctionDeposits = await Deposit.sum('amount', {
            where: {
                src_wallet_id: req.params.wallet_id,
                notes: 'Tien coc cho dau gia'
            }
        }).then(sum => {
            return sum
        }).catch(() => {
            return 0
        })

        // auction bids (for buyers)
        Auction.hasMany(AuctionBid, { foreignKey: 'auction_id' })
        AuctionBid.belongsTo(Auction, { foreignKey: 'auction_id' })

        let bids = await AuctionBid.count({
            where: {
                bidder_user_id: req.params.id,

            },
            include: [
                {
                    model: Auction,
                    where: {
                        auction_status: 1,
                        bidder_user_id: Sequelize.col('AuctionBid.bidder_user_id')
                    },
                    required: true
                }
            ],
        }).then(result => {
            res.send(result)
        })

        User.hasMany(AuctionBid, { foreignKey: 'bidder_user_id' })
    })

    router.get('/deposit/wallet/id/:id', async (req, res) => {
        Wallet.hasMany(Deposit, { foreignKey: 'src_wallet_id' })
        Deposit.belongsTo(Wallet, { foreignKey: 'src_wallet_id' })

        await Deposit.findAll({
            where: {
                src_wallet_id: req.params.id,
                user_status: 0
            }
        }).then(deposits => {
            if (deposits.length > 0) {
                res.send(deposits)
            } else {
                res.send({
                    message: 'Không có gì cả.'
                })
            }
        }).catch(error => {
            res.status(500).send(error)
        })
    })

    router.get('/transaction/wallet/id/:id', async (req, res) => {
        // Transaction.belongsTo(Wallet, { as: 'src', foreignKey: 'src_wallet_id' })
        // Transaction.belongsTo(Wallet, { as: 'rcv', foreignKey: 'rcv_wallet_id' })

        // Wallet.hasMany(Transaction, { foreignKey: 'src_wallet_id' })
        Transaction.belongsTo(Wallet, { as: 'src', foreignKey: 'src_wallet_id' })
        Transaction.belongsTo(Wallet, { as: 'rcv', foreignKey: 'rcv_wallet_id' })

        User.hasOne(Wallet, { foreignKey: 'user_id' })
        Wallet.belongsTo(User, { foreignKey: 'user_id' })

        await Transaction.findAll({
            where: {
                [Op.or]: [
                    { src_wallet_id: { [Op.eq]: req.params.id } },
                    { rcv_wallet_id: { [Op.eq]: req.params.id } }
                ]
            },
            attributes: [
                'id',
                'date_created',
                'amount',
                'notes',
                [Sequelize.col('src.User.name'), 'src_name'],
                [Sequelize.col('rcv.User.name'), 'rcv_name'],
            ],
            include: [
                {
                    model: Wallet,
                    attributes: [],
                    include: [
                        {
                            model: User,
                            attributes: ['name']
                        }
                    ],
                    as: 'rcv'
                },
                {
                    model: Wallet,
                    attributes: [],
                    include: [
                        {
                            model: User,
                            attributes: ['name']
                        }
                    ],
                    as: 'src'
                },
            ]
        }).then(transactions => {
            res.send(transactions)
        }).catch(error => {
            console.log(error)
            res.status(500).send(error)
        })
    })

    return router
}

module.exports = {
    createWalletRouter,
}