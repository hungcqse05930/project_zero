const express = require('express')
const bodyParser = require('body-parser')
const auth = require('../../middlewares/auth')
const { Sequelize, Op, QueryTypes } = require('sequelize')
const product = require('../product')


const createFruitRouter = ({ Fruit , Product }) => {
    const router = express.Router()

    // get titleOfFruit by id
    router.get('/:id', async (req, res) => {
        // find by primary key = find by id
        const fruit = await Fruit.findOne({
            attributes: ['title'],
            where: { id: req.params.id }
        })
        if (fruit) {
            res.send(fruit)
        } else {
            res.sendStatus(404)
        }
    })

    // // get all Fruit
    // router.get('/', async (req, res) => {
    //     // offset: number of records you skip
    //     const offset = Number.parseInt(req.query.offset) || 0
    //     // limit: number of records you get
    //     const limit = Number.parseInt(req.query.limit) || 20

    //     const fruit = await Fruit.findAll({ attributes: ['title'], offset, limit })

    //     if (fruit) {
    //         res.send(fruit)
    //     } else {
    //         res.sendStatus(404)
    //     }
    // })

    // count all fruit
    router.get('/', async (req, res) => {
        const fruit = await Fruit.count({
            where:{
                id:{
                    [Op.gt]: 0
                }
            }
        })

        if (typeof fruit == "number") {
            res.send({
                times: fruit,
            })
        } else {
            res.sendStatus(404)
        }
    })

    // Insert Fruit
    router.post('/insert', async (req, res) => {
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

    // update Fruit where fruit_id = ?
    router.put('/update/:id', async (req, res) => {
        const fruit = await Fruit.update(
            {
                title: req.body.title,
                icon_url: req.body.icon_url
            },
            {
                where: {
                    id: req.params.id
                }
            })
            .then(data => res.send(data))
            .catch(err => {
                res.status(500).send({
                    message: err.message
                })
            })
    })

    router.get('/search/:title', async (req, res) => {
        // offset: number of records you skip
        const offset = Number.parseInt(req.query.offset) || 0
        // limit: number of records you get
        const limit = Number.parseInt(req.query.limit) || 20

        const fruit = await Fruit.findAll({
            where: {
                title: { [Op.like]: '%' + req.params.title + '%' }
            },
            offset, limit
        })

        if (fruit) {
            res.send(fruit)
        } else {
            res.sendStatus(404)
        }
    })

    // delete Fruit where fruit_id = ?
    router.delete('/delete/:id', async (req, res) => {
        const fruit = await Fruit.destroy(
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

    // đếm số product mà đang bán loại quả này
    router.get('/count/:id', async (req, res) => {
        const fruit = await Product.count({
            where:{
                fruit_id: req.params.id
            }
        })

        if (typeof fruit == "number") {
            res.send({
                times: fruit,
            })
        } else {
            res.sendStatus(404)
        }
    })

    return router
}

module.exports = {
    createFruitRouter,
}
