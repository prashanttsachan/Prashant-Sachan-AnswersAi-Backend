const { Sequelize, Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Token extends Model {

    }

    Token.init(
        {
            id: {
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: Sequelize.literal('uuid()')
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            answer: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            userId: {
                type: Sequelize.UUID,
                references: {
                    model: 'users',
                    key: 'id'
                }
            }
        },
        {
            sequelize,
            modelName: 'question',
            underscored: false,
        },
    );
    return Token;
};
