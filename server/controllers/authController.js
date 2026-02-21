const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middlewares/auth');
const { readUsers, writeUsers } = require('../utils/file');

/**
 * 用户注册逻辑
 */
const register = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        // 参数校验
        if (!username || !password || !role) {
            return res.status(400).json({ code: 400, message: '请提供完整的注册信息 (username, password, role)' });
        }

        // 角色限制
        if (!['merchant', 'admin'].includes(role)) {
            return res.status(400).json({ code: 400, message: '非法的角色类型，仅支持 merchant 或 admin' });
        }

        const users = await readUsers();

        // 检查用户名是否重复
        const existingUser = users.find(u => u.username === username);
        if (existingUser) {
            return res.status(400).json({ code: 400, message: '用户名已存在' });
        }

        // 保存新用户
        const newUser = { username, password, role };
        users.push(newUser);
        await writeUsers(users);

        res.json({
            code: 200,
            message: '注册成功'
        });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
};

/**
 * 用户登录逻辑
 */
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ code: 400, message: '请提供用户名和密码' });
        }

        const users = await readUsers();

        const user = users.find(u => u.username === username && u.password === password);

        if (!user) {
            return res.status(401).json({ code: 401, message: '用户名或密码错误' });
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
        res.status(500).json({ code: 500, message: error.message });
    }
};

module.exports = {
    register,
    login
};
