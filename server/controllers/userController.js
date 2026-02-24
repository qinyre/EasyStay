const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middlewares/auth');
const User = require('../models/User');

/**
 * 用户注册逻辑
 */
const register = async (req, res) => {
    try {
        const { username, password } = req.body;

        // 参数校验
        if (!username || !password) {
            return res.status(400).json({
                code: 400,
                message: '请提供用户名和密码'
            });
        }

        // 检查用户名是否重复
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({
                code: 400,
                message: '用户名已存在'
            });
        }

        // 保存新用户，默认角色为 user
        const newUser = new User({ username, password, role: 'user' });
        await newUser.save();

        res.json({
            code: 200,
            message: '注册成功'
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: error.message
        });
    }
};

/**
 * 用户登录逻辑
 */
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                code: 400,
                message: '请提供用户名和密码'
            });
        }

        // 查找用户
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({
                code: 401,
                message: '用户名或密码错误'
            });
        }

        // 验证密码
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                code: 401,
                message: '用户名或密码错误'
            });
        }

        // 签发 token, 有效期设为 7天
        const tokenPayload = { username: user.username, role: user.role };
        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            code: 200,
            data: {
                token,
                role: user.role,
                username: user.username
            },
            message: '登录成功'
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: error.message
        });
    }
};

/**
 * 获取用户个人信息
 */
const getProfile = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.user.username });
        if (!user) {
            return res.status(404).json({
                code: 404,
                message: '用户不存在'
            });
        }

        // 不返回密码
        const { password, ...userInfo } = user.toObject();

        res.json({
            code: 200,
            data: userInfo,
            message: 'success'
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: error.message
        });
    }
};

/**
 * 更新用户个人信息
 */
const updateProfile = async (req, res) => {
    try {
        const { password } = req.body;

        const user = await User.findOne({ username: req.user.username });
        if (!user) {
            return res.status(404).json({
                code: 404,
                message: '用户不存在'
            });
        }

        // 更新密码（如果提供）
        if (password) {
            user.password = password; // 密码会在保存时自动加密
        }

        await user.save();

        res.json({
            code: 200,
            message: '个人信息更新成功'
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: error.message
        });
    }
};

module.exports = {
    register,
    login,
    getProfile,
    updateProfile
};