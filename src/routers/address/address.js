const express = require('express')
const bodyParser = require('body-parser')

const createAddressRouter = ({ Address }) => {
    const router = express.Router()

    // get address_id by address chưa xong
    router.get('/:id', async (req, res) => {
        // find by primary key = find by id
        

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
