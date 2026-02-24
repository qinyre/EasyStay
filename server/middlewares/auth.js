const jwt = require('jsonwebtoken');

// 从环境变量读取，或使用默认值 (仅为演示)
const JWT_SECRET = process.env.JWT_SECRET || 'easystay_secret_key';

/**
 * 验证并解析 JWT 的中间件
 */
const authMiddleware = (req, res, next) => {
    // 从请求头获取 Token: Authorization: Bearer <token>
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({
            code: 401,
            message: '未提供认证令牌'
        });
    }

    try {
        // 验证 Token
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;  // { phone, role, iat, exp }
        next();
    } catch (error) {
        return res.status(401).json({
            code: 401,
            message: '令牌无效或已过期'
        });
    }
};

/**
 * 角色白名单拦截器
 * @param {Array<string>} allowedRoles 允许的 roles
 */
const roleCheck = (allowedRoles) => {
    return (req, res, next) => {
        // 此时已经经过 authMiddleware, req.user 肯定存在
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                code: 403,
                message: '没有权限访问此接口'
            });
        }
        next();
    };
};

module.exports = {
    authMiddleware,
    roleCheck,
    JWT_SECRET
};
