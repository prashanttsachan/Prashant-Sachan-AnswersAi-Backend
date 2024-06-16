const httpStatus = require('http-status');
const AuthService = require('../services/auth.service');
const TokenService = require('../services/token.service');
const UserService = require('../services/user.service');
const logger = require('../config/logger');

class UserController {
    constructor() {
        this.userService = new UserService();
        this.tokenService = new TokenService();
        this.authService = new AuthService();
    }

    register = async (req, res) => {
        // #swagger.tags = ['User']
        try {
            const user = await this.userService.createUser(req.body);
            let tokens = {};
            const { status } = user.response;
            if (user.response.status) {
                tokens = await this.tokenService.generateAuthTokens(user.response.data);
            }

            const { message, data } = user.response;
            res.status(user.statusCode).send({ status, message, data, tokens });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    getProfile = async (req, res) => {
        try {
            let userProfile = await this.userService.getUserByid(req.params.userId);
            userProfile = userProfile.toJSON();
            delete userProfile.password;
            res.status(httpStatus.OK).send(userProfile);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    changePassword = async (req, res) => {
        try {
            const responseData = await this.userService.changePassword(req.body, req.user.sub);
            res.status(responseData.statusCode).send(responseData.response);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };
}

module.exports = UserController;
