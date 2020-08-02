const { Sequelize, Model, DataTypes } = require('sequelize')

const createAuctionBidModel = (sequelize) => {
    class AuctionBid extends Model {}

    // return class' structure
    return AuctionBid.init({
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        auction_bid: {
            type: DataTypes.BIGINT
        },
        bidder_user_id: {
            type: DataTypes.BIGINT
        },
        amount: {
            type: DataTypes.DOUBLE
        },
        date_created: {
            type: 'TIMESTAMP'
        }
    }, {
        sequelize,
        // name of the table in database
        tableName: 'auction_bid',
        // compulsary
        timestamps: false,
    })
}

module.exports = {
    createAuctionBidModel,
}