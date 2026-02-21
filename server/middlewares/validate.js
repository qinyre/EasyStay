/**
 * 通用的 Zod 数据验证中间件
 * @param {import('zod').ZodSchema} schema Zod Schema 规则
 */
const validate = (schema) => {
    return (req, res, next) => {
        try {
            // 解析请求体数据是否符合规范
            const parsedData = schema.parse(req.body);

            // 如果需要，可以通过这一步把多余的无用字段过滤掉
            // req.body = parsedData; 

            next(); // 数据合规，放行到对应的 Controller
        } catch (error) {
            // 捕获到 Zod 的错误并返回给前端
            const errorMessages = error.errors.map(err => {
                return `${err.path.join('.')}: ${err.message}`;
            });

            return res.status(400).json({
                code: 400,
                message: '数据格式校验失败',
                errors: errorMessages
            });
        }
    };
};

module.exports = { validate };
