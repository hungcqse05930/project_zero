// library
const express = require('express')
const { Sequelize, Op } = require('sequelize')
// middlewares
const auth = require('../../middlewares/auth')
const product = require('../product')
const auction_bid = require('../auction_bid')

const createAuctionRouter = ({ Auction, Product, AuctionBid }) => {
    const router = express.Router()

    // get auction date created
    // chưa rõ chức năng
    router.get('/product/:id', async (req, res) => {
        // find by primary key = find by id
        // Product.hasMany(Auction , {foreignKey: 'product_id'})
        // Auction.belongsTo(Product)
        // TODO: findAll where datediff: 
        const auctions = await Auction.findAll(
            {
                where: { product_id: req.params.id, auction_status: 1 },
                attributes: ['date_created'],
            }
        )
        if (auctions) {
            res.send(auctions)
        } else {
            res.sendStatus(404)
        }

    })

    router.get("/latest", async (request, response) => {
        const auctions = await Auction.findAll({
            // attributes : ['price_cur'],
            order: [
                [Sequelize.fn('timestampdiff', 'minute', Sequelize.col('date_closure'), Sequelize.literal('CURRENT_TIMESTAMP')), 'DESC'],
            ]
        })

        response.send(auctions);
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
    router.put('/update/:id' , async (res,req) =>{
        const auction = await Auction.update({ where: { product_id: req.params.id } })
        const views = await Auction.increment('views' , {by : 1})
        if(views){
            res.send(views)
        }else {
            res.status(204).send();
        }
        
    })
    return router
}


module.exports = {
    createAuctionRouter,
}