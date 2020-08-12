const { Sequelize, Model, DataTypes } = require('sequelize')

const createAffairChatModel = (sequelize) => {
    class AffairChat extends Model { }

    // return class' structure
    return AffairChat.init({
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        affair_id: {
            type: DataTypes.BIGINT
        },
        sender_user_id: {
            type: DataTypes.BIGINT
        },
        content: {
            type: DataTypes.STRING
        },
        date_created: {
            type: 'TIMESTAMP'
        }
    }, {
        sequelize,
        // name of the table in database
        tableName: 'affair_chat',
        // compulsary
        timestamps: false,
    })
}

module.exports = {
    createAffairChatModel,
}