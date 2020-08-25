// library
const express = require('express')
const { Sequelize, Op, QueryTypes } = require('sequelize')
// middlewares
const auth = require('../../middlewares/auth')
const product = require('../product')
const auction_bid = require('../auction_bid')
const auction = require('../../models/auction')

const createAffairRouter = ({ Affair, AffairChat, AffairContract, Product, ProductMedia, Auction, User }) => {
    const router = express.Router()

    // Lấy các chat thuộc affair_id xếp theo thứ tự giảm dần theo thời gian, load 12 bản ghi mỗi lần.
    router.get('/chat/:id', async (req, res) => {

        const offset = Number.parseInt(req.query.offset) || 0
        // limit: number of records you get
        const limit = Number.parseInt(req.query.limit) || 12

        const chat = await AffairChat.findAll({
            where: { affair_id: req.params.id },
            offset, limit,

        })
        if (chat) {
            res.send(chat)
        }
        else {
            res.send(status)
        }
    })

    // get all information for affair view
    router.get('/id/:id', async (req, res) => {
        Affair.belongsTo(Product, { foreignKey: 'product_id' })
        Product.hasMany(Affair, { foreignKey: 'product_id' })

        Product.hasMany(ProductMedia, { foreignKey: 'product_id' })
        ProductMedia.belongsTo(Product, { foreignKey: 'product_id' })

        User.hasMany(Product, { foreignKey: 'user_id' })
        Product.belongsTo(User, { foreignKey: 'user_id' })

        Affair.hasOne(AffairContract, { foreignKey: 'affair_id' })
        AffairContract.belongsTo(Affair, { foreignKey: 'affair_id' })

        Affair.hasMany(AffairChat, { foreignKey: 'affair_id' })
        AffairChat.belongsTo(Affair, { foreignKey: 'affair_id' })

        await Affair.findOne({
            where: {
                id: req.params.id
            },
            include: [
                {
                    model: Product,
                    required: true,
                    include: [{
                        model: ProductMedia,
                        required: true
                    },
                    {
                        model: User,
                        required: true
                    }]
                },
                {
                    model: AffairChat,
                    // required: true
                },
                {
                    model: AffairContract,
                    // required: true
                }
            ]
        })
            .then(affair => {
                if (!affair) {
                    res.sendStatus(404)
                    return
                }

                res.send(affair)
            })
            .catch(error => {
                res.send(error)
            })
    })

    // Lấy các affair thuộc user_id 
    router.get('/getAll/:id', async (req, res) => {

        const offset = Number.parseInt(req.query.offset) || 0
        // limit: number of records you get
        const limit = Number.parseInt(req.query.limit) || 12

        User.hasMany(Product, { foreignKey: 'user_id' })
        Product.belongsTo(User, { foreignKey: 'user_id' })

        Product.hasMany(Affair, { foreignKey: 'product_id' })
        Affair.belongsTo(Product, { foreignKey: 'product_id' })

        const affair = await Affair.findAll({
            offset, limit,
            include: [{
                model: Product,
                attributes: ['id'],
                required: true,
                include: [{
                    model: User,
                    where: {
                        id: req.params.id
                    },
                    required: true
                }]
            }]
        })
        if (affair) {
            res.send(affair)
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
            payment_date: req.body.payment_date,
            payment_late_fee: req.body.payment_late_fee,
            preservative_amount: req.body.preservative_amount,
            change_user_id: req.body.change_user_id
        })
        if (contract) {
            res.send(contract)
        }
        else {
            res.send(status)
        }
    })

    // lấy ra tiền đấu giá (tính 10%)
    router.get('/percentAmount', async (req, res) => {
        Product.hasOne(Affair, { foreignKey: 'id' })
        Affair.hasOne(Product, { foreignKey: 'product_id' })

        Product.hasMany(Auction, { foreignKey: 'product_id' })
        Auction.belongsTo(Product, { foreignKey: 'product_id' })

        Affair.hasOne(AffairContract, { foreignKey: 'id' })
        AffairContract.belongsTo(Affair, { foreignKey: 'affair_id' })


        const percentAmount = await Product.findAll({
            attributes: ['price_cur'],
            include: [
                {
                    model: Auction,
                    where: {
                        price_cur: {
                            [Op.gt]: Sequelize.col('Product.price_init')
                        }
                    },
                    //required: true
                }, {
                    model: Affair,
                    where: {
                        product_id: {
                            [Op.eq]: Sequelize.col('Product.id')
                        }
                    },
                    //required: true,
                    include: {
                        model: AffairContract,
                        where: {
                            contract_status: 0
                        },
                        //required: true
                    }
                }],
            //price_cur : Number.parseFloat(Product.price_cur) * 0.1
        })


        if (percentAmount) {
            res.send(
                percentAmount
            )
        } else {
            res.send(404)
        }
    })

    // update affair_contract for bider_user_id
    router.put('/updateContract/:id', async (req, res) => {
        const update = await AffairContract.update({
            shipment_user_id: req.body.shipment_user_id,
            shipment_date: req.body.shipment_date,
            shipment_late_fee: req.body.shipment_late_fee,
            payment_date: req.body.payment_date,
            payment_late_fee: req.body.payment_late_fee,
            preservative_amount: req.body.preservative_amount,
            change_user_id: req.body.change_user_id
        },
            {
                where: {
                    id: req.params.id
                }
            })

        if (update) {
            res.send(update)
        } else {
            res.send(status)
        }
    })

    // update affair_contract for user_id
    router.put('/updateContract/:id', async (req, res) => {
        const update = await AffairContract.update({
            shipment_user_id: req.body.shipment_user_id,
            shipment_date: req.body.shipment_date,
            shipment_late_fee: req.body.shipment_late_fee,
            payment_date: req.body.payment_date,
            payment_late_fee: req.body.payment_late_fee,
            preservative_amount: req.body.preservative_amount,
            change_user_id: req.body.change_user_id,
            contract_status: req.body.contract_status
        },
            {
                where: {
                    id: req.params.id
                }
            })

        if (update) {
            res.send(update)
        } else {
            res.send(status)
        }
    })

    // update status for affair admin xài
    router.put('/adminUpdate/:id', async (req, res) => {
        const updateStatus = await Affair.update({
            affair_status: req.body.affair_status
        },
            {
                where: {
                    id: req.params.id
                }
            })

        if (updateStatus) {
            res.send(updateStatus)
        } else {
            res.send(status)
        }
    })

    return router
}


module.exports = {
    createAffairRouter,
}