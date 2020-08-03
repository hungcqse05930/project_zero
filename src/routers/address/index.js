const express = require('express')
const bodyParser = require('body-parser')

const createAddressRouter = ({ Address }) => {
    const router = express.Router()

    // PENDING
    // !! add user_id
    // get address_id by address 
    router.get('/', async (req, res) => {
        // offset: number of records you skip
        const offset = Number.parseInt(req.query.offset) || 0
        // limit: number of records you get
        const limit = Number.parseInt(req.query.limit) || 10

        const address = await Address.findAll({ offset, limit })

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
