const express = require('express')
const bodyParser = require('body-parser')
const https = require('https')
const { response } = require('express')

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

    // address in forms

    const apiCityUrl = 'https://thongtindoanhnghiep.co/api/city';
    // get city
    router.get('/province', (_, res) => {
        https.request(apiCityUrl, response => {
            response.pipe(res).once('error', () => res.sendStatus(500))
        }).end()
    })

    return router
}

module.exports = {
    createAddressRouter,
}
