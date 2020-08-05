const express = require('express')
const bodyParser = require('body-parser')
const https = require('https')
// const axios = require('axios')
const { response } = require('express')
// const { where } = require('sequelize/types')

const createAddressRouter = ({ Address }) => {
    const router = express.Router()

    // aprove 
    // !! add user_id - done
    // get address_id by address 
    router.get('/id/:id', async (req, res) => {
        // offset: number of records you skip
        // User.hasMany(Address , {foreignKey : 'user_id'})
        // Address.belongsTo(User , {foreignKey : 'user_id'})

        const offset = Number.parseInt(req.query.offset) || 0
        // limit: number of records you get
        const limit = Number.parseInt(req.query.limit) || 5

        const address = await Address.findAll({
            where: { user_id: req.params.id },
            offset, limit
        })

        if (address) {
            res.send(address)
        } else {
            res.sendStatus(404)
        }
    })

    // inser new address for new user
    router.post('/', async (req, res) => {
        const address = {
            province: req.body.province,
            district: req.body.district,
            ward: req.body.ward,
            address: req.body.address
        }
        await Address.create(address)
            .then(data => res.send(data))
            .catch(err => {
                res.status(500).send({
                    message: err.message
                })
            })
    })
    // address in forms

    // get city
    router.get('/province', (_, res) => {
        https.get('https://thongtindoanhnghiep.co/api/city', (response) => {
            // let provinces = response.LtsItem
            // provinces = provinces.map(province => ({
            //     id: province.ID,
            //     title: province.Title
            // }))
            // res.send(response.LtsItem)
            response.pipe(res).once('error', () => res.sendStatus(500))
        }).end()
    })
  
    return router
}

module.exports = {
    createAddressRouter,
}
