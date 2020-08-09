// library
const express = require('express')
const { Sequelize, Op, QueryTypes } = require('sequelize')
// middlewares
const auth = require('../../middlewares/auth')
const product = require('../product')
const auction_bid = require('../auction_bid')
const auction = require('../../models/auction')

const createAuctionRouter = ({ Auction, Product, AuctionBid, Fruit, User }) => {
    const router = express.Router()

    // get auction date created
    // chưa rõ chức năng
    router.get('/product/:id', async (req, res) => {
        // find by primary key = find by id
        // Product.hasMany(Auction , {foreignKey: 'product_id'})
        // Auction.belongsTo(Product)
        // TODO: findAll where datediff 
        const auctions = await Auction.findAll(
            {
                where: { product_id: req.params.id, auction_status: 1 },
                attributes: ['date_created'],
                order: ['date_created','DESC']
            }
        )
        if (auctions) {
            res.send(auctions)
        } else {
            res.sendStatus(404)
        }

    })

    // get all information of auction
    // khi bấm vào 1 auction thì load ra tất cả thông tin của 1 auction và thêm delete auction_bid 
    router.get('/auctionBid', async (req, res) => {

        Auction.hasMany(AuctionBid, { foreignKey: 'auction_id' })
        AuctionBid.belongsTo(Auction, { foreignKey: 'auction_id' })

        const auctions = await Auction.findAll({
            include: [{
                model: AuctionBid,
                required: true,
            }]
        })
        if (auctions) {
            res.send(auctions)
        } else {
            res.sendStatus(404)
        }
    })

    // delete auction where auction_id = ?
    router.delete('/delete/:id', async (req, res) => {
        const auction = await Auction.destroy(
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

    // add new auction
    //create auction by id 

    // chưa check tại chưa biết sao tạo đc auction
    router.post('/', async (req, res) => {
        const newAuction = {
            product_id: req.body.product_id,
            price_cur: req.body.price_cur,
            views: req.body.views,
            date_closure: req.body.date_closure,
        }

        await Auction.create(newAuction)
            .then(data => res.send(data))
            .catch(err => {
                res.status(500).send({
                    message: err.message
                })
            })
    })

    // vao auction view + 1
    // Update update name , DOB , gender vaos bang user
    router.put('/update/:id', async (req, res) => {

        let auction = await Auction.findOne({ where: { product_id: req.params.id } })
        const info = await auction.increment('views', { by: 1 })

        if (auction) {
            res.send(info)
        } else {
            res.sendStatus(error)
        }
    })

    //select all auction wiht product , fruit , user
    router.get('/:id', async (req, res) => {

        Fruit.hasMany(Product, { foreignKey: 'fruit_id' })
        Product.belongsTo(Fruit, { foreignKey: 'fruit_id' })

        User.hasMany(Product, { foreignKey: 'user_id' })
        Product.belongsTo(User, { foreignKey: 'user_id' })

        Product.hasMany(Auction, { foreignKey: 'product_id' })
        Auction.belongsTo(Product, { foreignKey: 'product_id' })

        // offset: number of records you skip
        const offset = Number.parseInt(req.query.offset) || 0
        // limit: number of records you get
        const limit = Number.parseInt(req.query.limit) || 5

        const fruit = await Auction.findAll({
            where: { id: req.params.id },
            include: [{
                model: Product,
                required: true,
                include: [
                    {
                        model: User,
                        attributes: ['name', 'id', 'img_url', 'rate'],
                        required: true,
                    }, {
                        model: Fruit,
                        required: true,
                    }]
            }]
        })

        if (fruit) {
            res.send(fruit)
        } else {
            res.sendStatus(404)
        }
    })


    return router
}


module.exports = {
    createAuctionRouter,
}