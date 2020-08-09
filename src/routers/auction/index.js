// library
const express = require('express')
const { Sequelize, Op, QueryTypes } = require('sequelize')
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
        const auctions = await models.Auction.findAll(
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

    router.get('/latest', async (req, res) => {
        // product 1 - n auction
        models.Product.hasMany(models.Auction, { foreignKey: 'product_id' })
        models.Auction.belongsTo(models.Product, { foreignKey: 'product_id' })

        // address 1 - n product
        models.Address.hasMany(models.Product, { foreignKey: 'address_id' })
        models.Product.belongsTo(models.Address, { foreignKey: 'address_id' })

        // product 1 - n product_media
        models.Product.hasMany(models.ProductMedia, { foreignKey: 'product_id' })
        models.ProductMedia.belongsTo(models.Product, { foreignKey: 'product_id' })

        const auctions = await models.Auction.findAll({
            attributes: [
                'id',
                [Sequelize.fn('datediff', Sequelize.col('Auction.date_closure'), Sequelize.literal('CURRENT_TIMESTAMP')), 'remain'],
                'price_cur',
                'views'
            ],
            limit: 10,
            order: [['views', 'DESC']],
            include: [
                {
                    model: models.Product,
                    attributes: ['id', 'title', 'weight'],
                    include: [
                        {
                            model: models.Address,
                            attributes: ['province'],
                            required: true
                        },
                        {
                            model: models.ProductMedia,
                            attributes: ['media_url'],
                            order: [['date_created', 'DESC']],
                            // required: true
                        }
                    ],
                    required: true
                }
            ],
        })


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
    router.put('/update/:id' , async (res,req) =>{
        const auction = await Auction.update({ where: { product_id: req.params.id } })
        const views = await Auction.increment('views' , {by : 1})
        if(views){
            res.send(views)
        }else {
            res.status(204).send();
        }
        
    })
    // router.get('/latest', async (req, res) => {
    //     // product 1 - n auction
    //     Product.hasMany(Auction, { foreignKey: 'product_id' })
    //     Auction.belongsTo(Product, { foreignKey: 'product_id' })

    //     // address 1 - n product
    //     Address.hasMany(Product, { foreignKey: 'address_id' })
    //     Product.belongsTo(Address, { foreignKey: 'address_id' })

    //     // product 1 - n product_media
    //     Product.hasMany(ProductMedia, { foreignKey: 'product_id' })
    //     ProductMedia.belongsTo(Product, { foreignKey: 'product_id' })

    //     const auctions = await Sequelize.query(
    //         'SELECT auction.id, product.title, auction.price_cur, datediff(auction.date_closure, CURRENT_TIMESTAMP) as remain, product.weight,       address.province, ( SELECT product_media.media_url FROM product_media WHERE product.id = product_media.product_id LIMIT 1) as media_url FROM address, auction, product WHERE address.id = product.address_id AND auction.product_id = product.id AND auction.auction_status = 1 GROUP BY auction.id ORDER BY remain ASC LIMIT 10',
    //         {
    //             type: QueryTypes.SELECT
    //         })

    //     if (auctions) {
    //         res.send(auctions)
    //     } else {
    //         res.sendStatus(404)
    //     }
    // })

    return router
}


module.exports = {
    createAuctionRouter,
}