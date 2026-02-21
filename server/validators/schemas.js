const { z } = require('zod');

/**
 * 注册接口的数据校验规范
 * 对应 POST /auth/register
 */
const registerSchema = z.object({
    username: z.string().min(3, "用户名至少需要 3 个字符").max(20, "用户名最多 20 个字符"),
    password: z.string().min(6, "密码至少需要 6 个字符"),
    role: z.enum(['merchant', 'admin'], {
        errorMap: () => ({ message: "角色必须是 merchant 或 admin" })
    })
});

/**
 * 房型的数据校验规范
 */
const roomSchema = z.object({
    type_name: z.string().min(1, "房型名称不能为空"),
    price: z.number().positive("价格必须是大于0的数字"),
    stock: z.number().int("库存必须是整数").nonnegative("库存不能为负数")
});

/**
 * 商户录入/修改酒店的数据校验规范
 * 严格按照 Agent.md 约定的数据结构
 * 对应 POST/PUT /merchant/hotels
 */
const hotelSchema = z.object({
    name_cn: z.string().min(2, "中文名至少 2 个字符").max(50, "中文名最多 50 个字符"),
    name_en: z.string().min(2, "英文名至少 2 个字符").optional(),
    address: z.string().min(5, "地址至少 5 个字符"),
    star_level: z.number().int().min(1, "星级最低为 1").max(5, "星级最高为 5"),
    open_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "开业时间格式必须为 YYYY-MM-DD"),
    banner_url: z.string().url("Banner必须是合法的URL地址"),
    tags: z.array(z.string()).max(10, "标签最多10个").optional(),
    attractions: z.string().optional(),
    discount_info: z.string().optional(),
    // 必须包含至少一个房型
    rooms: z.array(roomSchema).min(1, "至少需要包含一种房型信息")
});

module.exports = {
    registerSchema,
    hotelSchema
};
