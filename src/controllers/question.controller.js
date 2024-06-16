const httpStatus = require('http-status');
const QuestionService = require('../services/question.service');
const logger = require('../config/logger');

class QuestionController {
    constructor() {
        this.question = new QuestionService();
    }

    askQuestion = async (req, res) => {
        try {
            const { content } = req.body;
            const { sub } = req.user;
            const user = await this.question.createQuestion(
                { content, userId: sub }
            );
            const { message, data, status, code } = user.response;
            res.status(user.statusCode).send({ status, code, message, data });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    getQuestionById = async (req, res) => {
        try {
            const { questionId } = req.params;
            const question = await this.question.findQuestionById(questionId);
            res.status(httpStatus.OK).send(question);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    getQuestionByUser = async (req, res) => {
        try {
            const { page, pageSize } = req.query;
            const { userId } = req.params;
            const questions = await this.question.findQuestionByUser(
               { userId },
               page || 1, 
               pageSize || 10
            );
            res.status(httpStatus.OK).send(questions);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };
    
}

module.exports = QuestionController;
