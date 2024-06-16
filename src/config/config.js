const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

//link dotenv
dotenv.config({ path: path.join(__dirname, '../../.env.' + process.env.NODE_ENV) });

//env validation sequence
const envValidation = Joi.object()
    .keys({
        NODE_ENV: Joi.string().valid('dev', 'prod', 'test').required(),
        APP_PORT: Joi.number().default(5011),
        DB_HOST: Joi.string().default('localhost'),
        DB_USER: Joi.string().required(),
        DB_PASS: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        JWT_SECRET: Joi.string().required().description('JWT secret key'),
        JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
            .default(30)
            .description('minutes after which access tokens expire'),
        JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
            .default(30)
            .description('days after which refresh tokens expire'),
        JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
            .default(10)
            .description('minutes after which reset password token expires'),
        JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
            .default(10)
            .description('minutes after which verify email token expires'),
        LOG_FOLDER: Joi.string().required(),
        LOG_FILE: Joi.string().required(),
        LOG_LEVEL: Joi.string().required(),
        OPEN_API_KEY: Joi.string().required()
    })
    .unknown();

const { value: envVar, error } = envValidation
    .prefs({ errors: { label: 'key' } })
    .validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
    NODE_ENV: envVar.NODE_ENV,
    APP_PORT: envVar.APP_PORT,
    DB_HOST: envVar.DB_HOST,
    DB_USER: envVar.DB_USER,
    DB_PASS: envVar.DB_PASS,
    DB_NAME: envVar.DB_NAME,
    OPEN_API_KEY: envVar.OPEN_API_KEY,
    JWT: {
        secret: envVar.JWT_SECRET,
        accessExpirationMinutes: envVar.JWT_ACCESS_EXPIRATION_MINUTES,
        refreshExpirationDays: envVar.JWT_REFRESH_EXPIRATION_DAYS,
        resetPasswordExpirationMinutes: envVar.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
        verifyEmailExpirationMinutes: envVar.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
    },
    logConfig: {
        logFolder: envVar.LOG_FOLDER,
        logFile: envVar.LOG_FILE,
        logLevel: envVar.LOG_LEVEL,
    }
};
