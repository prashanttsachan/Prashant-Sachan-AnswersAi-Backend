const express = require('express');
const AuthController = require('../controllers/auth.controller');
const AuthValidator = require('../validators/auth.validator');

const router = express.Router();

const authController = new AuthController();
const authValidator = new AuthValidator();

router.post('/login', authValidator.loginValidator, authController.login);
router.post('/refresh', authController.refreshTokens);
router.post('/logout', authController.logout);

module.exports = router;
