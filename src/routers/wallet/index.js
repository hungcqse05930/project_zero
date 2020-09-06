// library
const express = require('express')
const jwt = require('jsonwebtoken')
const { Sequelize, Op, QueryTypes, Transaction } = require('sequelize')

// middlewares
const auth = require('../../middlewares/auth')

const createWalletRouter = ({ Wallet, User, Product, ProductMedia, Affair, Auction, AuctionBid, AffairContract, Transaction, Deposit }) => {
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
    router.get('/stats/:wallet_id', async (req, res) => {
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
            return sum
        }).catch(() => {
            return 0
        })

        res.send({
            deposits: auctionDeposits,
            bids: bids,
        })

        User.hasMany(AuctionBid, { foreignKey: 'bidder_user_id' })
    })

    Deposit.hasOne(Auction, { as: 'auction', foreignKey: 'deposit_id' })
    Auction.belongsTo(Deposit, { as: 'auction', foreignKey: 'deposit_id' })

    Deposit.hasOne(Affair, { as: 'affair', foreignKey: 'deposit_id' })
    Affair.belongsTo(Deposit, { as: 'affair', foreignKey: 'deposit_id' })

    Product.hasMany(Auction, { foreignKey: 'product_id' })
    Product.hasMany(Affair, { foreignKey: 'product_id' })

    Auction.belongsTo(Product, { foreignKey: 'product_id' })
    Affair.belongsTo(Product, { foreignKey: 'product_id' })

    Product.hasMany(ProductMedia, { foreignKey: 'product_id' })
    ProductMedia.belongsTo(Product, { foreignKey: 'product_id' })

    router.get('/deposit/wallet/id/:id', async (req, res) => {
        await Deposit.findAll({
            where: {
                src_wallet_id: req.params.id,
            },
            include: [
                {
                    model: Auction,
                    include: [
                        {
                            model: Product,
                            include: [
                                {
                                    model: ProductMedia,
                                    limit: 1
                                }
                            ]
                        }
                    ],
                    as: 'auction'
                },
                {
                    model: Affair,
                    include: [
                        {
                            model: Product,
                            include: [
                                {
                                    model: ProductMedia,
                                    limit: 1
                                }
                            ]
                        }
                    ],
                    as: 'affair'
                }
            ],
            order: [
                ['user_status', 'ASC'],
                ['date_created', 'DESC'],
            ]
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

    Transaction.belongsTo(Wallet, { as: 'src', foreignKey: 'src_wallet_id' })
    Transaction.belongsTo(Wallet, { as: 'rcv', foreignKey: 'rcv_wallet_id' })

    User.hasOne(Wallet, { foreignKey: 'user_id' })
    Wallet.belongsTo(User, { foreignKey: 'user_id' })

    router.get('/transaction/wallet/id/:id', async (req, res) => {
        // Transaction.belongsTo(Wallet, { as: 'src', foreignKey: 'src_wallet_id' })
        // Transaction.belongsTo(Wallet, { as: 'rcv', foreignKey: 'rcv_wallet_id' })

        // Wallet.hasMany(Transaction, { foreignKey: 'src_wallet_id' })


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
        })
            .then(transactions => {
                res.send(transactions)
            })
            .catch(error => {
                console.log(error)
                res.status(500).send(error)
            })
    })

    router.put('/deposit/pay', async (req, res) => {
        await Deposit.update({
            user_status: 1
        }, {
            where: {
                id: req.body.id
            }
        })
            // token is valid
            .then(async () => {
                await Transaction.create({
                    src_wallet_id: req.body.src_wallet_id,
                    rcv_wallet_id: 54,
                    amount: req.body.amount,
                    notes: `Tra tien coc ${req.body.id}`
                })

                let affair = await Affair.findOne({
                    where: {
                        deposit_id: req.body.id
                    }
                })

                await AffairContract.update({
                    contract_status: 1,
                }, {
                    where: {
                        affair_id: affair.id
                    }
                })
                    .then(result => {
                        res.send({
                            message: 'Chuyển tiền cọc thành công. 😝'
                        })
                        ressolve(true)
                    })
                    .catch(error => {
                        res.status(500).send({
                            message: 'Lỗi rồi, bạn thử lại sau nhé. 😥',
                            error: error
                        })
                    })
            })
            .catch(error => {
                res.status(500).send({
                    message: 'Lỗi rồi, bạn thử lại sau nhé. 😥',
                    error: error
                })
            })
    })

    return router
}

module.exports = {
    createWalletRouter,
}