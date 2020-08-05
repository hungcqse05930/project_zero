const express = require('express')
const bodyParser = require('body-parser')
// const { where } = require('sequelize/types')

const createAddressRouter = ({ Address }) => {
    const router = express.Router()

    // aprove 
    // !! add user_id - done
    // get address_id by address 
    router.get('/:id', async (req, res) => {
        // offset: number of records you skip
        // User.hasMany(Address , {foreignKey : 'user_id'})
        // Address.belongsTo(User , {foreignKey : 'user_id'})

        const offset = Number.parseInt(req.query.offset) || 0
        // limit: number of records you get
        const limit = Number.parseInt(req.query.limit) || 5

        const address = await Address.findAll({
            where: {user_id : req.params.id},
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
            ward : req.body.ward,
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

    return router
}

module.exports = {
    createAddressRouter,
}
