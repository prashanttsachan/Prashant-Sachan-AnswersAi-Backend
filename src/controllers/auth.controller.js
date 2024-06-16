const httpStatus = require('http-status');
const AuthService = require('../services/auth.service');
const TokenService = require('../services/token.service');
const UserService = require('../services/user.service');
const logger = require('../config/logger');
const { tokenTypes } = require('../config/tokens');

class AuthController {
    constructor() {
        this.userService = new UserService();
        this.tokenService = new TokenService();
        this.authService = new AuthService();
    }

    checkEmail = async (req, res) => {
        try {
            const isExists = await this.userService.isEmailExists(req.body.email.toLowerCase());
            res.status(isExists.statusCode).send(isExists.response);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    login = async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await this.authService.loginWithEmailPassword(
                email.toLowerCase(),
                password,
            );
            const { message, data, status, code } = user.response;
            let tokens = {};
            if (user.response.status) {
                tokens = await this.tokenService.generateAuthTokens(data);
            }
            res.status(user.statusCode).send({ status, code, message, data, tokens });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    logout = async (req, res) => {
        await this.authService.logout(req, res);
        res.status(httpStatus.NO_CONTENT).send();
    };

    refreshTokens = async (req, res) => {
        try {
            const refreshTokenDoc = await this.tokenService.verifyToken(
                req.body.refresh_token,
                tokenTypes.REFRESH,
            );
            const user = await this.userService.getUserByid(refreshTokenDoc.userId);
            if (user == null) {
                res.status(httpStatus.BAD_GATEWAY).send('User Not Found!');
            }
            await this.tokenService.removeTokenById(refreshTokenDoc.id);
            const tokens = await this.tokenService.generateAuthTokens(user);
            res.send(tokens);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };
}

module.exports = AuthController;
