const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { JWT_SECRET } = require('../middlewares/auth');
const { db } = require('../config/database');
const crypto = require('crypto');

/**
 * 用户注册逻辑 (PC端)
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
        const existingUser = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
        if (existingUser) {
            return res.status(400).json({
                code: 400,
                message: '用户名已存在'
            });
        }

        // 保存新用户，默认角色为 user
        const hashedPassword = bcrypt.hashSync(password, 10);
        const userId = crypto.randomUUID();
        const now = new Date().toISOString();

        db.prepare(`
            INSERT INTO users (id, username, password, role, createdAt)
            VALUES (?, ?, ?, 'user', ?)
        `).run(userId, username, hashedPassword, now);

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
 * 用户登录逻辑 (PC端)
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
        const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
        if (!user) {
            return res.status(401).json({
                code: 401,
                message: '用户名或密码错误'
            });
        }

        // 验证密码
        const isPasswordValid = bcrypt.compareSync(password, user.password);
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
 * 获取用户个人信息 (PC端)
 */
const getProfile = async (req, res) => {
    try {
        const user = db.prepare('SELECT * FROM users WHERE username = ?').get(req.user.username);
        if (!user) {
            return res.status(404).json({
                code: 404,
                message: '用户不存在'
            });
        }

        // 不返回密码
        const { password, ...userInfo } = user;

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
 * 更新用户个人信息 (PC端)
 */
const updateProfile = async (req, res) => {
    try {
        const { password } = req.body;

        const user = db.prepare('SELECT * FROM users WHERE username = ?').get(req.user.username);
        if (!user) {
            return res.status(404).json({
                code: 404,
                message: '用户不存在'
            });
        }

        // 更新密码（如果提供）
        if (password) {
            const hashedPassword = bcrypt.hashSync(password, 10);
            db.prepare('UPDATE users SET password = ? WHERE username = ?').run(hashedPassword, req.user.username);
        }

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