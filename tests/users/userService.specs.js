const sinon = require('sinon');
const httpStatus = require('http-status');
const UserService = require('../../src/services/user.service');
const UserDaom = require('../../src/daom/UserDaom');
const models = require('../../src/models');

const User = models.user;

let userService;
const userList = [{
    password: 'hello@123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@gmail.com',
    id: '4d85f12b-6e5b-468b-a971-eabe8ac346sd',
}];
const userData = {
    password: 'hello@123',
    firstName: 'Samuel',
    lastName: 'Owadayo',
    email: 'example@mail.com',
    id: '4d85f12b-6e5b-468b-a971-eabe8acc9d08',
};
describe('User registration test', () => {
    beforeEach(() => {
        userService = new UserService();
    });
    afterEach(() => {
        sinon.restore();
    });

    it('User registered successfully', async () => {
        const userModel = new User(userData);

        sinon.stub(UserDaom.prototype, 'isEmailExists').callsFake((email) => {
            return userList.find(x => x.email === email);
        });
        sinon.stub(UserDaom.prototype, 'create').callsFake(() => {
            return userModel;
        });
        const createdUser = await userService.createUser(userData);
        expect(createdUser?.statusCode).toBe(httpStatus.CREATED);
        expect(createdUser?.response?.status).toBe(true);
        expect(createdUser?.response?.code).toBe(201);
        expect(createdUser?.response?.message).toBe('Successfully Registered the account! Please Verify your email.');
    });

    it('Should show that email already taken', async () => {
        const userModel = new User(userData);

        userData.email = 'john.doe@gmail.com';
        sinon.stub(UserDaom.prototype, 'isEmailExists').callsFake((email) => {
            return userList.find(x => x.email === email);
        });
        sinon.stub(UserDaom.prototype, 'create').callsFake(() => {
            return userModel;
        });
        const userResponse = await userService.createUser(userData);
        expect(userResponse?.statusCode).toBe(httpStatus.BAD_REQUEST);
        expect(userResponse?.response?.status).toBe(false);
        expect(userResponse?.response?.message).toBe('Email already taken');
    });

    it('Should return the existing user by id', async () => {
        sinon.stub(UserDaom.prototype, 'findOneByWhere').callsFake(({ id }) => {
            return userList.find(x => x.id === id);
        });
        const user = await userService.getUserByid(userList[0].id);
        expect(JSON.stringify(user)).toBe(JSON.stringify(userList[0]));
    });

    // it('should show INVALID EMAIL ADDRESS message', async () => {
    //     const expectedResponse = {
    //         statusCode: httpStatus.BAD_REQUEST,
    //         response: {
    //             status: false,
    //             code: httpStatus.BAD_REQUEST,
    //             message: 'Invalid Email Address!',
    //         },
    //     };

    //     sinon.stub(UserDaom.prototype, 'findByEmail').callsFake(() => {
    //         return null;
    //     });
    //     const response = await authService.loginWithEmailPassword('test@mail.com', '23232132');
    //     expect(JSON.stringify(response)).toBe(JSON.stringify(expectedResponse));
    // });

    // it('Wrong Password', async () => {
    //     const expectedResponse = {
    //         statusCode: httpStatus.BAD_REQUEST,
    //         response: {
    //             status: false,
    //             code: httpStatus.BAD_REQUEST,
    //             message: 'Wrong Password!',
    //         },
    //     };
    //     userData.id = 1;
    //     userData.password = Encrypt.encrypt(PasswordConstant, '1234');
    //     userData.email_verified = 1;
    //     const userModel = new User(userData);
    //     sinon.stub(UserDaom.prototype, 'findByEmail').callsFake((email) => {
    //         return userModel;
    //     });
    //     const userLogin = await authService.loginWithEmailPassword(
    //         loginData.email,
    //         loginData.password,
    //     );
    //     expect(JSON.stringify(userLogin)).toBe(JSON.stringify(expectedResponse));
    // });
});
