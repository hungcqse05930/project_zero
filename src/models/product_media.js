const { Sequelize, Model, DataTypes } = require('sequelize')

const createProductMediaModel = (sequelize) => {
    class ProductMedia extends Model { }

    // return class' structure
    return ProductMedia.init({
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        product_id: {
            type: DataTypes.BIGINT
        },
        media_url: {
            type: DataTypes.STRING
        },
        product_media_status: {
            type: DataTypes.TINYINT
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
        tableName: 'product',
        // compulsary
        timestamps: false,
    })
}

module.exports = {
    createProductMediaModel,
}