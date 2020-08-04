const express = require('express')

const createIdentityRouter = ({ Identity }) => {
    const router = express.Router()

    // inser new address for new user
    router.post('/', async (req, res) => {
        const identity = {
            user_id:req.body.user_id,
            front_img_url: req.body.front_img_url,
            back_img_url: req.body.back_img_url,
            name : req.body.name,
            number: req.body.number,  
            date_dist : req.body.date_dist,
            province_dist: req.body.province_dist   
        }
        await Identity.create(identity)
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
    createIdentityRouter,
}
