const { Sequelize, Model, DataTypes } = require('sequelize')

const createinstituteQualityAccreditationModel = (sequelize) => {
    class InstituteQualityAccreditation extends Model { }

    // return class' structure
    return InstituteQualityAccreditation.init({
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
        tableName: 'institute_quality_accreditation',
        // compulsary
        timestamps: false,
    })
}

module.exports = {
    createinstituteQualityAccreditationModel,
}