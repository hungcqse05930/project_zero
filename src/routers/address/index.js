const express = require('express')
const bodyParser = require('body-parser')
const https = require('https')
const { Sequelize, Op, QueryTypes } = require('sequelize')
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
            user_id: req.body.user_id,
            province: req.body.province,
            district: req.body.district,
            ward: req.body.ward,
            address: req.body.address,
        }
        await Address.create(address)
            .then(data => res.send(data))
            .catch(err => {
                res.status(500).send({
                    message: err.message
                })
            })
    })

    // inser new address for exist user
    router.post('/user', async (req, res) => {
        const address = {
            user_id: req.body.user_id,
            province: req.body.province,
            district: req.body.district,
            ward: req.body.ward,
            address: req.body.address,
        }
        await Address.create(address)
            .then(data => res.send(data))
            .catch(err => {
                res.status(500).send({
                    message: err.message
                })
            })
    })

    // update address for exist user
    router.put('/id/:id', async (req, res) => {
        const user = await Address.update(
            {
                province: req.body.province,
                district: req.body.district,
                ward: req.body.ward,
                address: req.body.address,
            },
            {
                where: {
                    id: req.params.id,
                }
            })

        if (user) {
            res.send(user)
        } else {
            res.sendStatus(500)
        }
    })

    //delete address
    router.delete('/:id', async (req, res) => {
        const user = await Address.destroy(
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

    // address in forms

    // get provinces
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

    // get districts in a city
    router.get('/province/:id/district', (req, res) => {
        https.get(`https://thongtindoanhnghiep.co/api/city/${req.params.id}/district`, (response) => {
            response.pipe(res).once('error', () => res.sendStatus(500))
        }).end()
    })

    // get wards in a district
    router.get('/district/:id/ward', (req, res) => {
        https.get(`https://thongtindoanhnghiep.co/api/district/${req.params.id}/ward`, (response) => {
            response.pipe(res).once('error', () => res.sendStatus(500))
        })
    })
    return router
}

module.exports = {
    createAddressRouter,
}
