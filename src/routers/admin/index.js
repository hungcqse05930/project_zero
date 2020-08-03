// library
const express = require('express')
const bodyParser = require('body-parser')
const sequelize = require('sequelize')

// middleware


// 
const createAdminRouter = ({ models }) => {
    const router = express.Router()

    // User
    // get all user
    // need auth
    //Get all product to display into post dashboard page
    // router.get('/product', async (req, res) => {
        // const products = await sequelize.query("SELECT distinct p.fruit_id, p.title as 'Tiêu đề', f.title as 'fruit_name', u.name, p.date_created, p.status FROM `semo_2.0`.product p  left join `semo_2.0`.fruit f on p.fruit_id = f.id  left join `semo_2.0`.user u on p.user_id = u.id"
        // )
        //     {
        //     distinct: true,
        //     include: [{
        //         model: fruit,
        //         model: user,
        //         required: false,
        //     }]
        // })
        // if (products) {
            // res.send(products)
        // } else {
            // res.sendStatus(404)
        // }
    // })

    return router
}

module.exports = {
    createAdminRouter,
}