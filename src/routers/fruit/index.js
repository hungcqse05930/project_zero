const express = require('express')
const bodyParser = require('body-parser')
const auth = require('../../middlewares/auth')

const createFruitRouter = ({ Fruit }) => {
    const router = express.Router()

    // get Fruit by title
    router.get('/:title', async (req, res) => {
        // find by primary key = find by id
        const fruit = await Fruit.findOne(title)

        if (fruit) {
            res.send(fruit)
        } else {
            res.sendStatus(404)
        }
    })

    // get all Fruit
    router.get('/', async (req, res) => {
        // offset: number of records you skip
        const offset = Number.parseInt(req.query.offset) || 0
        // limit: number of records you get
        const limit = Number.parseInt(req.query.limit) || 10

        const fruit = await Fruit.findAll({ offset, limit })

        if (fruit) {
            res.send(fruit)
        } else {
            res.sendStatus(404)
        }
    })

    // Insert Fruit
    // router.get('/', async (req, res) => {
    //     // offset: number of records you skip
    //     const offset = Number.parseInt(req.query.offset) || 0
    //     // limit: number of records you get
    //     const limit = Number.parseInt(req.query.limit) || 10

    //     const Fruit = await Fruit.findAll({ offset, limit })

    //     if(Fruit){
    //         res.send(Fruit)
    //     } else {
    //         res.sendStatus(404)
    //     }
    // })

    // Insert Fruit
    router.post('/', auth, async (req, res) => {
    console.info(req.body)
        const fruit = {
            title: req.body.title,
            icon_url: req.body.icon_url
        }

        await Fruit.create(fruit)
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
    createFruitRouter,
}
