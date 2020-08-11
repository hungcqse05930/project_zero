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
// middleware



const createAdminRouter = ({ Admin, Product, Fruit, ProductUpdateRequest, User, ProductMedia,Collection, CollectionAuction }) => {
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

    //Review post
    router.post('/reviewProduct', async (req, res) => {
        const products = {
            fruit_title: req.body.fruit_title,
            product_id: req.body.product_id,
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
        await ProductUpdateRequest.create(products)
            .then(data => res.send(data))
            .catch(err => {
                res.status(500).send({
                    message: err.message
                })
            })
    })

    //Review produc_media
    router.put('/reviewMedia', async (req, res) => {
        const productMedias = await ProductMedia.update(
            {
                notes: req.body.notes
            },
            {
                where: {
                    id: req.body.id
                }
            })
        if (productMedias) {
            res.send(productMedias)
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

    return router
}

module.exports = {
    createAdminRouter,
}