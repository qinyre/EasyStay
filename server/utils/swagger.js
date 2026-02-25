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
            url: '/api/v1',
            description: '当前服务器 (相对路径)',
        },
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
        schemas: {
            ApiResponse: {
                type: 'object',
                properties: {
                    code: { type: 'integer', description: '业务码，通常与 HTTP Status 对齐' },
                    message: { type: 'string' },
                    data: { description: '返回数据，不同接口结构不同' },
                    errors: { type: 'array', items: { type: 'string' }, description: '参数校验错误列表（部分接口可能返回）' }
                }
            }
        }
    },
    paths: {
        '/ping': {
            get: {
                tags: ['系统 (System)'],
                summary: '健康检查',
                responses: {
                    '200': { description: 'success', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } }
                }
            }
        },
        '/auth/register': {
            post: {
                tags: ['认证 (Auth)'],
                summary: '注册新用户 (phone/email 体系)',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['phone', 'email', 'password', 'confirmPassword'],
                                properties: {
                                    phone: { type: 'string', description: '手机号' },
                                    email: { type: 'string', description: '邮箱' },
                                    password: { type: 'string', description: '密码' },
                                    confirmPassword: { type: 'string', description: '确认密码' },
                                    name: { type: 'string', description: '昵称/姓名' },
                                    role: { type: 'string', enum: ['user', 'merchant', 'admin'], description: '角色（默认 user）' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': { description: '注册成功', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
                    '400': { description: '参数错误/手机号或邮箱已注册', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } }
                }
            }
        },
        '/auth/login': {
            post: {
                tags: ['认证 (Auth)'],
                summary: '用户登录 (phone/password)',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['phone', 'password'],
                                properties: {
                                    phone: { type: 'string' },
                                    password: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': { description: '登录成功，返回 token 和用户信息', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
                    '401': { description: '手机号或密码错误', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } }
                }
            }
        },
        '/auth/me': {
            get: {
                tags: ['认证 (Auth)'],
                summary: '获取当前用户信息',
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': { description: 'success', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
                    '401': { description: '未登录/令牌无效', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } }
                }
            }
        },
        '/auth/send-reset-code': {
            post: {
                tags: ['认证 (Auth)'],
                summary: '发送密码重置验证码',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { type: 'object', required: ['email'], properties: { email: { type: 'string' } } }
                        }
                    }
                },
                responses: {
                    '200': { description: 'success', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
                    '404': { description: '邮箱不存在', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } }
                }
            }
        },
        '/auth/verify-reset-code': {
            post: {
                tags: ['认证 (Auth)'],
                summary: '验证重置验证码',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { type: 'object', required: ['email', 'code'], properties: { email: { type: 'string' }, code: { type: 'string', description: '6位数字验证码' } } }
                        }
                    }
                },
                responses: {
                    '200': { description: 'success', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } }
                }
            }
        },
        '/auth/reset-password-with-code': {
            post: {
                tags: ['认证 (Auth)'],
                summary: '使用验证码重置密码',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { type: 'object', required: ['email', 'code', 'newPassword'], properties: { email: { type: 'string' }, code: { type: 'string' }, newPassword: { type: 'string', description: '新密码' } } }
                        }
                    }
                },
                responses: {
                    '200': { description: 'success', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
                    '404': { description: '邮箱不存在', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } }
                }
            }
        },
        '/auth/logout': {
            post: {
                tags: ['认证 (Auth)'],
                summary: '用户登出',
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': { description: 'success', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } }
                }
            }
        },
        '/mobile/home/banners': {
            get: {
                tags: ['移动端 (Mobile)'],
                summary: '获取首页轮播图',
                responses: {
                    '200': { description: '成功返回 Banner 数据', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } }
                }
            }
        },
        '/mobile/home/popular-cities': {
            get: {
                tags: ['移动端 (Mobile)'],
                summary: '获取热门城市',
                responses: {
                    '200': { description: 'success', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } }
                }
            }
        },
        '/mobile/hotels': {
            get: {
                tags: ['移动端 (Mobile)'],
                summary: '获取酒店列表 (支持筛选)',
                parameters: [
                    { name: 'keyword', in: 'query', schema: { type: 'string' }, description: '关键词' },
                    { name: 'city', in: 'query', schema: { type: 'string' }, description: '城市（从地址匹配）' },
                    { name: 'checkIn', in: 'query', schema: { type: 'string' }, description: '入住日期 YYYY-MM-DD' },
                    { name: 'checkOut', in: 'query', schema: { type: 'string' }, description: '离店日期 YYYY-MM-DD' },
                    { name: 'starLevel', in: 'query', schema: { type: 'integer' }, description: '星级 (1-5)' },
                    { name: 'priceMin', in: 'query', schema: { type: 'integer' }, description: '最低价' },
                    { name: 'priceMax', in: 'query', schema: { type: 'integer' }, description: '最高价' },
                    { name: 'tags', in: 'query', schema: { type: 'string' }, description: '标签，逗号分隔' },
                    { name: 'page', in: 'query', schema: { type: 'integer' }, description: '页码' },
                    { name: 'pageSize', in: 'query', schema: { type: 'integer' }, description: '每页数量' }
                ],
                responses: { '200': { description: '成功返回酒店的分页数据', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } }
            }
        },
        '/mobile/hotels/{id}': {
            get: {
                tags: ['移动端 (Mobile)'],
                summary: '获取酒店详情',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: {
                    '200': { description: 'success', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
                    '404': { description: '酒店不存在或已下线', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } }
                }
            }
        },
        '/mobile/bookings': {
            post: {
                tags: ['移动端订单 (Mobile Bookings)'],
                summary: '创建订单 (移动端)',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['hotelId', 'roomId', 'checkIn', 'checkOut', 'totalPrice', 'guestName', 'guestPhone'],
                                properties: {
                                    hotelId: { type: 'string' },
                                    roomId: { type: 'string' },
                                    checkIn: { type: 'string' },
                                    checkOut: { type: 'string' },
                                    totalPrice: { type: 'number' },
                                    guestName: { type: 'string' },
                                    guestPhone: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                responses: { '200': { description: 'success', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } }
            },
            get: {
                tags: ['移动端订单 (Mobile Bookings)'],
                summary: '获取订单列表 (移动端)',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'status', in: 'query', schema: { type: 'string' }, description: '订单状态筛选' },
                    { name: 'page', in: 'query', schema: { type: 'integer' } },
                    { name: 'pageSize', in: 'query', schema: { type: 'integer' } }
                ],
                responses: { '200': { description: 'success', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } }
            }
        },
        '/mobile/bookings/{id}': {
            get: {
                tags: ['移动端订单 (Mobile Bookings)'],
                summary: '获取订单详情 (移动端)',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: { '200': { description: 'success', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } }
            },
            patch: {
                tags: ['移动端订单 (Mobile Bookings)'],
                summary: '更新订单状态 (移动端)',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { type: 'object', properties: { status: { type: 'string' } } }
                        }
                    }
                },
                responses: { '200': { description: 'success', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } }
            }
        },
        '/mobile/bookings/{id}/cancel': {
            patch: {
                tags: ['移动端订单 (Mobile Bookings)'],
                summary: '取消订单 (移动端)',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: { '200': { description: 'success', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } }
            }
        },
        '/merchant/hotels': {
            get: {
                tags: ['商户端 (Merchant)'],
                summary: '查询我的名下酒店',
                security: [{ bearerAuth: [] }],
                responses: { '200': { description: '成功返回数据', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } }
            },
            post: {
                tags: ['商户端 (Merchant)'],
                summary: '商户录入新酒店 (受 Zod 校验保护)',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['name_cn', 'address', 'rooms'],
                                properties: {
                                    name_cn: { type: 'string', description: '中文名 (最少2字)' },
                                    name_en: { type: 'string', description: '英文名(可选，但填写需至少2个字符)' },
                                    address: { type: 'string', description: '地址(至少5个字符)' },
                                    star_level: { type: 'integer', description: '星级(1-5)' },
                                    open_date: { type: 'string', description: 'YYYY-MM-DD' },
                                    banner_url: { type: 'string', description: '酒店主图 URL (上传接口返回 /uploads/xxx)' },
                                    tags: { type: 'array', items: { type: 'string' }, description: '标签数组' },
                                    rooms: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                name: { type: 'string', description: '房型名称（推荐字段）' },
                                                type_name: { type: 'string' },
                                                price: { type: 'number', description: '价格(>0)' },
                                                capacity: { type: 'integer', description: '容纳人数（推荐字段）' },
                                                stock: { type: 'integer', description: '库存（兼容 PC，后端会映射为 capacity）' },
                                                description: { type: 'string' },
                                                image_url: { type: 'string' },
                                                amenities: { type: 'array', items: { type: 'string' } }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': { description: '录入成功，等待管理员审核', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
                    '400': { description: '数据格式校验失败', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } }
                }
            }
        },
        '/merchant/hotels/{id}': {
            get: {
                tags: ['商户端 (Merchant)'],
                summary: '获取单个酒店详情',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: { '200': { description: 'success', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } }
            },
            put: {
                tags: ['商户端 (Merchant)'],
                summary: '更新酒店 (受 Zod 校验保护)',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/paths/~1merchant~1hotels/post/requestBody/content/application~1json/schema' }
                        }
                    }
                },
                responses: {
                    '200': { description: '更新成功，需重新审核', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
                    '400': { description: '数据格式校验失败', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
                    '403': { description: '无权修改', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } }
                }
            },
            delete: {
                tags: ['商户端 (Merchant)'],
                summary: '删除酒店',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: { '200': { description: '删除成功', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } }
            }
        },
        '/merchant/upload': {
            post: {
                tags: ['商户端 (Merchant)'],
                summary: '上传酒店图片',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'multipart/form-data': {
                            schema: {
                                type: 'object',
                                required: ['file'],
                                properties: {
                                    file: {
                                        type: 'string',
                                        format: 'binary',
                                        description: '图片文件字段名必须是 file'
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': { description: '上传成功，返回 /uploads/xxx', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
                    '400': { description: '文件类型/大小不符合要求', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } }
                }
            }
        },
        '/admin/hotels': {
            get: {
                tags: ['管理端 (Admin)'],
                summary: '管理员获取所有的酒店',
                security: [{ bearerAuth: [] }],
                responses: { '200': { description: '成功', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } }
            }
        },
        '/admin/hotels/{id}': {
            get: {
                tags: ['管理端 (Admin)'],
                summary: '管理员获取单个酒店详情',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: { '200': { description: '成功', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } }
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
                responses: { '200': { description: '成功', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } }
            }
        },
        '/admin/publish/{hotelId}': {
            patch: {
                tags: ['管理端 (Admin)'],
                summary: '发布/下线酒店',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'hotelId', in: 'path', required: true, schema: { type: 'string' } }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['action'],
                                properties: {
                                    action: { type: 'string', enum: ['publish', 'unpublish'] }
                                }
                            }
                        }
                    }
                },
                responses: { '200': { description: '成功', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } }
            }
        },
        '/user/register': {
            post: {
                tags: ['PC 用户体系 (User)'],
                summary: '注册 (username/password)',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { type: 'object', required: ['username', 'password'], properties: { username: { type: 'string' }, password: { type: 'string' } } }
                        }
                    }
                },
                responses: { '200': { description: '注册成功', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } }
            }
        },
        '/user/login': {
            post: {
                tags: ['PC 用户体系 (User)'],
                summary: '登录 (username/password)',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { type: 'object', required: ['username', 'password'], properties: { username: { type: 'string' }, password: { type: 'string' } } }
                        }
                    }
                },
                responses: { '200': { description: '登录成功', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } }
            }
        },
        '/user/profile': {
            get: {
                tags: ['PC 用户体系 (User)'],
                summary: '获取个人信息',
                security: [{ bearerAuth: [] }],
                responses: { '200': { description: 'success', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } }
            },
            put: {
                tags: ['PC 用户体系 (User)'],
                summary: '更新个人信息',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { type: 'object', properties: { password: { type: 'string', description: '新密码' } } }
                        }
                    }
                },
                responses: { '200': { description: '更新成功', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } }
            }
        },
        '/order': {
            post: {
                tags: ['订单 (Order)'],
                summary: '创建订单 (PC端)',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['hotel_id', 'room_id', 'check_in_date', 'check_out_date', 'guests'],
                                properties: {
                                    hotel_id: { type: 'string' },
                                    room_id: { type: 'string' },
                                    check_in_date: { type: 'string' },
                                    check_out_date: { type: 'string' },
                                    guests: { type: 'integer' }
                                }
                            }
                        }
                    }
                },
                responses: { '200': { description: 'success', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } }
            },
            get: {
                tags: ['订单 (Order)'],
                summary: '获取用户订单列表 (PC端)',
                security: [{ bearerAuth: [] }],
                responses: { '200': { description: 'success', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } }
            }
        },
        '/order/{id}': {
            get: {
                tags: ['订单 (Order)'],
                summary: '获取订单详情',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: { '200': { description: 'success', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } }
            }
        },
        '/order/{id}/status': {
            patch: {
                tags: ['订单 (Order)'],
                summary: '更新订单状态',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { type: 'object', required: ['status'], properties: { status: { type: 'string', enum: ['pending', 'confirmed', 'completed', 'cancelled'] } } }
                        }
                    }
                },
                responses: { '200': { description: 'success', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } }
            }
        },
        '/order/{id}/payment': {
            patch: {
                tags: ['订单 (Order)'],
                summary: '更新支付状态',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['payment_status'],
                                properties: {
                                    payment_status: { type: 'string', enum: ['unpaid', 'paid', 'refunded'] },
                                    payment_method: { type: 'string' },
                                    transaction_id: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                responses: { '200': { description: 'success', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } }
            }
        },
        '/order/admin/all': {
            get: {
                tags: ['订单 (Order)'],
                summary: '获取所有订单 (管理员)',
                security: [{ bearerAuth: [] }],
                responses: { '200': { description: 'success', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } }
            }
        }
    }
};

const setupSwagger = (app) => {
    // 注入 swagger-ui
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
        swaggerOptions: {
            persistAuthorization: true
        }
    }));
};

module.exports = setupSwagger;
