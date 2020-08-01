const { Sequelize, Model, DataTypes } = require('sequelize')

const createAuctionModel = (sequelize) => {
    class Auction extends Model {}

    // return class' structure
    return Auction.init({
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        product_id: {
            type: DataTypes.BIGINT
        },
        bidder_user_id: {
            type: DataTypes.BIGINT
        },
        price_cur: {
            type: DataTypes.DOUBLE
        },
        views: {
            type: DataTypes.INTEGER
        },
        auction_status :{
            type: DataTypes.TINYINT
        },
        date_created: {
            type: 'TIMESTAMP'
        },
        date_closure: {
            type: 'TIMESTAMP'
        }
    }, {
        sequelize,
        // name of the table in database
        tableName: 'auction',
        // compulsary
        timestamps: false,
    })
}

module.exports = {
    createAuctionModel,
}