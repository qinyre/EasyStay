const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @route   POST /api/v1/auth/register
 * @desc    注册新用户 (商户端 / 管理端)
 * @access  Public
 */
router.post('/register', authController.register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    验证用户并登录派发 Token
 * @access  Public
 */
router.post('/login', authController.login);

module.exports = router;
