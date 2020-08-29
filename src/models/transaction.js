const { Sequelize, Model, DataTypes } = require('sequelize')

const createTransactionModel = sequelize => {
    class Transaction extends Model { }

    return Transaction.init({
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        src_wallet_id: {
            type: DataTypes.BIGINT,
        },
        rcv_wallet_id: {
            type: DataTypes.BIGINT,
        },
        amount: {
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
        tableName: 'transaction',
        // compulsary
        timestamps: false,
    })
}

module.exports = {
    createTransactionModel,
}