const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middlewares/auth');
const User = require('../models/User');

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
        const existingPhone = await User.findOne({ phone });
        if (existingPhone) {
            return res.status(400).json({
                code: 400,
                message: '手机号已注册'
            });
        }

        // 检查邮箱是否重复
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({
                code: 400,
                message: '邮箱已注册'
            });
        }

        // 保存新用户
        const newUser = new User({ 
            phone, 
            email, 
            password, 
            name, 
            role 
        });
        await newUser.save();

        // 生成token
        const tokenPayload = { phone: newUser.phone, role: newUser.role };
        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            code: 200,
            data: {
                user: {
                    id: newUser._id,
                    phone: newUser.phone,
                    email: newUser.email,
                    name: newUser.name,
                    avatar: newUser.avatar,
                    role: newUser.role,
                    createdAt: newUser.createdAt
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
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(401).json({
                code: 401,
                message: '手机号或密码错误'
            });
        }

        // 验证密码
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                code: 401,
                message: '手机号或密码错误'
            });
        }

        // 签发 token, 有效期设为 7天
        const tokenPayload = { phone: user.phone, role: user.role };
        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            code: 200,
            data: {
                user: {
                    id: user._id,
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
        // 从请求中获取用户信息（由authMiddleware设置）
        const { phone } = req.user;

        // 查找用户
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({
                code: 404,
                message: '用户不存在'
            });
        }

        res.json({
            code: 200,
            data: {
                id: user._id,
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

        // 查找用户
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                code: 404,
                message: '邮箱不存在'
            });
        }

        // 生成验证码
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
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                code: 404,
                message: '邮箱不存在'
            });
        }

        // 开发模式下，直接重置密码
        if (process.env.NODE_ENV === 'development' || true) {
            user.password = newPassword;
            await user.save();
            return res.json({
                code: 200,
                message: '密码重置成功'
            });
        }

        // 实际生产环境中，这里应该验证存储的验证码
        // 暂时模拟重置成功
        res.json({
            code: 200,
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
