// library
const express = require('express')
const { Sequelize, Op, QueryTypes } = require('sequelize')
// middlewares
const auth = require('../../middlewares/auth')
const product = require('../product')
const auction_bid = require('../auction_bid')
const auction = require('../../models/auction')

const createAffairRouter = ({ Affair, AffairChat , AffairContract , Product }) => {
    const router = express.Router()

    // Lấy các chat thuộc affair_id xếp theo thứ tự giảm dần theo thời gian, load 12 bản ghi mỗi lần.
    router.get('/chat/:id', async (req, res) => {

        const offset = Number.parseInt(req.query.offset) || 0
        // limit: number of records you get
        const limit = Number.parseInt(req.query.limit) || 12

        const chat = await AffairChat.findAll({
            where: { affair_id: req.params.id },
            offset, limit
        })
        if (chat) {
            res.send(chat)
        }
        else {
            res.send(status)
        }
    })

    // thêm chat mới
    router.post('/addChat', async (req, res) => {

        const chat = await AffairChat.create({
            affair_id: req.body.affair_id,
            sender_user_id: req.body.sender_user_id,
            content: req.body.sender_user_id
        })
        if (chat) {
            res.send(chat)
        }
        else {
            res.send(status)
        }
    })

    // Tạo mới hợp đồng
    router.post('/addContract', async (req, res) => {

        const contract = await AffairContract.create({
            affair_id: req.body.affair_id,
            product_id: req.body.product_id,
            shipment_user_id: req.body.shipment_user_id,
            shipment_date: req.body.shipment_date,
            shipment_late_fee: req.body.shipment_late_fee,
            payment_late_date: req.body.payment_late_date,
            preservative_amount: req.body.preservative_amount
        })
        if (contract) {
            res.send(contract)
        }
        else {
            res.send(status)
        }
    })

    // lấy ra tiền đấu giá (tính 10%)
    router.get('/percentAmount/:id' , async (req,res) =>{
        Product.hasOne(Affair, {foreignKey: 'id'})
        Affair.hasOne(Product, {foreignKey: 'product_id'})

        const percentAmount = await Product.findAll({
            attributes:['price_cur'],
            include:[{
                model: Affair,
                where: {
                    product_id: req.params.id,
                },
                required: true
            }]
        })
        if(percentAmount){
            res.send(percentAmount)
        }else{
            res.send(status)
        }
    })


    return router
}


module.exports = {
    createAffairRouter,
}