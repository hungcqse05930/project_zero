const express = require('express')
const bodyParser = require('body-parser')

const createinstituteQualityAccreditationModel = ({ InstituteQualityAccreditation }) => {
    const router = express.Router()

    // get InstituteQualityAccreditation by name
    router.get('/:name', async (req, res) => {
        // find by primary key = find by id
        const instituteQualityAccreditation = await InstituteQualityAccreditation.findOne(name)

        if (InstituteQualityAccreditation) {
            res.send(InstituteQualityAccreditation)
        } else {
            res.sendStatus(404)
        }
    })

    // get all InstituteQualityAccreditation
    router.get('/', async (req, res) => {
        // offset: number of records you skip
        const offset = Number.parseInt(req.query.offset) || 0
        // limit: number of records you get
        const limit = Number.parseInt(req.query.limit) || 10

        const instituteQualityAccreditation = await InstituteQualityAccreditation.findAll({ offset, limit })

        if (instituteQualityAccreditation) {
            res.send(instituteQualityAccreditation)
        } else {
            res.sendStatus(404)
        }
    })

    // Insert InstituteQualityAccreditation
    router.post('/', async (req, res) => {
        const instituteQualityAccreditation = {
            name: req.body.name,
            province: req.body.province,
            address: req.body.address,
            phone_num: req.body.phone_num
        }

        await InstituteQualityAccreditation.create(instituteQualityAccreditation)
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
    createFruitRouter,
}
