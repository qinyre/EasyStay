const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validate } = require('../middlewares/validate');
const { registerSchema } = require('../validators/schemas');
const { authMiddleware } = require('../middlewares/auth');

/**
 * @route   POST /api/v1/auth/register
 * @desc    注册新用户
 * @access  Public
 */
router.post('/register', authController.register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    验证用户并登录派发 Token
 * @access  Public
 */
router.post('/login', authController.login);

/**
 * @route   GET /api/v1/auth/me
 * @desc    获取当前用户信息
 * @access  Private
 */
router.get('/me', authMiddleware, authController.getCurrentUser);

/**
 * @route   POST /api/v1/auth/send-reset-code
 * @desc    发送密码重置验证码
 * @access  Public
 */
router.post('/send-reset-code', authController.sendResetCode);

/**
 * @route   POST /api/v1/auth/verify-reset-code
 * @desc    验证重置验证码
 * @access  Public
 */
router.post('/verify-reset-code', authController.verifyResetCode);

/**
 * @route   POST /api/v1/auth/reset-password-with-code
 * @desc    使用验证码重置密码
 * @access  Public
 */
router.post('/reset-password-with-code', authController.resetPasswordWithCode);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    用户登出
 * @access  Private
 */
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
