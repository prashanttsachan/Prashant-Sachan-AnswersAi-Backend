const express = require('express');
const QuestionController = require('../controllers/question.controller');
const QuestionValidator = require('../validators/question.validator');

const router = express.Router();

const auth = require('../middlewares/auth');

const questionController = new QuestionController();
const quesValidator = new QuestionValidator();

router.post('/', auth(), quesValidator.askQuestionValidator, questionController.askQuestion);
router.get('/:questionId', auth(), questionController.getQuestionById);

module.exports = router;
