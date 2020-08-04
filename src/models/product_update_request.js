const { Sequelize, Model, DataTypes } = require('sequelize')

const createProductUpdateRequestModel = (sequelize) => {
    class ProductUpdateRequest extends Model { }

    // return class' structure
    return ProductUpdateRequest.init({
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        product_id: {
            type: DataTypes.BIGINT
        },
        admin_id: {
            type: DataTypes.BIGINT
        },
        title: {
            type: DataTypes.STRING
        },
        weight: {
            type: DataTypes.DOUBLE
        },
        fruit_pct: {
            type: DataTypes.FLOAT
        },
        sugar_pct: {
            type: DataTypes.FLOAT
        },
        weight_avg: {
            type: DataTypes.FLOAT
        },
        diameter_avg: {
            type: DataTypes.FLOAT
        },
        price_init: {
            type: DataTypes.DOUBLE
        },
        price_step: {
            type: DataTypes.DOUBLE
        },
        notes: {
            type: DataTypes.STRING
        },
        date_created: {
            type: 'TIMESTAMP'
        }
    }, {
        sequelize,
        // name of the table in database
        tableName: 'product_update_request',
        // compulsary
        timestamps: false,
    })
}

module.exports = {
    createProductUpdateRequestModel,
}