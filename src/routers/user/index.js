const express = require('express')
const bcrypt = require('bcrypt')

const createUserRouter = ({ User }) => {
    const router = express.Router()

    // login
    router.post('/login', async (req, res) => {
        User.findOne({
            phone: req.body.phone
        })
            .then((user) => {
                // wrong phone number
                if (!user) {
                    res.sendStatus(401).json({
                        error: new Error('No such phone number! 🥱')
                    })
                }

                // 
                bcrypt.compare(req.body.password, user.password)
                    .then((valid) => {
                        if (!valid) {
                            res.sendStatus(401).json({
                                error: new Error('Invalid password. 😑')
                            })
                        }

                        res.status(200).json({
                            userId: user.id,
                            token: 'token'
                        })
                    })
                    .catch((error) => {
                        res.sendStatus(500).json({
                            error: error
                        })
                    })
            })
            .catch((error) => {
                res.sendStatus(500).json({
                    error: error
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
                res.sendStatus(500).json({
                    error: error
                })
            })
    })
}

module.exports = {
    createUserRouter,
}
