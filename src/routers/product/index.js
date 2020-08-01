const express = require('express')
const bodyParser = require('body-parser')
const { Op  } = require("sequelize");

const createProductRouter = ({ Product }) => {
    const router = express.Router()

    // get product by id
    router.get('/:id', async (req, res) => {
        // find by primary key = find by id
        const product = await Product.findByPk(req.params.id)
        if (product) {
            res.send(product)
        } else {
            res.sendStatus(404)
        }
    })

    //Create Product  cần check
    router.post('/', async (req, res) => {
        const product = {
            user_id : req.body.user_id,
            fruit_id : req.body.fruit_id,
            address_id : req.body.address_id,
            title : req.body.title,
            weight : req.body.weight,
            fruit_pct : req.body.fruit_pct,
            sugar_pct : req.body.sugar_pct,
            weight_avg : req.body.weight_avg,
            diameter_avg : req.body.diameter_avg,
            price_init : req.body.price_init,
            price_step : req.body.price_step,
            price_cur : req.body.price_cur,
            product_status : req.body.product_status       
        }

        await Product.create(product)
            .then(data => res.send(data))
            .catch(err => {
                res.status(500).send({
                    message: err.message
                })
            })
    })
    // get GetIdProductAndIdUser after create product chưa hoàn thành
    router.get('/id/:id', async (req, res) => {
        // find by primary key = find by id
        const product = await Product.findOne({
            order : ['id' , 'DESC'],
            user_id : req.params.user_id,
            id : req.params.id,
            limit: 1
        })
        if (product) {
            res.send(product)
        } else {
            res.sendStatus(404)
        }
    })

    //get product at that product_id and user_id (selectTitleProduct) (selectStartDateProduct) (selectWeight_PricecurStep) (selectInformationOfProduct)
    router.get('/user/:user_id', async (req, res) => {
        // find by primary key = find by id
        await Product.findAll({
            where: {
                [Op.and]: [
                    {user_id: req.params.user_id},
                    {id:req.params.id}
                ]               
              }
        })
        if (product) {
            res.send(product)
        } else {
            res.sendStatus(404)
        }
    })


    // get all products
    router.get('/', async (req, res) => {
        // offset: number of records you skip
        const offset = Number.parseInt(req.query.offset) || 0
        // limit: number of records you get
        const limit = Number.parseInt(req.query.limit) || 10

        const products = await Product.findAll({ offset, limit })

        if(products){
            res.send(products)
        } else {
            res.sendStatus(404)
        }
    })

    return router
}

module.exports = {
    createProductRouter
}
