const express = require('express')
const bodyParser = require('body-parser')

const createInstitutionRouter = ({ Institution }) => {
    const router = express.Router()

    // get institution by name
    router.get('/:id', async (req, res) => {
        // find by primary key = find by id
        const institution = await Institution.findByPk(req.params.id)

        if (institution) {
            res.send(institution)
        } else {
            res.sendStatus(404)
        }
    })

    // get all institution
    router.get('/', async (req, res) => {
        // offset: number of records you skip
        const offset = Number.parseInt(req.query.offset) || 0
        // limit: number of records you get
        const limit = Number.parseInt(req.query.limit) || 10

        const institution = await Institution.findAll({ offset, limit })

        if (institution) {
            res.send(institution)
        } else {
            res.sendStatus(404)
        }
    })

    // Insert v
    router.post('/', async (req, res) => {
        const institution = {
            name: req.body.name,
            province: req.body.province,
            address: req.body.address,
            phone_num: req.body.phone_num
        }

        await Institution.create(institution)
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
    createInstitutionRouter,
}
