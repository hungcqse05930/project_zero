const express = require('express')

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
