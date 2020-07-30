const { Sequelize, Model, DataTypes } = require('sequelize')

const createAddressModel = (sequelize) => {
    class Address extends Model {}

    // return class' structure
    return Address.init({
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.BIGINT
        },
        default: {
            type: DataTypes.TINYINT
        },
        province: {
            type: DataTypes.STRING
        },
        district: {
            type: DataTypes.STRING
        },     
        ward: {
            type: DataTypes.STRING
        },
        address: {
            type: DataTypes.TINYINT
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
    createAddressModel,
}