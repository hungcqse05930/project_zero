const { Sequelize, Model, DataTypes } = require('sequelize')

const createAdminModel = (sequelize) => {
    class Admin extends Model {}

    // return class' structure
    return Admin.init({
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING
        },
        name: {
            type: DataTypes.STRING
        },
        gender: {
            type: DataTypes.TINYINT
        },
        dob:{
            type: DataTypes.DATE
        },
        department:{
            type: DataTypes.STRING
        },
        date_created: {
            type: 'TIMESTAMP'
        }
    }, {
        sequelize,
        tableName: 'admin',
        timestamps: false
    })
}

module.exports = {
    createAdminModel,
}