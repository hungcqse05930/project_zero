// library
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// middlewares
const auth = require('../../middlewares/auth')
// const { Model } = require('sequelize/types')

const createUserRouter = ({ User, Product, }) => {
    const router = express.Router()

    // === BEFORE LOGIN ===
    // login
    router.post('/login', async (req, res) => {
        User.findOne({
            where: {
                phone: req.body.phone
            }
        })
            .then((user) => {
                console.log(user.id)
                // wrong phone number
                if (!user) {
                    return res.status(401).json({
                        error: new Error('No such phone number! 🥱')
                    })
                }

                // compare password with the existing in DB
                bcrypt.compare(req.body.password, user.password)
                    .then((valid) => {
                        if (!valid) {
                            return res.status(401).json({
                                error: new Error('Invalid password. 😑')
                            })
                        }

                        // generate token
                        const token = jwt.sign({ userId: user.id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' })

                        res.status(200).json({
                            userId: user.id,
                            token: token
                        })
                    })
                    .catch((error) => {
                        return res.status(500).json({
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

    // sign up
    router.post('/signup', async (req, res) => {
        // hash password then create a record in `user` table
        bcrypt.hash(req.body.password, 10)
            .then((hash) => {
                // new user created
                const user = new User({
                    phone: req.body.phone,
                    password: hash
                })

                // save to the database
                user.save().then(() => {
                    res.status(201).json({
                        message: 'Created! 😋'
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
    router.get('/info', auth, async (req, res, next) => {

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

    // get user_name , rating , avatar_url
    router.get('/product/:id', async (req, res) => {
        // find by primary key = find by id
        Product.belongsTo(User, { foreignKey: 'user_id' })
        User.hasMany(Product, { foreignKey: 'user_id' })
        const user = await Product.findAll(
            {
                where: { id: req.params.id },
                include: [{
                    model: User,
                    require: true
                }]
            })
        if (user) {
            res.send(user)
        } else {
            res.sendStatus(404)
        }
    })

    // Update update name , DOB , gender vaos bang user
    router.post('/:id', async (req, res) => {
        // find by primary key = find by id
        const user = await User.update(
            {
                name: req.params.name,
                gender : req.params.gender,
                dob : req.params.dob,
                where: {
                    id: req.params.id
                }
            })
        if (user) {
            res.send(user)
        } else {
            res.sendStatus(404)
        }
    })

    

    // //get aution_id by product_id
    // router.get('/', async (req, res) => {
    //     // find by primary key = find by id
    //     const auctions = await Auction.findAll(
    //         { attributes: ['id'] },
    //         { where: { product_id: req.params.id } },
    //         {
    //             include: [
    //                 {
    //                     model: Product,
    //                     required: false,
    //                 }]
    //         }
    //     ).then(auctions => {
    //         if (auctions) {
    //             res.send(auctions)
    //         } else {
    //             res.sendStatus(404)
    //         }
    //     });
    // })



    return router
}

module.exports = {
    createUserRouter,
}
