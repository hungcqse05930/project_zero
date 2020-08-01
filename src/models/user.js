const { Sequelize, Model, DataTypes } = require('sequelize')

const createUserModel = (sequelize) => {
    class User extends Model {}

    // return class' structure
    return User.init({
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        phone: {
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
        img_url: {
            type: DataTypes.TEXT
        },
        user_status: {
            type: DataTypes.TINYINT
        },
        date_created: {
            type: 'TIMESTAMP'
        }
    }, {
        sequelize,
        tableName: 'user',
        timestamps: false
    })
}

module.exports = {
    createUserModel,
}