const config = require('./config');

module.exports = {
    //dev credentials
    dev: {
        username: config.DB_USER,
        password: config.DB_PASS,
        database: config.DB_NAME,
        host: config.DB_HOST,
        dialect: 'mysql',
        dialectOptions: {
            bigNumberStrings: true,
        },
    },
    //staging credentials
    test: {
        username: config.DB_USER,
        password: config.DB_PASS,
        database: config.DB_NAME,
        host: config.DB_HOST,
        dialect: 'mysql',
        dialectOptions: {
            bigNumberStrings: true,
        },
    },
    //live credentials
    prod: {
        username: config.DB_USER,
        password: config.DB_PASS,
        database: config.DB_NAME,
        host: config.DB_HOST,
        dialect: 'mysql',
        dialectOptions: {
            bigNumberStrings: true,
        },
    },
};
