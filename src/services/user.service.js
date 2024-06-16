const httpStatus = require('http-status');
const UserDaom = require('../daom/UserDaom');
const responseHandler = require('../utilities/ResponseHandler');
const logger = require('../config/logger');
const { PasswordConstant } = require('../config/constant');
const { Encrypt } = require('../utilities/EncryptHelper');

class UserService {
    constructor() {
        this.userDaom = new UserDaom();
    }

    /**
     * Create a user
     * @param {Object} userBody
     * @returns {Object}
     */
    createUser = async (userBody) => {
        try {
            let message = 'Successfully Registered the account! Please Verify your email.';
            if (await this.userDaom.isEmailExists(userBody.email)) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Email already taken');
            }
            userBody.email = userBody.email.toLowerCase();
            userBody.password = Encrypt.encrypt(PasswordConstant, userBody.password);
            userBody.firstName = userBody.firstName;
            userBody.lastName = userBody.lastName;

            let userData = await this.userDaom.create(userBody);

            if (!userData) {
                message = 'Registration Failed! Please Try again.';
                return responseHandler.returnError(httpStatus.BAD_REQUEST, message);
            }

            userData = userData.toJSON();
            delete userData.password;

            return responseHandler.returnSuccess(httpStatus.CREATED, message, userData);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something went wrong!');
        }
    };

    /**
     * Get user
     * @param {String} email
     * @returns {Object}
     */

    isEmailExists = async (email) => {
        const message = 'Email found!';
        if (!(await this.userDaom.isEmailExists(email))) {
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Email not Found!!');
        }
        return responseHandler.returnSuccess(httpStatus.OK, message);
    };

    /**
     * Get user by id
     * @returns {Object}
     * @param uuid
     */
    getUserByid = async (id) => {
        return this.userDaom.findOneByWhere({ id });
    };

    /**
     * change password
     * @returns {Object}
     * @param data
     * @param id
     */
    changePassword = async (data, id) => {
        let message = 'Password change Successful';
        let statusCode = httpStatus.OK;
        let user = await this.userDaom.findOneByWhere({ id });

        if (!user) {
            return responseHandler.returnError(httpStatus.NOT_FOUND, 'User Not found!');
        }

        const existingPassword = Encrypt.decrypt(PasswordConstant, user.password);
        const isPasswordValid = existingPassword === data.old_password;
        user = user.toJSON();
        delete user.password;
        if (!isPasswordValid) {
            statusCode = httpStatus.BAD_REQUEST;
            message = 'Wrong old Password!';
            return responseHandler.returnError(statusCode, message);
        }
        const updateUser = await this.userDaom.updateWhere(
            { password: Encrypt.encrypt(PasswordConstant, data.password) },
            { id },
        );

        if (updateUser) {
            return responseHandler.returnSuccess(
                httpStatus.OK,
                'Password updated Successfully!',
                {},
            );
        }

        return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Password Update Failed!');
    };
}

module.exports = UserService;
