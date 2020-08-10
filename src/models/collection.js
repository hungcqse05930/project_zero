const { Sequelize, Model, DataTypes } = require('sequelize')

const createCollectionModel = (sequelize) => {
    class Collection extends Model { }

    // return class' structure
    return Collection.init({
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement:true
        },
        creator_admin_id: {
            type: DataTypes.BIGINT,
        },
        title: {
            type: DataTypes.STRING,
        },
        description: {
            type: DataTypes.STRING,
        },
        img_url: {
            type: DataTypes.STRING,
        },
        date_created: {
            type: 'TIMESTAMP'
        },
        date_ended: {
            type: 'TIMESTAMP'
        }
    }, {
        sequelize,
        tableName: 'collection',
        timestamps: false
    })
}

module.exports = {
    createCollectionModel,
}