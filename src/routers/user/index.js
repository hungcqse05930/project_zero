// library
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const uniqid = require('uniqid')
const { Sequelize, Op, QueryTypes } = require('sequelize')

// middlewares
const auth = require('../../middlewares/auth')
// const { where } = require('sequelize/types')
// const { Model } = require('sequelize/types')

const createUserRouter = ({ User, Product, Address, AffairRating, Auction, Fruit, Wallet, ProductMedia }) => {
    const router = express.Router()

    // === BEFORE LOGIN ===
    // check existed phone
    router.get('/existed/:phone', async (req, res) => {
        const phone = await User.findOne({
            where: {
                phone: req.params.phone
            }
        })

        if (phone) {
            res.send({
                existed: true
            })
        } else {
            res.send({
                existed: false
            })
        }
    })

    // login
    router.post('/login', async (req, res) => {
        User.hasMany(Address, { foreignKey: 'user_id' })
        Address.belongsTo(User, { foreignKey: 'user_id' })

        User.hasOne(Wallet, { foreignKey: 'user_id' })
        Wallet.belongsTo(User, { foreignKey: 'user_id' })

        User.findOne({
            where: {
                phone: req.body.phone
            },
            include: [
                {
                    model: Address,
                    // require: true,
                    attributes: ['province'],
                    where: {
                        default_address: 1
                    },
                    required: false
                },
                {
                    model: Wallet,
                    required: true
                }
            ]
        })
            .then((user) => {
                // wrong phone number
                if (!user) {
                    return res.status(401).send({
                        message: "Số điện thoại chưa được đăng ký tại semo."
                    })
                }

                // compare password with the existing in DB
                bcrypt.compare(req.body.password, user.password)
                    .then((valid) => {
                        if (!valid) {
                            return res.status(401).send({
                                message: "Hãy kiểm tra lại mật khẩu."
                            })
                        }

                        // generate token
                        const token = jwt.sign(
                            { id: user.id },
                            'HELLO_SEMO',
                            { expiresIn: '24h' })

                        res.status(200).json({
                            token: token,
                            user: user
                        })
                    })
                    .catch((error) => {
                        return res.status(500).send({
                            error: error
                        })
                    })
            })
            .catch((error) => {
                return res.status(500).json({
                    error: error.message
                })
            })
    })

    // get user from token
    router.get('/user', async (req, res, next) => {
        let token = req.headers.token

        jwt.verify(token, 'HELLO_SEMO', (err, decoded) => {
            // token is invalid
            if (err) {
                return res.status(401).json({
                    title: 'Vui lòng đăng nhập lại. 🙄'
                })
            }

            // token is valid
            User.hasMany(Address, { foreignKey: 'user_id' })
            Address.belongsTo(User, { foreignKey: 'user_id' })

            User.hasOne(Wallet, { foreignKey: 'user_id' })
            Wallet.belongsTo(User, { foreignKey: 'user_id' })

            User.findOne({
                where: {
                    id: decoded.id
                },
                include: [
                    {
                        model: Address,
                        // require: true,
                        attributes: ['province'],
                        where: {
                            default_address: 1
                        },
                        required: false
                    },
                    {
                        model: Wallet,
                        required: true
                    }
                ]
            })
                .then((user) => {
                    // wrong phone number
                    if (!user) {
                        return res.status(401).send({
                            message: "Người dùng không hợp lệ. 😪"
                        })
                    }

                    res.status(200).json({
                        user: user
                    })
                })
                .catch((error) => {
                    return res.status(500).json({
                        error: error.message
                    })
                })
        })
    })

    // sign up
    router.post('/signup', async (req, res) => {
        // hash password then create a record in `user` table
        bcrypt.hash(req.body.password, 10)
            .then((hash) => {
                // new user created
                const img_dir = uniqid()

                const user = new User({
                    phone: req.body.phone,
                    password: hash,
                    img_dir: img_dir
                })

                // save to the database
                user.save().then(() => {
                    res.status(201).send({
                        message: 'Cảm ơn và chào mừng đã đến với chúng mình. 🥰'
                    })
                }).catch((error) => {
                    res.status(403).send({
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

    // === AFTER LOGIN ===
    // user - get info
    router.get('/info/id/:id', async (req, res, next) => {

        User.hasMany(Address, { foreignKey: 'user_id' })
        Address.belongsTo(User, { foreignKey: 'user_id' })

        const user = await User.findOne({
            attributes: ['phone', 'name', 'gender', 'dob', 'img_url', 'rate',
                [Sequelize.fn('timestampdiff', Sequelize.literal('month'), Sequelize.col('User.date_created'), Sequelize.literal('CURRENT_TIMESTAMP')), 'membership']
            ],
            where: { id: req.params.id },
            include: [{
                model: Address,
                require: true,
                attributes: ['province'],
            }]
        })

        if (user) {
            res.send(user)
        } else {
            res.sendStatus(404)
        }
    })

    router.post('/feedback', async (req, res) => {
        await AffairRating.create({
            rater_user_id: req.body.rater_user_id,
            rated_user_id: req.body.rated_user_id,
            rate: req.body.rate,
            description: req.body.description
        })
            .then(() => {
                res.send({
                    message: 'Cảm ơn bạn rất nhiều. 🥰'
                })
            })
            .catch(error => {
                res.status(500).send(error)
            })
    })

    // get user_name by user_id from (product) 
    router.get('/:id', async (req, res) => {
        // find by primary key = find by id
        Product.belongsTo(User, { foreignKey: 'user_id' })
        User.hasMany(Product, { foreignKey: 'user_id' })
        const user = await User.findOne(
            {
                attributes: ['name'],
                where: { id: req.params.id }
            })
        if (user) {
            res.send(user)
        } else {
            res.sendStatus(404)
        }
    })

    // get phone name dob gender (hồ sơ)
    router.get('/info/profile/:id', async (req, res) => {
        // find by primary key = find by id
        const user = await User.findOne(
            {
                where: { id: req.params.id }
            })
        if (user) {
            res.send(user)
        } else {
            res.sendStatus(404)
        }
    })

    // get user_name , rating , avatar_url
    router.get('/product/:id', async (req, res) => {
        // find by primary key = find by id
        Product.belongsTo(User, { foreignKey: 'user_id' })
        User.hasMany(Product, { foreignKey: 'user_id' })
        const users = await Product.findOne(
            {
                where: { id: req.params.id },
                include: [{
                    model: User,
                    attributes: ['name', 'img_url', 'rate'],
                    require: true
                }]
            })
        if (users) {
            res.send(users)
        } else {
            res.sendStatus(404)
        }
    })

    // Update update name , DOB , gender vaos bang user
    router.put('/info', async (req, res) => {
        const user = await User.update(
            {
                name: req.body.name,
                gender: req.body.gender,
                dob: req.body.dob,
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

    // Update update name , DOB , gender vaos bang user
    router.put('/avatar', async (req, res) => {
        const user = await User.update(
            {
                img_url: req.body.img_url
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

    // Search nguoi dung lien quan
    router.get('/search/:name', async (req, res) => {
        User.hasMany(Address, { foreignKey: 'user_id' })
        Address.belongsTo(User, { foreignKey: 'user_id' })

        const users = await User.findAll({
            attributes: ['name', 'img_url', 'rate'],
            include: [{
                model: Address,
                attributes: ['province'],
                required: true
            }],
            where: {
                name: { [Op.like]: '%' + req.params.name + '%' }
            },
        })
        if (users) {
            res.send(users)
        } else {
            res.sendStatus(404)
        }
    })

    // change password
    router.put('/password/:id', async (req, res) => {
        User.findOne({
            where: {
                id: req.params.id
            }
        }).then(user => {
            if (!user) {
                return res.status(401).send({
                    message: "Tài khoản không còn tồn tại trên semo. 💀"
                })
            }

            // compare password with the existing in DB
            bcrypt.compare(req.body.password, user.password)
                .then((valid) => {
                    if (!valid) {
                        return res.status(401).send({
                            message: "Hãy kiểm tra lại mật khẩu hiện tại. 🚫"
                        })
                    }

                    bcrypt.hash(req.body.new_password, 10)
                        .then((hash) => {
                            user.update({
                                password: hash
                            })
                        })
                        .then(() => {
                            res.send({
                                message: 'Cập nhật mật khẩu thành công'
                            })
                        })
                })
                .catch((error) => {
                    return res.status(500).send({
                        error: error
                    })
                })
        })
    })

    // user profile
    router.get('/profile/:id', async (req, res) => {
        User.hasMany(Address, { foreignKey: 'user_id' })
        Address.belongsTo(User, { foreignKey: 'user_id' })

        User.hasMany(Product, { foreignKey: 'user_id' })
        Product.belongsTo(User, { foreignKey: 'user_id' })

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
                    user_id: req.params.id
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

        const user = await User.findOne({
            where: {
                id: req.params.id
            },
            attributes: {
                include: [
                    [Sequelize.fn('timestampdiff', Sequelize.literal('month'), Sequelize.col('User.date_created'), Sequelize.literal('CURRENT_TIMESTAMP')), 'membership']
                ]
            },
            include: [
                {
                    model: Address,
                    where: {
                        default_address: 1
                    }
                }
            ]
        })

        res.send({
            user: user,
            auctions: products
        })
    })

    return router
}

module.exports = {
    createUserRouter,
}
