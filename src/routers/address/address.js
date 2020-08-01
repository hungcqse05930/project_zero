const express = require('express')
const bodyParser = require('body-parser')

const createAddressRouter = ({ Address }) => {
    const router = express.Router()

    // get address_id by address chưa xong
    router.get('/', async (req, res) => {
        // offset: number of records you skip
        const offset = Number.parseInt(req.query.offset) || 0
        // limit: number of records you get
        const limit = Number.parseInt(req.query.limit) || 10

        const fruit = await Address.findAll({ offset, limit })

        if (address) {
            res.send(address)
        } else {
            res.sendStatus(404)
        }
    })

    return router
}

module.exports = {
    createAddressRouter,
}
