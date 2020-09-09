// library
const express = require('express')
const bodyParser = require('body-parser')
const sequelize = require('sequelize')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const uniqid = require('uniqid')


// middlewares
const auth = require('../../middlewares/auth')
const collection_auction = require('../../models/collection_auction')
const address = require('../address')
const { Sequelize, Transaction } = require('sequelize')
// middleware



const createAdminRouter = ({ Admin, Affair, Auction, Identity, Deposit, Product, Fruit, ProductUpdateRequest, User, ProductMedia, Collection, CollectionAuction, TransactionRequest, Address, Transaction, AffairContractUpdate, Wallet }) => {
    const router = express.Router()

    // LOG IN
    // log in for admin
    router.post('/login', async (req, res) => {
        Admin.findOne({
            where: {
                username: req.body.username
            }
        })
            .then(admin => {
                if (!admin) {
                    return res.status(401).send({
                        message: "Tài khoản không tồn tại."
                    })
                }

                // compare password with the existing in DB
                bcrypt.compare(req.body.password, admin.password)
                    .then((valid) => {
                        if (!valid) {
                            return res.status(401).send({
                                message: "Hãy kiểm tra lại mật khẩu."
                            })
                        }

                        // generate token
                        const token = jwt.sign(
                            { id: admin.id },
                            'ADMIN_SEMO',
                            { expiresIn: '24h' })

                        res.status(200).json({
                            token: token,
                            admin: admin
                        })
                    })
                    .catch((error) => {
                        return res.status(500).send({
                            message: error.message
                        })
                    })
            })
            .catch((error) => {
                return res.status(500).json({
                    message: error.message
                })
            })
    })

    // get admin
    router.get('/admin', async (req, res, next) => {
        let token = req.headers.token

        jwt.verify(token, 'ADMIN_SEMO', (err, decoded) => {
            // token is invalid
            if (err) {
                return res.status(401).json({
                    title: 'Vui lòng đăng nhập lại.'
                })
            }

            // token is valid
            Admin.findOne({
                where: {
                    id: decoded.id
                },
            })
                .then((admin) => {
                    // wrong phone number
                    if (!admin) {
                        return res.status(401).send({
                            message: "Người dùng không hợp lệ."
                        })
                    }

                    res.status(200).json({
                        admin: admin
                    })
                })
                .catch((error) => {
                    return res.status(500).json({
                        error: error.message
                    })
                })
        })
    })

    // HOME
    // get info
    router.get('/home', async (req, res) => {
        // fruits
        let fAll = await Fruit.count()

        // products
        let pAll = await Product.count()
        let p0 = await Product.count({
            where: {
                product_status: 0
            }
        })
        let p1 = await Product.count({
            where: {
                product_status: 1
            }
        })
        let p2 = await Product.count({
            where: {
                product_status: 2
            }
        })
        let p3 = await Product.count({
            where: {
                product_status: 3
            }
        })
        let p4 = await Product.count({
            where: {
                product_status: 4
            }
        })
        let p5 = await Product.count({
            where: {
                product_status: 5
            }
        })
        let p9 = await Product.count({
            where: {
                product_status: 9
            }
        })

        // users
        let uAll = await User.count()

        // auctions
        let aAll = await Auction.count()
        let a0 = await Auction.count({
            where: {
                auction_status: 0
            }
        })
        let a1 = await Auction.count({
            where: {
                auction_status: 1
            }
        })
        let a9 = await Auction.count({
            where: {
                auction_status: 9
            }
        })

        // affairs
        let afAll = await Affair.count()
        let af0 = await Affair.count({
            where: {
                affair_status: 0
            }
        })
        let af1 = await Affair.count({
            where: {
                affair_status: 1
            }
        })
        let af2 = await Affair.count({
            where: {
                affair_status: 2
            }
        })
        let af9 = await Affair.count({
            where: {
                affair_status: 9
            }
        })

        // deposits
        let dAll = await Deposit.count()

        // transaction
        let tAll = await Transaction.count()

        // admins
        let adAll = await Admin.count()

        res.send({
            fAll: fAll,
            pAll: pAll,
            p0: p0,
            p1: p1,
            p2: p2,
            p3: p3,
            p4: p4,
            p5: p5,
            p9: p9,
            uAll: uAll,
            aAll: aAll,
            a0: a0,
            a1: a1,
            a9: a9,
            afAll: afAll,
            af0: af0,
            af1: af1,
            af2: af2,
            af9: af9,
            dAll: dAll,
            tAll: tAll,
            adAll: adAll
        })
    })

    // Review post by id
    router.get('/id/:id', async (req, res) => {
        Product.belongsTo(Fruit, { foreignKey: 'fruit_id' })
        Fruit.hasMany(Product, { foreignKey: 'fruit_id' })
        const products = await Product.findAll({
            where: { id: req.params.id },
            distinct: true,
            include: [{
                model: Fruit,
                required: true
            }]
        })
        if (products) {
            res.send(products)
        } else {
            res.sendStatus(404)
        }
    })

    // Get all products for admin
    router.get('/product/', async (req, res) => {
        // user 1 - n product
        User.hasMany(Product, { foreignKey: 'user_id' })
        Product.belongsTo(User, { foreignKey: 'user_id' })

        // fruit 1 - n product
        Fruit.hasMany(Product, { foreignKey: 'fruit_id' })
        Product.belongsTo(Fruit, { foreignKey: 'fruit_id' })

        // product 1 - nproductmedia
        // Product.hasMany(ProductMedia, { foreignKey: 'product_id' })
        // ProductMedia.belongsTo(Product, { foreignKey: 'product_id' })

        // product 1 - n address
        // Address.hasMany(Product, { foreignKey: 'address_id' })
        // Product.belongsTo(Address, { foreignKey: 'address_id' })

        const products = await Product.findAll({
            attributes: [
                'id',
                'title',
                'product_status',
                'date_created',
                [Sequelize.literal('Fruit.title'), 'fruit_title'],
                [Sequelize.literal('User.name'), 'user_name']
            ],
            include: [
                {
                    model: Fruit,
                    attributes: [

                    ],
                    // required: true
                },
                {
                    model: User,
                    attributes: [
                        // 'name'
                    ],
                    required: true
                },
            ],
            order: [
                ['date_created', 'DESC']
            ]
        })

        if (products) {
            res.send(products)
        } else {
            res.sendStatus(404)
        }
    })

    // Review post by id co media
    router.get('/review/:id', async (req, res) => {
        // address 1 - n product
        Address.hasMany(Product, { foreignKey: 'address_id' })
        Product.belongsTo(Address, { foreignKey: 'address_id' })

        // product 1 - n product_media
        Product.hasMany(ProductMedia, { foreignKey: 'product_id' })
        ProductMedia.belongsTo(Product, { foreignKey: 'product_id' })

        Product.belongsTo(Fruit, { foreignKey: 'fruit_id' })
        Fruit.hasMany(Product, { foreignKey: 'fruit_id' })

        const product = await Product.findOne({
            where: { id: req.params.id },
            include: [
                {
                    model: Address,
                    // required: true
                },
                {
                    model: ProductMedia,
                    // required: true
                }, {
                    model: Fruit,
                    // required: true
                }
            ]
        })

        // if (product) {
        res.send(product)
        // } else {
        // res.sendStatus(404)
        // }
    })

    // Review post by id bổ sung address
    router.get('/Product/:id', async (req, res) => {

        Address.hasMany(Product, { foreignKey: 'address_id' })
        Product.belongsTo(Address, { foreignKey: 'address_id' })

        Product.belongsTo(Fruit, { foreignKey: 'fruit_id' })
        Fruit.hasMany(Product, { foreignKey: 'fruit_id' })

        const products = await Product.findAll({
            where: { id: req.params.id },
            distinct: true,
            include: [{
                model: Fruit,
                required: true
            }, {
                model: Address,
                attributes: ['province'],
                required: true
            }]
        })
        if (products) {
            res.send(products)
        } else {
            res.sendStatus(404)
        }
    })

    //Review post
    router.post('/reviewProduct', async (req, res) => {
        const review = {
            product_id: req.body.product_id,
            fruit_title: req.body.fruit_title,
            admin_id: req.body.admin_id,
            title: req.body.title,
            weight: req.body.weight,
            fruit_pct: req.body.fruit_pct,
            sugar_pct: req.body.sugar_pct,
            weight_avg: req.body.weight_avg,
            diameter_avg: req.body.diameter_avg,
            price_init: req.body.price_init,
            price_step: req.body.price_step,
            notes: req.body.notes,
        }

        await ProductUpdateRequest.create(review)
            .then(response => {
                res.status(200).send({
                    message: 'Kiểm duyệt thành công.'
                })
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message
                })
            })
    })

    //Review produc_media
    router.post('/reviewMedia', async (req, res) => {
        const productMedias = await ProductMedia.update(
            {
                notes: req.body.notes || null,
                product_media_status: req.body.notes === null ? 2 : 0
            },
            {
                where: {
                    id: req.body.id
                }
            })
        if (productMedias) {
            // console.log('success update productMedias')
            // res.send(productMedias)
        } else {
            res.sendStatus(error)
        }
    })

    //Screen name: Dashboard - 1
    //Function name: getAllProduct
    //Description: Get all product for displaying
    //Created by: HaPTH
    //Get all product to display into post dashboard page
    router.get('/', async (req, res) => {
        Product.belongsTo(Fruit, { foreignKey: 'fruit_id' })
        Fruit.hasMany(Product, { foreignKey: 'fruit_id' })

        Product.belongsTo(User, { foreignKey: 'user_id' })
        User.hasMany(Product, { foreignKey: 'user_id' })

        const products = await Product.findAll({
            distinct: true,
            attributes: ['id', 'title', 'date_created', 'product_status'],
            include: [{
                model: Fruit,
                required: true,
                attributes: ['title']
            }, {
                model: User,
                required: true,
                attributes: ['name']
            }]
        })

        if (products) {
            res.send(products)
        } else {
            res.sendStatus(404)
        }
    })

    // select information of accountUser (select name , img_url , id , trạng thái)
    router.get('/userInformation', async (req, res) => {
        const users = await User.findAll({
            attributes: ['id', 'name', 'img_url', 'user_status'],
        })
        if (users) {
            res.send(users)
        } else {
            res.sendStatus(404)
        }
    })

    // select information of accountAdmin (select name , img_url , id , trạng thái)
    router.get('/adminInformation', async (req, res) => {
        const admins = await Admin.findAll({
            attributes: ['id', 'name', 'department'],
        })
        if (admins) {
            res.send(admins)
        } else {
            res.sendStatus(404)
        }
    })

    // Update inffomation of account (password)
    router.put('/userUpdate', async (req, res) => {
        bcrypt.hash(req.body.password, 10)
            .then((hash) => {
                const user = User.update(
                    {
                        password: hash,
                    },
                    {
                        where: {
                            id: req.body.id
                        }
                    })
                if (user) {
                    res.send(user)
                } else {
                    res.sendStatus(error)
                }
            })
    })

    // Active or deActive account or Verify identity
    router.put('/userManagement', async (req, res) => {
        const admin = await User.update(
            {
                user_status: req.body.user_status,
            },
            {
                where: {
                    id: req.body.id
                }
            })
        if (admin) {
            res.send(admin)
        } else {
            res.sendStatus(error)
        }
    })

    // insert new account (admin)
    // cần xóa status ở bảng admin chưa xóa
    router.post('/newAdmin', async (req, res) => {
        bcrypt.hash(req.body.password, 10)
            .then((hash) => {
                // new admin created

                const admin = new Admin({
                    username: req.body.username,
                    password: hash,
                    name: req.body.name,
                    gender: req.body.gender,
                    dob: req.body.dob,
                    department: req.body.department,
                })

                // save to the database
                admin.save().then(() => {
                    res.status(201).json({
                        message: 'successfully create new admin'
                    })
                }).catch((error) => {
                    res.status(403).json({
                        error: error.message
                    })
                })

            })
            .catch((error) => {
                return res.status(500).json({
                    error: error
                })
            })
    })

    // create collection in collection_auction
    router.post('/setCollection', async (req, res) => {
        const collections = {
            collection_id: req.body.collection_id,
            auction_id: req.body.auction_id
        }
        await CollectionAuction.create(collections)
            .then(data => res.send(data))
            .catch(err => {
                res.status(500).send({
                    message: err.message
                })
            })
    })

    // create collection 
    router.post('/createCollection', async (req, res) => {
        const collections = {
            creator_admin_id: req.body.creator_admin_id,
            title: req.body.title,
            description: req.body.description,
            img_url: req.body.img_url,
            date_ended: req.body.date_ended,
        }
        await Collection.create(collections)
            .then(data => res.send(data))
            .catch(err => {
                res.status(500).send({
                    message: err.message
                })
            })
    })

    // AUCTION DASHBOARD
    // all auctions on dashboard
    router.get('/auction', async (req, res) => {
        // product 1 - n auction
        Product.hasMany(Auction, { foreignKey: 'product_id' })
        Auction.belongsTo(Product, { foreignKey: 'product_id' })

        const auctions = await Auction.findAll({
            attributes: [
                'id',
                'price_cur',
                'date_closure',
                'auction_status',
                [Sequelize.literal('Product.title'), 'product_title'],
            ],
            include: [{
                model: Product,
                attributes: []
            }],
            order: [['date_created', 'DESC']]
        })

        if (auctions) {
            res.status(200).send(auctions)
        } else {
            res.status(404).send()
        }
    })

    // edit auction status
    router.put('/auction/:id', async (req, res) => {
        const auction = await Auction.update(
            {
                auction_status: req.body.auction_status
            },
            {
                where: {
                    id: req.params.id
                }
            }
        )

        if (auction) {
            res.send({
                message: 'Cập nhật trạng thái thành công'
            })
        } else {
            res.sendStatus(500).send({
                message: 'Yêu cầu không hợp lệ'
            })
        }
    })

    // AFFAIR
    // get affairs for dashboard
    router.get('/affair', async (req, res) => {
        Product.hasMany(Affair, { foreignKey: 'product_id' })
        Affair.belongsTo(Product, { foreignKey: 'product_id' })

        await Affair.findAll({
            attributes: {
                include: [
                    [
                        Sequelize.literal(`(
                            SELECT title
                            FROM product
                            WHERE
                            product.id = Affair.product_id
                        )`),
                        'product'
                    ],
                    [
                        Sequelize.literal(`(
                            SELECT name
                            FROM user
                            WHERE
                            user.id = Affair.seller_user_id
                        )`),
                        'seller'
                    ],
                    [
                        Sequelize.literal(`(
                            SELECT name
                            FROM user
                            WHERE
                            user.id = Affair.buyer_user_id
                        )`),
                        'buyer'
                    ]
                ],
            },
            order: [['date_updated', 'DESC']]
        })
            .then(fruits => {
                if (!fruits) {
                    res.sendStatus(404)
                }

                res.send(fruits)
            })
            .catch(error => {
                res.send({
                    message: error.message
                })
            })
    })

    User.hasMany(AffairContractUpdate, { as: 'ship', foreignKey: 'shipment_user_id' })
    AffairContractUpdate.belongsTo(User, { as: 'ship', foreignKey: 'shipment_user_id' })
    User.hasMany(AffairContractUpdate, { as: 'change', foreignKey: 'change_user_id' })
    AffairContractUpdate.belongsTo(User, { as: 'change', foreignKey: 'change_user_id' })

    // get all contract updates of one contract
    router.get('/contract/:id/updates', async (req, res) => {
        await AffairContractUpdate.findAll({
            where: {
                affair_contract_id: req.params.id
            },
            attributes: {
                include: [
                    [Sequelize.col('ship.name'), 'shipment_user'],
                    [Sequelize.col('change.name'), 'change_user'],
                ]
            },
            include: [
                {
                    model: User,
                    attributes: [],
                    as: 'ship',
                },
                {
                    model: User,
                    attributes: [],
                    as: 'change'
                }
            ],
            order: [
                ['date_updated', 'DESC']
            ]
        })
        .then(updates => {
            res.send(updates)
        })
        .catch(error => {
            res.status(500).send(error)
        })
    })

    // IDENTITY
    // get all identities
    router.get('/identity', async (req, res) => {
        User.hasOne(Identity, { foreignKey: 'user_id' })
        Identity.belongsTo(User, { foreignKey: 'user_id' })

        await Identity.findAll({
            order: [
                ['date_created', 'DESC']
            ],
            include: [
                {
                    model: User,
                    attributes: [
                        'name',
                        'img_url'
                    ],
                    required: true,
                }
            ],
        })
            .then(identities => {
                res.send(identities)
            })
            .catch(error => {
                res.status(500).send(error)
            })
    })

    // review identity
    router.put(`/identity`, async (req, res) => {
        await Identity.update({
            identity_status: req.body.identity_status
        },
            {
                where: {
                    id: req.body.id,
                }
            })
            .then(() => {
                res.status(201).send({
                    message: 'Thành công.'
                })
            })
            .catch((error) => {
                res.status(500).send(error)
            })
    })

    // TRANSACTION_REQUEST
    // get all request
    router.get('/transaction/requests', async (req, res) => {
        Wallet.hasMany(TransactionRequest, { foreignKey: 'src_wallet_id' })
        TransactionRequest.belongsTo(Wallet, { foreignKey: 'src_wallet_id' })

        User.hasOne(Wallet, { foreignKey: 'user_id' })
        Wallet.belongsTo(User, { foreignKey: 'user_id' })

        await TransactionRequest.findAll({
            order: [
                ['date_created', 'DESC']
            ],
            include: [
                {
                    model: Wallet,
                    attributes: [],
                    include: [
                        {
                            model: User,
                            attributes: [
                                'name',
                                'img_url'
                            ],
                            required: true
                        }
                    ],
                    required: true,
                }
            ],
        })
            .then(identities => {
                res.send(identities)
            })
            .catch(error => {
                res.status(500).send(error)
            })
    })

    return router
}

module.exports = {
    createAdminRouter,
}