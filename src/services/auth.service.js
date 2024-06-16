const httpStatus = require('http-status');
const UserDaom = require('../daom/UserDaom');
const TokenDaom = require('../daom/TokenDaom');
const { tokenTypes } = require('../config/tokens');
const responseHandler = require('../utilities/ResponseHandler');
const logger = require('../config/logger');
const { Encrypt } = require('../utilities/EncryptHelper');
const { PasswordConstant } = require('../config/constant');
const moment = require('moment');

class AuthService {
    constructor() {
        this.userDaom = new UserDaom();
        this.TokenDaom = new TokenDaom();
    }

    /**
     * Login the user
     * @param {String} email
     * @param {String} password
     * @returns {Promise<{response: {code: *, message: *, status: boolean}, statusCode: *}>}
     */
    loginWithEmailPassword = async (email, password) => {
        try {
            let message = 'Login Successful';
            let statusCode = httpStatus.OK;
            let user = await this.userDaom.findByEmail(email);
            if (user == null) {
                return responseHandler.returnError(
                    httpStatus.BAD_REQUEST,
                    'Invalid Email Address!',
                );
            }
            const userPassword = Encrypt.decrypt(PasswordConstant, user.password);
            const isPasswordValid = userPassword === password;
            user = user.toJSON();
            delete user.password;

            if (!isPasswordValid) {
                statusCode = httpStatus.BAD_REQUEST;
                message = 'Wrong Password!';
                return responseHandler.returnError(statusCode, message);
            }
            this.userDaom.updateById({ lastLogin: moment().toDate()}, user?.id);
            return responseHandler.returnSuccess(statusCode, message, user);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'Something Went Wrong!!');
        }
    };

    /**
     * Log user out
     */
    logout = async (req, res) => {
        const refreshTokenDoc = await this.TokenDaom.findOne({
            token: req.body.refresh_token,
            type: tokenTypes.REFRESH,
            blacklisted: false,
        });
        if (!refreshTokenDoc) {
            res.status(httpStatus.NOT_FOUND).send({ message: 'User Not found!' });
            return;
        }
        await this.TokenDaom.remove({
            token: req.body.refresh_token,
            type: tokenTypes.REFRESH,
            blacklisted: false,
        });
        await this.TokenDaom.remove({
            token: req.body.access_token,
            type: tokenTypes.ACCESS,
            blacklisted: false,
        });
        // this.redisService.removeToken(req.body.access_token, 'access_token');
        // this.redisService.removeToken(req.body.refresh_token, 'refresh_token');
    };
}

module.exports = AuthService;
