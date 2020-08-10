const { Sequelize, Model, DataTypes } = require('sequelize')

const createCollectionAuctionModel = (sequelize) => {
    class CollectionAuction extends Model { }

    // return class' structure
    return CollectionAuction.init({
        collection_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
        },
        auction_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
        }
    }, {
        sequelize,
        tableName: 'collection_auction',
        timestamps: false
    })
}

module.exports = {
    createCollectionAuctionModel,
}