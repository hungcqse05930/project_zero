const express = require('express')
const bodyParser = require('body-parser')

const createInstitutionRouter = ({ Institution }) => {
    const router = express.Router()

    // APPROVED
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

    // APPROVED
    // get all institution
    router.get('/', async (req, res) => {

        const institution = await Institution.findAll()

        if (institution) {
            res.send(institution)
        } else {
            res.sendStatus(404)
        }
    })

    // APPROVED
    // Insert institution
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
