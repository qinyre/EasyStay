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
 * 兼容 PC 前端的 type_name 和 stock 字段，透传给 controller 转化为 name 和 capacity
 */
const roomSchema = z.object({
    name: z.string().optional(),
    type_name: z.string().optional(),
    price: z.number().positive("价格必须是大于0的数字"),
    capacity: z.number().int("容纳人数必须是整数").nonnegative("容纳人数不能为负数").optional(),
    stock: z.number().int().nonnegative().optional(),
    description: z.string().optional(),
    image_url: z.string().optional(),
    amenities: z.array(z.string()).optional()
}).refine(data => data.name || data.type_name, {
    message: "房型名称(name/type_name)不能为空",
    path: ["name"]
}).transform(data => ({
    ...data,
    name: data.name || data.type_name,
    capacity: data.capacity ?? data.stock
}));

/**
 * 商户录入/修改酒店的数据校验规范
 * 对应 POST/PUT /merchant/hotels
 */
const hotelSchema = z.object({
    name_cn: z.string().min(2, "中文名至少 2 个字符").max(50, "中文名最多 50 个字符"),
    name_en: z.string().min(2, "英文名至少 2 个字符").optional(),
    address: z.string().min(5, "地址至少 5 个字符"),
    star_level: z.number().int().min(1, "星级最低为 1").max(5, "星级最高为 5").optional(),
    open_date: z.string().optional(),
    banner_url: z.string().optional(),
    description: z.string().max(500, "酒店描述最多500个字符").optional(),
    facilities: z.array(z.string()).optional(),
    tags: z.array(z.string()).max(10, "标签最多10个").optional(),
    // 必须包含至少一个房型
    rooms: z.array(roomSchema).min(1, "至少需要包含一种房型信息")
});

module.exports = {
    registerSchema,
    hotelSchema
};
