const { Sequelize, Model, DataTypes } = require('sequelize')

const createIdentityModel = (sequelize) => {
    class Identity extends Model {}

    // return class' structure
    return Identity.init({
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.BIGINT
        },
        name: {
            type: DataTypes.STRING
        },
        number: {
            type: DataTypes.STRING
        },
        date_dist: {
            type: DataTypes.DATE
        },     
        province_dist: {
            type: DataTypes.STRING
        },
        front_img_url: {
            type: DataTypes.STRING
        },
        back_img_url: {
            type: DataTypes.STRING
        },
        identity_status: {
            type: DataTypes.TINYINT
        },
        date_created: {
            type: 'TIMESTAMP'
        }
    }, {
        sequelize,
        // name of the table in database
        tableName: 'identity',
        // compulsary
        timestamps: false,
    })
}

module.exports = {
    createIdentityModel,
}