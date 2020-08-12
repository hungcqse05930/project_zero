const { Sequelize, Model, DataTypes } = require('sequelize')

const createCollectionAuctionModel = (sequelize) => {
    class CollectionAuction extends Model { }

    // return class' structure
    return CollectionAuction.init({
        id:{
            type: DataTypes.BIGINT,
            primaryKey:true,
            autoIncrement:true
        },
        collection_id: {
            type: DataTypes.BIGINT,
        },
        auction_id: {
            type: DataTypes.BIGINT,
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