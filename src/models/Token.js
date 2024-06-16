const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Token extends Model {
        
    }

    Token.init(
        {
            token: DataTypes.STRING,
            userId: DataTypes.UUID,
            type: DataTypes.STRING,
            expires: DataTypes.DATE,
            blacklisted: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            modelName: 'token',
            underscored: false,
        },
    );
    return Token;
};
