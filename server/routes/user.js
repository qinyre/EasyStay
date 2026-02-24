const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware, roleCheck } = require('../middlewares/auth');

/**
 * @route   POST /api/v1/user/register
 * @desc    注册新用户 (普通用户)
 * @access  Public
 */
router.post('/register', userController.register);

/**
 * @route   POST /api/v1/user/login
 * @desc    用户登录
 * @access  Public
 */
router.post('/login', userController.login);

/**
 * @route   GET /api/v1/user/profile
 * @desc    获取用户个人信息
 * @access  Private
 */
router.get('/profile', authMiddleware, userController.getProfile);

/**
 * @route   PUT /api/v1/user/profile
 * @desc    更新用户个人信息
 * @access  Private
 */
router.put('/profile', authMiddleware, userController.updateProfile);

module.exports = router;