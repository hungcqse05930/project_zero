const { Sequelize, Model, DataTypes } = require('sequelize')

const createWalletModel = (sequelize) => {
    class Wallet extends Model {}

    // return class' structure
    return Wallet.init({
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.BIGINT
        },
        amount: {
            type: DataTypes.DOUBLE
        },
        wallet_status: {
            type: DataTypes.TINYINT
        },
        date_created: {
            type: 'TIMESTAMP'
        }
    }, {
        sequelize,
        tableName: 'wallet',
        timestamps: false
    })
}

module.exports = {
    createWalletModel,
}