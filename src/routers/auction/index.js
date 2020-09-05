// library
const express = require('express')
const { Sequelize, Op, QueryTypes } = require('sequelize')
// middlewares
const auth = require('../../middlewares/auth')

const createAuctionRouter = ({ Auction, Affair, Product, AuctionBid, Deposit, Fruit, User, Address, ProductMedia, Wallet }) => {
    const router = express.Router()

    function delay(ms) {
        return new Promise(ressolve => setTimeout(ressolve, ms))
    }

    // get auction date created
    // chưa rõ chức năng
    router.get('/product/:id', async (req, res) => {
        // find by primary key = find by id
        // Product.hasMany(Auction , {foreignKey: 'product_id'})
        // Auction.belongsTo(Product)
        // TODO: findAll where datediff 
        const auctions = await Auction.findAll(
            {
                where: { product_id: req.params.id, auction_status: 1 },
                attributes: ['date_created'],
                order: ['date_created', 'DESC']
            }
        )
        if (auctions) {
            res.send(auctions)
        } else {
            res.sendStatus(404)
        }

    })


    // most viewed
    router.get('/hottest', async (req, res) => {
        // product 1 - n auction
        Product.hasMany(Auction, { foreignKey: 'product_id' })
        Auction.belongsTo(Product, { foreignKey: 'product_id' })

        // address 1 - n product
        Address.hasMany(Product, { foreignKey: 'address_id' })
        Product.belongsTo(Address, { foreignKey: 'address_id' })

        // product 1 - n product_media
        Product.hasMany(ProductMedia, { foreignKey: 'product_id' })
        ProductMedia.belongsTo(Product, { foreignKey: 'product_id' })

        const auctions = await Auction.findAll({
            attributes: [
                'id',
                [Sequelize.fn('timediff', Sequelize.col('Auction.date_closure'), Sequelize.literal('CURRENT_TIMESTAMP')), 'remain_time'],
                [Sequelize.fn('datediff', Sequelize.col('Auction.date_closure'), Sequelize.literal('CURRENT_TIMESTAMP')), 'remain'],
                'price_cur',
                'views'
            ],
            limit: 10,
            order: [['views', 'DESC']],
            include: [
                {
                    model: Product,
                    attributes: ['id', 'title', 'weight'],
                    include: [
                        {
                            model: Address,
                            attributes: ['province'],
                            required: true
                        },
                        {
                            model: ProductMedia,
                            attributes: ['media_url'],
                            order: [['date_created', 'DESC']],
                            limit: 1
                        }
                    ],
                    required: true
                }
            ],
            where: {
                auction_status: 1
            }
        })


        if (auctions) {
            res.send(auctions)
        } else {
            res.sendStatus(404)
        }
    })

    // latest
    router.get('/latest', async (req, res) => {
        // product 1 - n auction
        Product.hasMany(Auction, { foreignKey: 'product_id' })
        Auction.belongsTo(Product, { foreignKey: 'product_id' })

        // address 1 - n product
        Address.hasMany(Product, { foreignKey: 'address_id' })
        Product.belongsTo(Address, { foreignKey: 'address_id' })

        // product 1 - n product_media
        Product.hasMany(ProductMedia, { foreignKey: 'product_id' })
        ProductMedia.belongsTo(Product, { foreignKey: 'product_id' })

        const auctions = await Auction.findAll({
            attributes: [
                'id',
                [Sequelize.fn('timediff', Sequelize.col('Auction.date_closure'), Sequelize.literal('CURRENT_TIMESTAMP')), 'remain_time'],
                [Sequelize.fn('datediff', Sequelize.col('Auction.date_closure'), Sequelize.literal('CURRENT_TIMESTAMP')), 'remain'],
                'price_cur',
                'views'
            ],
            order: [['date_created', 'DESC']],
            include: [
                {
                    model: Product,
                    attributes: ['id', 'title', 'weight'],
                    include: [
                        {
                            model: Address,
                            attributes: ['province'],
                            required: true
                        },
                        {
                            model: ProductMedia,
                            attributes: ['media_url'],
                            order: [['date_created', 'DESC']],
                            limit: 1
                        }
                    ],
                    required: true
                }
            ],
            where: {
                auction_status: 1
            }
        })


        if (auctions) {
            res.send(auctions)
        } else {
            res.sendStatus(404)
        }
    })

    // ending soon
    router.get('/closing', async (req, res) => {
        // product 1 - n auction
        Product.hasMany(Auction, { foreignKey: 'product_id' })
        Auction.belongsTo(Product, { foreignKey: 'product_id' })

        // address 1 - n product
        Address.hasMany(Product, { foreignKey: 'address_id' })
        Product.belongsTo(Address, { foreignKey: 'address_id' })

        // product 1 - n product_media
        Product.hasMany(ProductMedia, { foreignKey: 'product_id' })
        ProductMedia.belongsTo(Product, { foreignKey: 'product_id' })

        const auctions = await Auction.findAll({
            attributes: [
                'id',
                [Sequelize.fn('timediff', Sequelize.col('Auction.date_closure'), Sequelize.literal('CURRENT_TIMESTAMP')), 'remain_time'],
                [Sequelize.fn('datediff', Sequelize.col('Auction.date_closure'), Sequelize.literal('CURRENT_TIMESTAMP')), 'remain'],
                'price_cur',
                'views'
            ],
            limit: 30,
            order: [
                [Sequelize.fn('datediff', Sequelize.col('Auction.date_closure'), Sequelize.literal('CURRENT_TIMESTAMP')), 'ASC'],
                [Sequelize.fn('timediff', Sequelize.col('Auction.date_closure'), Sequelize.literal('CURRENT_TIMESTAMP')), 'ASC'],
            ],
            include: [
                {
                    model: Product,
                    attributes: ['id', 'title', 'weight'],
                    include: [
                        {
                            model: Address,
                            attributes: ['province'],
                            required: true
                        },
                        {
                            model: ProductMedia,
                            attributes: ['media_url'],
                            order: [['date_created', 'DESC']],
                            limit: 1
                        }
                    ],
                    required: true
                }
            ],
            where: {
                auction_status: 1
            }
        })


        if (auctions) {
            res.send(auctions)
        } else {
            res.sendStatus(404)
        }
    })

    // get all information of auction
    // khi bấm vào 1 auction thì load ra tất cả thông tin của 1 auction và thêm delete auction_bid 
    router.get('/auctionBid', async (req, res) => {

        Auction.hasMany(AuctionBid, { foreignKey: 'auction_id' })
        AuctionBid.belongsTo(Auction, { foreignKey: 'auction_id' })

        const auctions = await Auction.findAll({
            include: [{
                model: AuctionBid,
                required: true,
            }]
        })
        if (auctions) {
            res.send(auctions)
        } else {
            res.sendStatus(404)
        }
    })

    // delete auction where auction_id = ?
    router.delete('/delete/:id', async (req, res) => {
        const auction = await Auction.destroy(
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

    // add new auction
    //create auction by id 

    // chưa check tại chưa biết sao tạo đc auction
    router.post('/', async (req, res) => {
        const newAuction = {
            product_id: req.body.product_id,
            price_cur: req.body.price_cur,
            views: req.body.views,
            date_closure: req.body.date_closure,
        }

        await Auction.create(newAuction)
            .then(data => res.send(data))
            .catch(err => {
                res.status(500).send({
                    message: err.message
                })
            })
    })

    // update date_closure after creation
    router.put('/create', async (req, res) => {
        const auct = await Auction.findOne({
            where: {
                product_id: req.body.id,
                auction_status: 1
            },
            order: [
                ['date_created', 'DESC']
            ]
        })

        const auction = await Auction.update(
            {
                date_closure: req.body.date_closure
            },
            {
                where: {
                    id: auct.id
                },
            }
        )

        if (auction[0] === 1) {
            res.send({
                message: 'Thành công.'
            })
        } else {
            res.status(404).send({
                message: 'Thất bại.'
            })
        }

        let cur_date = new Date()
        await delay(Date.parse(req.body.date_closure) + 1000 * 60 * 60 * 7 - cur_date.getTime())

        // close auction
        await Auction.update({
            auction_status: 0
        },
            {
                where: {
                    id: auct.id
                },
            })
            .then(async () => {
                let updatedAuction = await Auction.findOne({
                    where: {
                        id: auct.id,
                        auction_status: 0
                    },
                    order: [
                        ['date_created', 'DESC']
                    ],
                    limit: 1
                })

                if (updatedAuction.bidder_user_id !== null) {

                    let wallet = await Wallet.findOne({
                        where: {
                            user_id: updatedAuction.bidder_user_id
                        }
                    })

                    await Deposit.create({
                        product_id: req.body.id,
                        src_wallet_id: wallet.id,
                        notes: 'Tien coc cho giao keo',
                    }).then(async () => {
                        let deposit = await Deposit.findOne({
                            where: {
                                product_id: req.body.id,
                                src_wallet_id: wallet.id,
                            },
                            order: [
                                ['date_created', 'DESC']
                            ]
                        })



                        await Affair.create({
                            product_id: req.body.id,
                            buyer_user_id: updatedAuction.bidder_user_id,
                            deposit_id: deposit.id
                        })
                    })
                }
            }).catch(error => {
                console.log(error)
            })
    })

    // vao auction view + 1
    router.put('/view/:id', async (req, res) => {

        let auction = await Auction.findOne({ where: { id: req.params.id } })
        const info = await auction.increment('views', { by: 1 })

        if (auction) {
            res.send(info)
        } else {
            res.sendStatus(error)
        }
    })

    //select all auction wiht product , fruit , user
    router.get('/id/:id', async (req, res) => {

        Fruit.hasMany(Product, { foreignKey: 'fruit_id' })
        Product.belongsTo(Fruit, { foreignKey: 'fruit_id' })

        User.hasMany(Product, { foreignKey: 'user_id' })
        Product.belongsTo(User, { foreignKey: 'user_id' })

        Product.hasMany(Auction, { foreignKey: 'product_id' })
        Auction.belongsTo(Product, { foreignKey: 'product_id' })

        Address.hasOne(Product, { foreignKey: 'address_id' })
        Product.belongsTo(Address, { foreignKey: 'address_id' })

        Product.hasMany(ProductMedia, { foreignKey: 'product_id' })
        ProductMedia.belongsTo(Product, { foreignKey: 'product_id' })

        // offset: number of records you skip
        // const offset = Number.parseInt(req.query.offset) || 0
        // limit: number of records you get
        // const limit = Number.parseInt(req.query.limit) || 5

        const fruit = await Product.findOne({
            include: [
                {
                    model: Fruit,
                    required: true,
                    attributes: ['id', 'title', 'icon_url'],
                },
                {
                    model: User,
                    attributes: ['name', 'id', 'img_url', 'rate'],
                    required: true,
                }, {
                    model: Auction,
                    where: { id: req.params.id },
                    attributes: [
                        'id',
                        'price_cur',
                        'date_created',
                        [Sequelize.fn('datediff', Sequelize.col('date_closure'), Sequelize.literal('CURRENT_TIMESTAMP')), 'remain_days'],
                        [Sequelize.fn('timediff', Sequelize.col('date_closure'), Sequelize.literal('CURRENT_TIMESTAMP')), 'remain_time'],
                        'auction_status'
                    ],
                    required: true,
                }, {
                    model: Address,
                    attributes: ['province'],
                    required: true
                }, {
                    model: ProductMedia,
                    attributes: ['media_url'],
                    // required: true
                }]
        })

        if (fruit) {
            res.send(fruit)
        } else {
            res.sendStatus(404)
        }
    })

    // get similar fruit
    router.get('/similar/:id', async (req, res) => {
        Product.hasMany(Auction, { foreignKey: 'product_id' })
        Auction.belongsTo(Product, { foreignKey: 'product_id' })

        Address.hasMany(Product, { foreignKey: 'address_id' })
        Product.belongsTo(Address, { foreignKey: 'address_id' })

        Product.hasMany(ProductMedia, { foreignKey: 'product_id' })
        ProductMedia.belongsTo(Product, { foreignKey: 'product_id' })

        Fruit.hasMany(Product, { foreignKey: 'fruit_id' })
        Product.belongsTo(Fruit, { foreignKey: 'fruit_id' })

        const auction = await Auction.findByPk(req.params.id)
        const product = await Product.findByPk(auction.product_id)

        const products = await Auction.findAll({
            attributes: ['id', 'price_cur', 'views',
                [Sequelize.fn('timediff', Sequelize.col('Auction.date_closure'), Sequelize.literal('CURRENT_TIMESTAMP')), 'remain_time'],
                [Sequelize.fn('datediff', Sequelize.col('date_closure'), Sequelize.literal('CURRENT_TIMESTAMP')), 'remain']],
            // limit: 10,
            where: { auction_status: 1 },
            include: [{
                model: Product,
                attributes: ['title', 'id', 'weight', 'fruit_id'],
                where: { fruit_id: product.fruit_id },
                required: true,
                include: [
                    {
                        model: Address,
                        attributes: ['province'],
                        required: true
                    },
                    {
                        model: ProductMedia,
                        attributes: ['media_url'],
                        required: true
                    }]
            }]
        })
        if (products) {
            res.send(products)
        } else {
            res.sendStatus(404)
        }
    })

    // Search bai viet lien quan (20 auction)
    router.get('/search/:title', async (req, res) => {
        Product.hasMany(Auction, { foreignKey: 'product_id' })
        Auction.belongsTo(Product, { foreignKey: 'product_id' })

        Address.hasMany(Product, { foreignKey: 'address_id' })
        Product.belongsTo(Address, { foreignKey: 'address_id' })

        Product.hasMany(ProductMedia, { foreignKey: 'product_id' })
        ProductMedia.belongsTo(Product, { foreignKey: 'product_id' })

        Fruit.hasMany(Product, { foreignKey: 'fruit_id' })
        Product.belongsTo(Fruit, { foreignKey: 'fruit_id' })

        const products = await Auction.findAll({
            attributes: ['id', 'price_cur', 'views',
                [Sequelize.fn('timediff', Sequelize.col('Auction.date_closure'), Sequelize.literal('CURRENT_TIMESTAMP')), 'remain_time'],
                [Sequelize.fn('datediff', Sequelize.col('date_closure'), Sequelize.literal('CURRENT_TIMESTAMP')), 'remain']],
            where: { auction_status: 1 },
            include: [{
                model: Product,
                attributes: ['title', 'id', 'weight', 'fruit_id'],
                where: {
                    title: { [Op.like]: '%' + req.params.title + '%' }
                },
                required: true,
                include: [
                    {
                        model: Address,
                        attributes: ['province'],
                        required: true
                    },
                    {
                        model: ProductMedia,
                        attributes: ['media_url'],
                        required: true
                    }]
            }]
        })
        if (products) {
            res.send(products)
        } else {
            res.sendStatus(404)
        }
    })


    // Lấy các auction đang mở (status = 1) từ user id (:id) mà người dùng ấy đang tham gia đấu giá
    router.get('/user/:id', async (req, res) => {
        // find by primary key = find by id
        AuctionBid.belongsTo(Auction, { foreignKey: 'auction_id' })
        Auction.hasMany(AuctionBid, { foreignKey: 'bidder_user_id' })

        const auction = await AuctionBid.findAll({
            where: { bidder_user_id: req.params.id },
            //group: ['auction_id'],
            include: [
                {
                    model: Auction,
                    required: true,
                    where: {
                        auction_status: 1
                    },

                }],
        })
        if (auction) {
            res.send(auction)
        } else {
            res.sendStatus(404)
        }
    })

    return router
}


module.exports = {
    createAuctionRouter,
}