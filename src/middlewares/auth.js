const httpStatus = require('http-status');
const ApiError = require('../utilities/ApiError');
const config = require('../config/config');
const jwt = require('jsonwebtoken');

const verifyCallback = (req, res, resolve, reject) => {
    return async (err, user, info) => {
        if (err || info || !user) {
            return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
        }
        req.user = user;

        resolve();
    };
};

const auth = () => {
    return async (req, res, next) => {
        return new Promise((resolve, reject) => {
            const token = req.header('Authorization');
            if (!token) {
                throw new Error("Access token not found.");
            }
            const jwtSecretKey = config.JWT.secret;
            const verifedData = jwt.verify(token.replace('Bearer ', ''), jwtSecretKey);
            if (verifedData) {
                req.user = {
                    ...verifedData
                }
                resolve(true);
            } else {
                reject('Invalid access token.');
            }
        })
        .then(() => {
            return next();
        })
        .catch((err) => {
            return next(err);
        });
    };
};

module.exports = auth;
