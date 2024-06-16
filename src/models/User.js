const { Sequelize, Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        
    }

    User.init(
        {
            id: {
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: Sequelize.literal('uuid()')
            },
            firstName: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            firstLogin: {
                type: DataTypes.BOOLEAN,
                defaultValue: true
            },
            locked: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            emailVerified: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            lastLogin: {
                type: DataTypes.DATE,
                allowNull: true
            }
        },
        {
            sequelize,
            modelName: 'user',
            underscored: false,
        },
    );
    return User;
};
