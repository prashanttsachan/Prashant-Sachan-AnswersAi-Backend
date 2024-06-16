const httpStatus = require('http-status');
const QuestionDaom = require('../daom/question.daom');
const responseHandler = require('../utilities/ResponseHandler');
const logger = require('../config/logger');

const OpenAI = require('openai');
const config = require('../config/config');
const openai = new OpenAI({
    apiKey: config.OPEN_API_KEY
});

class QuestionService {
    constructor() {
        this.questionDaom = new QuestionDaom();
    }

    /**
     * Create a Question
     * @param {Object} { content, userId }
     * @returns {Object}
     */
    createQuestion = async (questionBody) => {
        try {
            let message = 'Question has been saved successfully.';
            const answer = await this.findAnswer(questionBody.content);
            if (answer) {
                questionBody.answer = JSON.stringify(answer);
            }
            let questionData = await this.questionDaom.create(questionBody);
            if (!questionData) {
                message = 'Question can not be saved! Please Try again.';
                return responseHandler.returnError(httpStatus.BAD_REQUEST, message);
            }
            questionData = questionData.toJSON();
            questionData.answer = answer;
            return responseHandler.returnSuccess(httpStatus.CREATED, message, questionData);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something went wrong!');
        }
    };

    /**
     * Find asnwer from ai
     * @param {Object} question
     * @returns {Object}
     */
    async findAnswer (question) {
        try {
            const data = await openai.chat.completions.create({
                messages: [{ role: "system", content: question }],
                model: "gpt-3.5-turbo-0125",
            });
            return data?.choices;
        } catch (err) {
            console.error(err?.error?.message)
        }
    }

    /**
     * Find question by id
     * @param {Object} question id
     * @returns {Object}
     */
    findQuestionById = async (id) => {
        try {
            let question = await this.questionDaom.findById(id);
            if (!question) return;
            return {
                ...question.toJSON(),
                answer: question.answer ? JSON.parse(question.answer) : undefined
            }
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something went wrong!');
        }
    };

    /**
     * Find user questions
     * @param {Object} where, page, pageSize
     * @returns {Object}
     */
    findQuestionByUser = async (questionBody, page=1, pageSize=10) => {
        try {
            let questionList = await this.questionDaom.findByWhere(
                questionBody, null, [ 'createdAt', 'desc'], 
                pageSize, (page-1) * pageSize
            );

            return questionList.map(x => ({...x.toJSON(), answer: x.answer ? JSON.parse(x.answer) : undefined}));
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something went wrong!');
        }
    };
}

module.exports = QuestionService;
