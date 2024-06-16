const express = require('express');
const UserController = require('../controllers/user.controller');
const QuestionController = require('../controllers/question.controller');
const UserValidator = require('../validators/user.validator');

const router = express.Router();
const auth = require('../middlewares/auth');

const userController = new UserController();
const questionController = new QuestionController();
const userValidator = new UserValidator();

router.post('/', userValidator.userCreateValidator, userController.register);
router.get('/:userId', auth(), userController.getProfile);
router.get('/:userId/questions', auth(), questionController.getQuestionByUser);
router.put(
    '/change-password',
    auth(),
    userValidator.changePasswordValidator,
    userController.changePassword,
);

module.exports = router;
