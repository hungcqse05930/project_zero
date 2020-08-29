const { Sequelize, Model, DataTypes } = require('sequelize')

const createDepositModel = (sequelize) => {
    class Deposit extends Model {}

    // return class' structure
    return Deposit.init({
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        src_wallet_id: {
            type: DataTypes.BIGINT
        },
        product_id: {
            type: DataTypes.BIGINT
        },
        amount: {
            type: DataTypes.DOUBLE
        },
        notes: {
            type: DataTypes.STRING
        },
        user_status :{
            type: DataTypes.TINYINT
        },
        admin_status: {
            type: DataTypes.TINYINT
        },
        date_created: {
            type: 'TIMESTAMP'
        }
    }, {
        sequelize,
        // name of the table in database
        tableName: 'deposit',
        // compulsary
        timestamps: false,
    })
}

module.exports = {
    createDepositModel,
}