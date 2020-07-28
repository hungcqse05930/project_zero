const { Sequelize, Model, DataTypes } = require('sequelize')

const createFruitModel = (sequelize) => {
    class Fruit extends Model { }

    // return class' structure
    return Fruit.init({
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING
        },
        icon_url: {
            type: DataTypes.STRING
        },
        date_created: {
            type: 'TIMESTAMP'
        }
    }, {
        sequelize,
        // name of the table in database
        tableName: 'fruit',
        // compulsary
        timestamps: false,
    })
}

module.exports = {
    createFruitModel,
}