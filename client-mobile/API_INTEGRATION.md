# EasyStay 移动端 API 对接文档

> 版本: v1.0.1
> 更新时间: 2026-02-23
> 联系人: 前端开发团队

---

## 📋 目录

- [0. 前端实现状态](#0-前端实现状态)
- [1. 全局约定](#1-全局约定)
- [2. 认证接口](#2-认证接口)
- [3. 首页接口](#3-首页接口)
- [4. 酒店接口](#4-酒店接口)
- [5. 订单接口](#5-订单接口)
- [6. 数据结构定义](#6-数据结构定义)
- [7. 错误码定义](#7-错误码定义)
- [8. 联调注意事项](#8-联调注意事项)

---

## 0. 前端实现状态

### ✅ 已完成

移动端前端已完成所有页面和 API 集成代码，支持 **Mock 数据**和**真实后端 API** 无缝切换。

### 🔄 切换机制

前端通过环境变量 `VITE_USE_REAL_API` 控制数据来源：

| 模式 | 配置 | 数据来源 |
| :--- | :--- | :--- |
| Mock 开发 | `VITE_USE_REAL_API=false` | 前端 Mock 数据 |
| 真实联调 | `VITE_USE_REAL_API=true` | 后端 API 服务 |

**切换方式：** 修改 `.env` 文件后重启开发服务器

### 📦 前端代码结构

```text
src/services/
├── auth.ts      # 认证 API（已支持切换）
├── api.ts       # 酒店和订单 API（已支持切换）
└── mockData.ts  # Mock 数据定义
```

### ⚠️ 重要：响应处理

前端已配置响应拦截器，**自动提取 `data` 字段**：

```typescript
// 前端期望后端返回格式
{
  "code": 200,
  "data": { ... },      // 前端自动提取此字段
  "message": "success"
}
```

后端**必须**严格按照上述格式返回响应。

---

## 1. 全局约定

### 1.1 基础信息

| 项目 | 值 |
|------|-----|
| **Base URL** | `http://localhost:3000/api/v1` |
| **通信协议** | HTTP/1.1 |
| **数据格式** | `application/json` |
| **字符编码** | UTF-8 |

### 1.2 请求头规范

```http
Content-Type: application/json
Authorization: Bearer {token}  // 需要认证的接口
```

### 1.3 统一响应格式

**成功响应:**
```json
{
  "code": 200,
  "data": { ... },
  "message": "success"
}
```

**失败响应:**
```json
{
  "code": 400,
  "message": "错误描述信息"
}
```

### 1.4 HTTP 状态码

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未授权（Token 无效或过期） |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 2. 认证接口

### 2.1 用户登录

**接口地址:** `POST /auth/login`

**请求参数:**
```json
{
  "phone": "13800138000",
  "password": "123456"
}
```

**字段说明:**
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| phone | string | 是 | 手机号（11位） |
| password | string | 是 | 密码（最少6位） |

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "user": {
      "id": "user_123456",
      "phone": "13800138000",
      "email": "user@example.com",
      "name": "张三",
      "avatar": "https://example.com/avatar.jpg",
      "role": "user",
      "createdAt": "2026-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "登录成功"
}
```

---

### 2.2 用户注册

**接口地址:** `POST /auth/register`

**请求参数:**
```json
{
  "phone": "13800138000",
  "email": "user@example.com",
  "password": "123456",
  "confirmPassword": "123456",
  "name": "张三",
  "role": "user"
}
```

**字段说明:**
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| phone | string | 是 | 手机号（11位） |
| email | string | 是 | 邮箱地址 |
| password | string | 是 | 密码（最少6位） |
| confirmPassword | string | 是 | 确认密码 |
| name | string | 否 | 用户昵称 |
| role | string | 否 | 角色（默认: user） |

**响应示例:** 与登录接口相同

---

### 2.3 获取当前用户信息

**接口地址:** `GET /auth/me`

**请求头:**
```http
Authorization: Bearer {token}
```

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "id": "user_123456",
    "phone": "13800138000",
    "email": "user@example.com",
    "name": "张三",
    "avatar": "https://example.com/avatar.jpg",
    "role": "user",
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
}
```

---

### 2.4 发送密码重置验证码

**接口地址:** `POST /auth/send-reset-code`

**请求参数:**
```json
{
  "email": "user@example.com"
}
```

**响应示例:**
```json
{
  "code": 200,
  "message": "验证码已发送至邮箱"
}
```

> 注意：开发模式下，验证码会在响应中返回用于测试

---

### 2.5 使用验证码重置密码

**接口地址:** `POST /auth/reset-password-with-code`

**请求参数:**
```json
{
  "email": "user@example.com",
  "code": "123456",
  "newPassword": "newpassword123"
}
```

**响应示例:**
```json
{
  "code": 200,
  "message": "密码重置成功"
}
```

---

### 2.6 验证重置验证码

**接口地址:** `POST /auth/verify-reset-code`

**功能说明:** 用于前端实时验证验证码是否正确（在提交重置密码前验证）

**请求参数:**
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

**字段说明:**

| 字段 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| email | string | 是 | 邮箱地址 |
| code | string | 是 | 验证码 |

**响应示例:**
```json
{
  "code": 200,
  "data": true
}
```

**说明:**

- 返回 `true` 表示验证码正确
- 返回 `false` 或抛出错误表示验证码错误或已过期

---

### 2.7 用户登出

**接口地址:** `POST /auth/logout`

**请求头:**
```http
Authorization: Bearer {token}
```

**响应示例:**
```json
{
  "code": 200,
  "message": "登出成功"
}
```

---

## 3. 首页接口

### 3.1 获取首页 Banner

**接口地址:** `GET /mobile/home/banners`

**响应示例:**
```json
{
  "code": 200,
  "data": [
    {
      "id": "banner_1",
      "name": "上海陆家嘴禧酒店",
      "image": "https://example.com/banner1.jpg",
      "hotelId": "hotel_123"
    },
    {
      "id": "banner_2",
      "name": "北京王府井希尔顿酒店",
      "image": "https://example.com/banner2.jpg",
      "hotelId": "hotel_456"
    }
  ]
}
```

---

### 3.2 获取热门城市

**接口地址:** `GET /mobile/home/popular-cities`

**响应示例:**
```json
{
  "code": 200,
  "data": [
    {
      "name": "上海",
      "image": "https://example.com/shanghai.jpg"
    },
    {
      "name": "北京",
      "image": "https://example.com/beijing.jpg"
    },
    {
      "name": "三亚",
      "image": "https://example.com/sanya.jpg"
    }
  ]
}
```

---

## 4. 酒店接口

### 4.1 获取酒店列表

**接口地址:** `GET /mobile/hotels`

**查询参数:**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| city | string | 否 | 城市名称（如：上海、北京） |
| keyword | string | 否 | 搜索关键词 |
| checkIn | string | 否 | 入住日期（yyyy-MM-dd） |
| checkOut | string | 否 | 退房日期（yyyy-MM-dd） |
| starLevel | number | 否 | 星级筛选（1-5，0表示全部） |
| priceMin | number | 否 | 最低价格 |
| priceMax | number | 否 | 最高价格 |
| tags | string | 否 | 标签筛选（逗号分隔：亲子,豪华） |
| page | number | 否 | 页码（默认: 1） |
| pageSize | number | 否 | 每页数量（默认: 10） |

**请求示例:**
```http
GET /mobile/hotels?city=上海&starLevel=5&page=1&pageSize=10
```

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": "hotel_123",
        "name_cn": "上海陆家嘴禧酒店",
        "name_en": "Joy Hotel Lujiazui",
        "star_level": 5,
        "address": "上海市浦东新区陆家嘴环路1000号",
        "image": "https://example.com/hotel.jpg",
        "rating": 4.8,
        "tags": ["豪华", "亲子", "免费停车"],
        "price_start": 936,
        "is_offline": false,
        "audit_status": "approved"
      }
    ],
    "total": 100,
    "page": 1,
    "pageSize": 10
  }
}
```

---

### 4.2 获取酒店详情

**接口地址:** `GET /mobile/hotels/:id`

**路径参数:**
| 参数 | 类型 | 说明 |
|------|------|------|
| id | string | 酒店ID |

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "id": "hotel_123",
    "name_cn": "上海陆家嘴禧酒店",
    "name_en": "Joy Hotel Lujiazui",
    "star_level": 5,
    "location": {
      "province": "上海市",
      "city": "上海市",
      "address": "浦东新区陆家嘴环路1000号",
      "latitude": 31.2397,
      "longitude": 121.4997
    },
    "description": "酒店位于上海陆家嘴金融中心，毗邻东方明珠...",
    "rating": 4.8,
    "image": "https://example.com/hotel_main.jpg",
    "images": [
      "https://example.com/hotel1.jpg",
      "https://example.com/hotel2.jpg",
      "https://example.com/hotel3.jpg"
    ],
    "tags": ["豪华", "亲子", "免费停车", "含早餐"],
    "facilities": ["健身房", "游泳池", "WiFi", "停车场"],
    "rooms": [
      {
        "id": "room_1",
        "type": "经典双床房",
        "price": 936,
        "stock": 10,
        "description": "38平方米，双床，免费WiFi",
        "image": "https://example.com/room1.jpg"
      },
      {
        "id": "room_2",
        "type": "豪华大床房",
        "price": 1288,
        "stock": 5,
        "description": "45平方米，大床，免费WiFi",
        "image": "https://example.com/room2.jpg"
      }
    ],
    "price_start": 936,
    "is_offline": false,
    "audit_status": "approved",
    "created_at": "2026-01-01T00:00:00.000Z"
  }
}
```

> **重要**: 房型列表 `rooms` 必须按 `price` 从低到高排序

---

## 5. 订单接口

### 5.1 创建订单

**接口地址:** `POST /mobile/bookings`

**请求头:**
```http
Authorization: Bearer {token}
```

**请求参数:**
```json
{
  "hotelId": "hotel_123",
  "roomId": "room_1",
  "checkIn": "2026-03-01",
  "checkOut": "2026-03-03",
  "totalPrice": 1872,
  "guestName": "张三",
  "guestPhone": "13800138000"
}
```

**字段说明:**
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| hotelId | string | 是 | 酒店ID |
| roomId | string | 是 | 房型ID |
| checkIn | string | 是 | 入住日期（yyyy-MM-dd） |
| checkOut | string | 是 | 退房日期（yyyy-MM-dd） |
| totalPrice | number | 是 | 订单总价 |
| guestName | string | 是 | 入住人姓名 |
| guestPhone | string | 是 | 入住人手机号 |

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "id": "bk_1234567890_abc123",
    "hotelId": "hotel_123",
    "roomId": "room_1",
    "userId": "user_123456",
    "checkIn": "2026-03-01",
    "checkOut": "2026-03-03",
    "totalPrice": 1872,
    "status": "pending",
    "guestName": "张三",
    "guestPhone": "13800138000",
    "createdAt": "2026-02-23T10:30:00.000Z",
    "hotelName": "上海陆家嘴禧酒店",
    "hotelImage": "https://example.com/hotel.jpg",
    "roomType": "经典双床房"
  }
}
```

---

### 5.2 获取订单列表

**接口地址:** `GET /mobile/bookings`

**请求头:**
```http
Authorization: Bearer {token}
```

**查询参数:**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| status | string | 否 | 订单状态筛选 |
| page | number | 否 | 页码（默认: 1） |
| pageSize | number | 否 | 每页数量（默认: 10） |

**状态值:**
| 值 | 说明 |
|----|------|
| pending | 待支付 |
| confirmed | 已确认 |
| completed | 已完成 |
| cancelled | 已取消 |

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": "bk_1234567890_abc123",
        "hotelId": "hotel_123",
        "hotelName": "上海陆家嘴禧酒店",
        "hotelImage": "https://example.com/hotel.jpg",
        "roomType": "经典双床房",
        "checkIn": "2026-03-01",
        "checkOut": "2026-03-03",
        "totalPrice": 1872,
        "status": "confirmed",
        "guestName": "张三",
        "guestPhone": "13800138000",
        "createdAt": "2026-02-23T10:30:00.000Z"
      }
    ],
    "total": 5,
    "page": 1,
    "pageSize": 10
  }
}
```

---

### 5.3 获取订单详情

**接口地址:** `GET /mobile/bookings/:id`

**请求头:**
```http
Authorization: Bearer {token}
```

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "id": "bk_1234567890_abc123",
    "hotelId": "hotel_123",
    "roomId": "room_1",
    "userId": "user_123456",
    "checkIn": "2026-03-01",
    "checkOut": "2026-03-03",
    "totalPrice": 1872,
    "status": "confirmed",
    "guestName": "张三",
    "guestPhone": "13800138000",
    "createdAt": "2026-02-23T10:30:00.000Z",
    "hotelName": "上海陆家嘴禧酒店",
    "hotelImage": "https://example.com/hotel.jpg",
    "roomType": "经典双床房",
    "hotelAddress": "上海市浦东新区陆家嘴环路1000号",
    "nights": 2
  }
}
```

---

### 5.4 取消订单

**接口地址:** `PATCH /mobile/bookings/:id/cancel`

**请求头:**
```http
Authorization: Bearer {token}
```

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "id": "bk_1234567890_abc123",
    "status": "cancelled"
  },
  "message": "订单已取消"
}
```

---

## 6. 数据结构定义

### 6.1 User（用户）

```typescript
interface User {
  id: string;           // 用户ID
  phone: string;        // 手机号
  email?: string;       // 邮箱
  name?: string;        // 昵称
  avatar?: string;      // 头像URL
  role?: 'user' | 'merchant' | 'admin';  // 角色
  createdAt: string;    // 创建时间（ISO 8601）
}
```

### 6.2 Hotel（酒店）

```typescript
interface Hotel {
  id: string;                        // 酒店ID
  name_cn: string;                   // 酒店中文名
  name_en: string;                   // 酒店英文名
  star_level: number;                // 星级（1-5）
  location: {
    province: string;                // 省份
    city: string;                    // 城市
    address: string;                 // 详细地址
    latitude?: number;               // 纬度
    longitude?: number;              // 经度
  };
  description?: string;              // 酒店描述
  facilities?: string[];             // 设施列表
  rating: number;                    // 评分（0-5）
  image?: string;                    // 主图URL
  images?: string[];                 // 图片列表
  tags?: string[];                   // 标签（亲子、豪华等）
  price_start?: number;              // 起始价格
  rooms: Room[];                     // 房型列表（按价格升序）
  is_offline: boolean;               // 是否下线
  audit_status: 'pending' | 'approved' | 'rejected';  // 审核状态
  created_at: string;                // 创建时间
}
```

### 6.3 Room（房型）

```typescript
interface Room {
  id: string;           // 房型ID
  type: string;         // 房型名称
  price: number;        // 价格
  stock: number;        // 库存
  description?: string; // 描述
  image?: string;       // 图片URL
}
```

### 6.4 Booking（订单）

```typescript
interface Booking {
  id: string;              // 订单ID
  hotelId: string;         // 酒店ID
  roomId: string;          // 房型ID
  userId: string;          // 用户ID
  checkIn: string;         // 入住日期（yyyy-MM-dd）
  checkOut: string;        // 退房日期（yyyy-MM-dd）
  totalPrice: number;      // 订单总价
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';  // 状态
  guestName: string;       // 入住人姓名
  guestPhone: string;      // 入住人手机号
  createdAt: string;       // 创建时间
  // 以下为扩展字段（查询时返回）
  hotelName?: string;      // 酒店名称
  hotelImage?: string;     // 酒店图片
  hotelAddress?: string;   // 酒店地址
  roomType?: string;       // 房型名称
  nights?: number;         // 间夜数
}
```

---

## 7. 错误码定义

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权（Token 无效或过期） |
| 403 | 无权限访问 |
| 404 | 资源不存在 |
| 409 | 资源冲突（如手机号已注册） |
| 422 | 数据验证失败 |
| 500 | 服务器内部错误 |

---

## 8. 开联调注意事项

1. **CORS 配置**: 后端需要配置允许前端域名访问
2. **Token 过期**: Token 有效期建议 7 天，过期后需要重新登录
3. **图片资源**: 建议使用 CDN 或对象存储（如 OSS、S3）
4. **价格计算**: 价格计算应在后端完成，前端只负责展示
5. **房型排序**: 酒店详情的房型列表必须按 `price` 从低到高排序
6. **日期格式**: 统一使用 `yyyy-MM-dd` 格式

---

## 9. 联系方式

如有疑问，请联系：

- **前端开发**: [邮箱/电话]
- **项目 Issues**: [GitHub Issues 链接]

---

*文档版本: v1.0.1 | 最后更新: 2026-02-23*
