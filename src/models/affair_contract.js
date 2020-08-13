const { Sequelize, Model, DataTypes } = require('sequelize')

const createAffairContractModel = (sequelize) => {
    class AffairContract extends Model { }

    // return class' structure
    return AffairContract.init({
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        affair_id: {
            type: DataTypes.BIGINT
        },
        product_id: {
            type: DataTypes.BIGINT
        },
        shipment_user_id :{
            type: DataTypes.BIGINT
        },
        shipment_date: {
            type: DataTypes.DATE
        },
        payment_late_fee:{
            type: DataTypes.DOUBLE
        },
        shipment_late_fee :{
            type: DataTypes.DOUBLE
        },
        payment_date: {
            type: DataTypes.DATE
        },
        preservative_amount: {
            type: DataTypes.DOUBLE
        },
        change_user_id:{
            type: DataTypes.BIGINT
        },
        date_updated: {
            type: 'TIMESTAMP'
        }
    }, {
        sequelize,
        // name of the table in database
        tableName: 'affair_contract',
        // compulsary
        timestamps: false,
    })
}

module.exports = {
    createAffairContractModel,
}