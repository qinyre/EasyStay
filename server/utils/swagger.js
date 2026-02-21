const swaggerUi = require('swagger-ui-express');

// 为了避免让新手看满篇的 JSDoc 注释，这里采用一份静态的 JSON Schema
const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'EasyStay 酒店预订平台 API',
        version: '1.0.0',
        description: '通过此页面可以直接给本地后端发送请求测试接口联调！',
    },
    servers: [
        {
            url: 'http://localhost:3000/api/v1',
            description: '本地开发服务器',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: '在登录接口获取的 Token'
            },
        },
    },
    paths: {
        '/auth/register': {
            post: {
                tags: ['认证 (Auth)'],
                summary: '用户注册',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    username: { type: 'string', description: '用户名 (3-20位)' },
                                    password: { type: 'string', description: '密码 (至少6位)' },
                                    role: { type: 'string', enum: ['merchant', 'admin'], description: '角色' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': { description: '注册成功' },
                    '400': { description: '参数格式错误' }
                }
            }
        },
        '/auth/login': {
            post: {
                tags: ['认证 (Auth)'],
                summary: '用户登录',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    username: { type: 'string' },
                                    password: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': { description: '登录成功，返回 token 和身份信息' }
                }
            }
        },
        '/mobile/home/banners': {
            get: {
                tags: ['移动端 (Mobile)'],
                summary: '获取首页轮播图',
                responses: {
                    '200': { description: '成功返回 5 条 Banner 数据' }
                }
            }
        },
        '/mobile/hotels': {
            get: {
                tags: ['移动端 (Mobile)'],
                summary: '获取酒店列表 (支持筛选)',
                parameters: [
                    { name: 'location', in: 'query', schema: { type: 'string' }, description: '地名' },
                    { name: 'keyword', in: 'query', schema: { type: 'string' }, description: '关键词' },
                    { name: 'starLevel', in: 'query', schema: { type: 'integer' }, description: '星级 (1-5)' },
                    { name: 'page', in: 'query', schema: { type: 'integer' }, description: '页码' }
                ],
                responses: { '200': { description: '成功返回酒店的分页数据' } }
            }
        },
        '/merchant/hotels': {
            get: {
                tags: ['商户端 (Merchant)'],
                summary: '查询我的名下酒店',
                security: [{ bearerAuth: [] }],
                responses: { '200': { description: '成功返回数据' } }
            },
            post: {
                tags: ['商户端 (Merchant)'],
                summary: '商户录入新酒店 (受 Zod 保护)',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name_cn: { type: 'string', description: '中文名 (最少2字)' },
                                    address: { type: 'string' },
                                    star_level: { type: 'integer', description: '星级(1-5)' },
                                    open_date: { type: 'string', description: 'YYYY-MM-DD' },
                                    banner_url: { type: 'string' },
                                    rooms: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                type_name: { type: 'string' },
                                                price: { type: 'number' },
                                                stock: { type: 'integer' }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                responses: { '200': { description: '等待管理员审核' } }
            }
        },
        '/admin/hotels': {
            get: {
                tags: ['管理端 (Admin)'],
                summary: '管理员获取所有的酒店',
                security: [{ bearerAuth: [] }],
                responses: { '200': { description: '成功' } }
            }
        },
        '/admin/audit/{hotelId}': {
            patch: {
                tags: ['管理端 (Admin)'],
                summary: '审核酒店',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'hotelId', in: 'path', required: true, schema: { type: 'string' } }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    action: { type: 'string', enum: ['approve', 'reject'] },
                                    fail_reason: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                responses: { '200': { description: '成功' } }
            }
        }
    }
};

const setupSwagger = (app) => {
    // 注入 swagger-ui
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};

module.exports = setupSwagger;
