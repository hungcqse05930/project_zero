const { Sequelize, Model, DataTypes } = require('sequelize')

const createAffairRatingModel = (sequelize) => {
    class AffairRating extends Model { }

    // return class' structure
    return AffairRating.init({
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        rater_user_id: {
            type: DataTypes.BIGINT
        },
        rated_user_id: {
            type: DataTypes.BIGINT
        },
        rate :{
            type: DataTypes.INTEGER
        },
        description: {
            type: DataTypes.STRING
        },
        date_created :{
            type: 'TIMESTAMP'
        },
    }, {
        sequelize,
        // name of the table in database
        tableName: 'affair_rating',
        // compulsary
        timestamps: false,
    })
}

module.exports = {
    createAffairRatingModel,
}