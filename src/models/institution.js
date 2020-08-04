const { Sequelize, Model, DataTypes } = require('sequelize')

const createInstitutionModel = (sequelize) => {
    class Institution extends Model { }

    // return class' structure
    return Institution.init({
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING
        },
        province: {
            type: DataTypes.STRING
        },
        address: {
            type: DataTypes.STRING
        },
        phone_num: {
            type: DataTypes.STRING
        }
    }, {
        sequelize,
        // name of the table in database
        tableName: 'institution',
        // compulsary
        timestamps: false,
    })
}

module.exports = {
    createInstitutionModel,
}