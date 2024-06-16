const sinon = require('sinon');
const httpStatus = require('http-status');
const QuestionService = require('../../src/services/question.service');
const QuestionDaom = require('../../src/daom/question.daom');
const models = require('../../src/models');

const Question = models.question;

let questionService;
const questionList = [{
    "id": "f8020940-2bce-11ef-945f-9e8bdba9bcb3",
    "content": "2 Lastest trending topics in india",
    "userId": "1dfb51ee-2bc4-11ef-945f-9e8bdba9bcb3",
    toJSON: () => ({
        "id": "f8020940-2bce-11ef-945f-9e8bdba9bcb3",
        "content": "2 Lastest trending topics in india",
        "userId": "1dfb51ee-2bc4-11ef-945f-9e8bdba9bcb3",   
    })
}];
const questionData = {
    "id": "44efeb17-2bca-11ef-945f-9e8bdba9bcb3",
    "content": "This is sample",
    "userId": "1dfb51ee-2bc4-11ef-945f-9e8bdba9bcb3",
};
describe('Questions test', () => {
    beforeEach(() => {
        questionService = new QuestionService();
    });
    afterEach(() => {
        sinon.restore();
    });

    it('Question saved successfully', async () => {
        const questionModel = new Question(questionData);

        sinon.stub(QuestionService.prototype, 'findAnswer').callsFake((email) => {
            return 'This is sample answer.';
        });
        sinon.stub(QuestionDaom.prototype, 'create').callsFake(() => {
            return questionModel;
        });
        const savedQues = await questionService.createQuestion(questionData);
        expect(savedQues?.statusCode).toBe(httpStatus.CREATED);
        expect(savedQues?.response?.status).toBe(true);
        expect(savedQues?.response?.code).toBe(201);
        expect(savedQues?.response?.message).toBe('Question has been saved successfully.');
    });

    // it('Should show that email already taken', async () => {
    //     const userModel = new User(userData);

    //     userData.email = 'john.doe@gmail.com';
    //     sinon.stub(UserDaom.prototype, 'isEmailExists').callsFake((email) => {
    //         return userList.find(x => x.email === email);
    //     });
    //     sinon.stub(UserDaom.prototype, 'create').callsFake(() => {
    //         return userModel;
    //     });
    //     const userResponse = await userService.createUser(userData);
    //     expect(userResponse?.statusCode).toBe(httpStatus.BAD_REQUEST);
    //     expect(userResponse?.response?.status).toBe(false);
    //     expect(userResponse?.response?.message).toBe('Email already taken');
    // });

    it('Should return the existing question by id', async () => {
        sinon.stub(QuestionDaom.prototype, 'findById').callsFake((id) => {
            return questionList.find(x => x.id === id);
        });
        const question = await questionService.findQuestionById(questionList[0].id);
        expect(JSON.stringify(question)).toBe(JSON.stringify(questionList[0]));
    });

    it('Should fail tp return the question by id', async () => {
        sinon.stub(QuestionDaom.prototype, 'findById').callsFake((id) => {
            return questionList.find(x => x.id === id);
        });
        const question = await questionService.findQuestionById(questionData.id);
        expect(question).toBe(undefined);
    });

    it('Should return the existing question by user id', async () => {
        sinon.stub(QuestionDaom.prototype, 'findByWhere').callsFake((userId) => {
            return questionList.filter(x => x.userId === userId);
        });
        const question = await questionService.findQuestionByUser(questionList[0].userId);
        expect(JSON.stringify(question)).toBe(JSON.stringify(questionList));
    });
});
