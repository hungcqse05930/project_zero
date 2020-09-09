const { Sequelize, Model, DataTypes } = require('sequelize')

const createTransactionRequestModel = (sequelize) => {
    class TransactionRequest extends Model {}

    return TransactionRequest.init({
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        src_wallet_id: {
            type: DataTypes.BIGINT
        },
        amount: {
            type: DataTypes.DOUBLE
        },
        accepted: {
            type: DataTypes.TINYINT
        },
        date_created: {
            type: 'TIMESTAMP'
        }
    }, {
        sequelize,
        tableName: 'transaction_request',
        timestamps: false
    })
}

module.exports = {
    createTransactionRequestModel,
}