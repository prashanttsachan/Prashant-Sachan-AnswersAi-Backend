const jwt = require('jsonwebtoken');
const moment = require('moment');
const { Op } = require('sequelize');
const config = require('../config/config');
const { tokenTypes } = require('../config/tokens');
const TokenDaom = require('../daom/TokenDaom');

class TokenService {
    constructor() {
        this.tokenDaom = new TokenDaom();
    }

    /**
     * Generate token
     * @param {string} uuid
     * @param {Moment} expires
     * @param {string} type
     * @param {string} [secret]
     * @returns {string}
     */

    generateToken = (uuid, expires, type, secret = config.JWT.secret) => {
        const payload = {
            sub: uuid,
            iat: moment().unix(),
            exp: expires.unix(),
            type,
        };
        return jwt.sign(payload, secret);
    };

    /**
     * verify token
     * @returns {Object}
     * @param token
     * @param type
     */
    verifyToken = async (token, type) => {
        const payload = await jwt.verify(token, config.JWT.secret, (err, decoded) => {
            if (err) {
                throw new Error('Token not found');
            } else {
                // if everything is good, save to request for use in other routes
                return decoded;
            }
        });

        const tokenDoc = await this.tokenDaom.findOne({
            token,
            type,
            userId: payload.sub,
            blacklisted: false,
        });
        if (!tokenDoc) {
            throw new Error('Token not found');
        }
        return tokenDoc;
    };

    /**
     * Save a token
     * @param {string} token
     * @param {integer} userId
     * @param {Moment} expires
     * @param {string} type
     * @param {boolean} [blacklisted]
     * @returns {Promise<Token>}
     */
    saveToken = async (token, userId, expires, type, blacklisted = false) => {
        return this.tokenDaom.create({
            token,
            user_id: userId,
            expires: expires.toDate(),
            type,
            blacklisted,
        });
    };
    /**
     * Save a multiple token
     * @param {Object} tokens
     * @returns {Promise<Token>}
     */

    saveMultipleTokens = async (tokens) => {
        return this.tokenDaom.bulkCreate(tokens);
    };

    /**
     * Delete TOken by ID
     * @returns {Object}
     * @param id
     */

    removeTokenById = async (id) => {
        return this.tokenDaom.remove({ id });
    };

    /**
     * Generate auth tokens
     * @param {{}} user
     * @returns {Promise<Object>}
     */
    generateAuthTokens = async (user) => {
        const accessTokenExpires = moment().add(config.JWT.accessExpirationMinutes, 'minutes');
        const accessToken = this.generateToken(
            user.id,
            accessTokenExpires,
            tokenTypes.ACCESS,
        );
        const refreshTokenExpires = moment().add(config.JWT.refreshExpirationDays, 'days');
        const refreshToken = this.generateToken(
            user.id,
            refreshTokenExpires,
            tokenTypes.REFRESH,
        );
        const authTokens = [];
        authTokens.push({
            token: accessToken,
            userId: user.id,
            expires: accessTokenExpires.toDate(),
            type: tokenTypes.ACCESS,
            blacklisted: false,
        });
        authTokens.push({
            token: refreshToken,
            userId: user.id,
            expires: refreshTokenExpires.toDate(),
            type: tokenTypes.REFRESH,
            blacklisted: false,
        });

        await this.saveMultipleTokens(authTokens);
        const expiredAccessTokenWhere = {
            expires: {
                [Op.lt]: moment().toDate(),
            },
            type: tokenTypes.ACCESS,
        };
        await this.tokenDaom.remove(expiredAccessTokenWhere);
        const expiredRefreshTokenWhere = {
            expires: {
                [Op.lt]: moment().toDate(),
            },
            type: tokenTypes.REFRESH,
        };
        await this.tokenDaom.remove(expiredRefreshTokenWhere);
        const tokens = {
            access: {
                token: accessToken,
                expires: accessTokenExpires.toDate(),
            },
            refresh: {
                token: refreshToken,
                expires: refreshTokenExpires.toDate(),
            },
        };
        return tokens;
    };
}

module.exports = TokenService;
