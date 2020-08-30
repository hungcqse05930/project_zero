const { Sequelize, Model, DataTypes } = require('sequelize')

const createAffairContractUpdateModel = (sequelize) => {
    class AffairContractUpdate extends Model { }

    // return class' structure
    return AffairContractUpdate.init({
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        affair_contract_id: {
            type: DataTypes.BIGINT
        },
        shipment_user_id :{
            type: DataTypes.BIGINT
        },
        shipment_date: {
            type: DataTypes.DATE
        },
        shipment_late_fee :{
            type: DataTypes.DOUBLE
        },
        payment_date: {
            type: DataTypes.DATE
        },
        payment_late_fee:{
            type: DataTypes.DOUBLE
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
        tableName: 'affair_contract_update',
        // compulsary
        timestamps: false,
    })
}

module.exports = {
    createAffairContractUpdateModel,
}