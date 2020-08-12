const { Sequelize, Model, DataTypes } = require('sequelize')

const createAffairModel = (sequelize) => {
    class Affair extends Model { }

    // return class' structure
    return Affair.init({
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        product_id: {
            type: DataTypes.BIGINT
        },
        seller_user_id: {
            type: DataTypes.BIGINT
        },
        buyer_user_id: {
            type: DataTypes.BIGINT
        },
        affair_status: {
            type: DataTypes.TINYINT
        },
        date_created: {
            type: 'TIMESTAMP'
        }
    }, {
        sequelize,
        // name of the table in database
        tableName: 'affair',
        // compulsary
        timestamps: false,
    })
}

module.exports = {
    createAffairModel,
}