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
const { Sequelize } = require('sequelize')
// middleware



const createAdminRouter = ({ Admin, Auction, Product, Fruit, ProductUpdateRequest, User, ProductMedia, Collection, CollectionAuction, Address }) => {
    const router = express.Router()

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

        if(auctions) {
            res.status(200).send(auctions)
        } else {
            res.status(404).send()
        }
    })

    return router
}

module.exports = {
    createAdminRouter,
}