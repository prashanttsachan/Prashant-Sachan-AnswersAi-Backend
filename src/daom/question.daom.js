const SuperDaom = require('./SuperDaom');
const models = require('../models');

const Question = models.question;

class QuestionDaom extends SuperDaom {
    constructor() {
        super(Question);
    }

    
}

module.exports = QuestionDaom;
