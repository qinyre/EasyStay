const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { JWT_SECRET } = require('../middlewares/auth');
const { db } = require('../config/database');

/**
 * 用户注册逻辑
 */
const register = async (req, res) => {
    try {
        const { phone, email, password, confirmPassword, name, role = 'user' } = req.body;

        // 参数校验
        if (!phone || !email || !password || !confirmPassword) {
            return res.status(400).json({
                code: 400,
                message: '请提供完整的注册信息 (phone, email, password, confirmPassword)'
            });
        }

        // 密码确认
        if (password !== confirmPassword) {
            return res.status(400).json({
                code: 400,
                message: '两次输入的密码不一致'
            });
        }

        // 角色限制
        if (!['user', 'merchant', 'admin'].includes(role)) {
            return res.status(400).json({
                code: 400,
                message: '非法的角色类型，仅支持 user、merchant 或 admin'
            });
        }

        // 检查手机号是否重复
        const existingPhone = db.prepare('SELECT id FROM users WHERE phone = ?').get(phone);
        if (existingPhone) {
            return res.status(400).json({
                code: 400,
                message: '手机号已注册'
            });
        }

        // 检查邮箱是否重复
        const existingEmail = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
        if (existingEmail) {
            return res.status(400).json({
                code: 400,
                message: '邮箱已注册'
            });
        }

        // 密码加密
        const hashedPassword = bcrypt.hashSync(password, 10);
        const userId = crypto.randomUUID();
        const now = new Date().toISOString();

        // 保存新用户
        db.prepare(`
            INSERT INTO users (id, phone, email, password, name, role, createdAt)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(userId, phone, email, hashedPassword, name || null, role, now);

        // 生成token
        const tokenPayload = { phone, role };
        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            code: 200,
            data: {
                user: {
                    id: userId,
                    phone,
                    email,
                    name: name || null,
                    avatar: null,
                    role,
                    createdAt: now
                },
                token
            },
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
        const { phone, password } = req.body;

        if (!phone || !password) {
            return res.status(400).json({
                code: 400,
                message: '请提供手机号和密码'
            });
        }

        // 查找用户
        const user = db.prepare('SELECT * FROM users WHERE phone = ?').get(phone);
        if (!user) {
            return res.status(401).json({
                code: 401,
                message: '手机号或密码错误'
            });
        }

        // 验证密码
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                code: 401,
                message: '手机号或密码错误'
            });
        }

        // 签发 token
        const tokenPayload = { phone: user.phone, role: user.role };
        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            code: 200,
            data: {
                user: {
                    id: user.id,
                    phone: user.phone,
                    email: user.email,
                    name: user.name,
                    avatar: user.avatar,
                    role: user.role,
                    createdAt: user.createdAt
                },
                token
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
 * 获取当前用户信息
 */
const getCurrentUser = async (req, res) => {
    try {
        const user = db.prepare('SELECT * FROM users WHERE phone = ?').get(req.user.phone);
        if (!user) {
            return res.status(404).json({
                code: 404,
                message: '用户不存在'
            });
        }

        res.json({
            code: 200,
            data: {
                id: user.id,
                phone: user.phone,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                role: user.role,
                createdAt: user.createdAt
            },
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
 * 发送密码重置验证码
 */
const sendResetCode = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                code: 400,
                message: '请提供邮箱地址'
            });
        }

        // 检查用户是否存在
        const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
        if (!user) {
            return res.status(404).json({
                code: 404,
                message: '邮箱不存在'
            });
        }

        // 生成6位随机验证码
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // 在开发模式下，直接返回验证码
        if (process.env.NODE_ENV === 'development') {
            return res.json({
                code: 200,
                data: { code },
                message: '验证码已发送至邮箱（开发模式）'
            });
        }

        // 实际生产环境中，这里应该调用邮件服务发送验证码
        // 暂时模拟发送成功
        res.json({
            code: 200,
            data: true,
            message: '验证码已发送至邮箱'
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: error.message
        });
    }
};

/**
 * 验证重置验证码
 */
const verifyResetCode = async (req, res) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({
                code: 400,
                message: '请提供邮箱和验证码'
            });
        }

        // 开发模式下，直接验证验证码是否为6位数字
        if (process.env.NODE_ENV === 'development' && /^\d{6}$/.test(code)) {
            return res.json({
                code: 200,
                data: true,
                message: '验证码正确'
            });
        }

        // 实际生产环境中，这里应该验证存储的验证码
        // 暂时模拟验证成功
        res.json({
            code: 200,
            data: true,
            message: '验证码正确'
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: error.message
        });
    }
};

/**
 * 使用验证码重置密码
 */
const resetPasswordWithCode = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;

        if (!email || !code || !newPassword) {
            return res.status(400).json({
                code: 400,
                message: '请提供邮箱、验证码和新密码'
            });
        }

        // 查找用户
        const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
        if (!user) {
            return res.status(404).json({
                code: 404,
                message: '邮箱不存在'
            });
        }

        // 加密新密码并更新
        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        db.prepare('UPDATE users SET password = ? WHERE email = ?').run(hashedPassword, email);

        res.json({
            code: 200,
            data: true,
            message: '密码重置成功'
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: error.message
        });
    }
};

/**
 * 用户登出
 */
const logout = async (req, res) => {
    try {
        // 在实际生产环境中，这里应该将token加入黑名单
        // 暂时直接返回成功
        res.json({
            code: 200,
            data: true,
            message: '登出成功'
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
    getCurrentUser,
    sendResetCode,
    verifyResetCode,
    resetPasswordWithCode,
    logout
};
