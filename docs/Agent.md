# EasyStay 易宿酒店预订平台 - AI 开发指南 (Agent.md)

> 本文档专为 AI 辅助编程（Vibe Coding）设计，提供项目完整的技术规范、开发约定和最佳实践。AI 助手在协助开发时应严格遵循本文档的约定。

---

## 目录

- [1. 项目概述](#1-项目概述)
- [2. 技术栈与架构](#2-技术栈与架构)
- [3. 目录结构](#3-目录结构)
- [4. 开发工作流](#4-开发工作流)
- [5. API 接口规范](#5-api-接口规范)
- [6. 数据结构定义](#6-数据结构定义)
- [7. 前端开发规范](#7-前端开发规范)
- [8. 后端开发规范](#8-后端开发规范)
- [9. 代码规范与约定](#9-代码规范与约定)
- [10. 测试与调试](#10-测试与调试)
- [11. 常见问题与解决方案](#11-常见问题与解决方案)

---

## 1. 项目概述

### 1.1 项目简介

EasyStay 是一个功能完善的酒店预订管理系统，采用前后端分离架构。系统为不同角色用户提供专属界面：

| 角色 | 端 | 核心功能 |
|------|-----|----------|
| **普通用户** | 移动端 (H5) | 浏览酒店、查看房型、完成预订、订单管理 |
| **商户** | PC 管理端 | 录入酒店信息、管理房型、更新价格库存 |
| **管理员** | PC 管理端 | 审核酒店信息、控制发布状态、平台管理 |

### 1.2 核心业务逻辑

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   商户端     │ ───> │   后端API   │ ───> │   移动端     │
│ (数据录入)   │      │ (审核流转)   │      │  (用户浏览)  │
└─────────────┘      └─────────────┘      └─────────────┘
                            │
                            ▼
                     ┌─────────────┐
                     │   管理员端   │
                     │ (审核/下线)  │
                     └─────────────┘
```

### 1.3 关键业务规则

1. **审核工作流**：商户提交 → 管理员审核 → 通过后发布 → 移动端可见
2. **虚拟删除**：下线操作仅修改 `is_offline` 标志，数据可恢复
3. **价格排序**：详情页房型列表必须按价格从低到高排序
4. **实时更新**：商户保存数据后，需实时同步到移动端
5. **双认证体系**：移动端使用手机号登录，PC 端使用用户名登录

---

## 2. 技术栈与架构

### 2.1 技术选型

| 层级 | 技术选型 | 版本 | 说明 |
| ------ | ---------- | ---------- | ------ |
| **移动端前端** | React | 18.3.1 | 函数式组件 + Hooks |
| **移动端语言** | TypeScript | 5.8.3 | 类型安全 |
| **移动端构建** | Vite | 6.3.5 | 开发服务器与构建 |
| **移动端 UI** | Ant Design Mobile | 5.42.3 | 移动端组件库 |
| **PC 管理端** | React | 19.2.0 | 函数式组件 + Hooks |
| **PC 端语言** | TypeScript | 5.9.3 | 类型安全 |
| **PC 端构建** | Vite | 7.3.1 | 开发服务器与构建 |
| **PC 端 UI** | Ant Design | 6.3.0 | 企业级 UI 组件库 |
| **状态管理** | Context API | - | 轻量级状态管理 |
| **HTTP 客户端** | Axios | 1.13.5 | 请求拦截器统一处理 Token |
| **国际化** | i18next | 25.8.6 | 多语言支持 |
| **后端框架** | Node.js + Express | 16+ / 4.19.2 | RESTful API 服务 |
| **数据库** | SQLite | better-sqlite3 12.6.2 | 轻量级本地数据库 |
| **缓存** | 内存 Map | - | 替代 Redis |
| **认证方案** | JWT | 9.0.2 | jsonwebtoken 库 |
| **密码加密** | bcryptjs | 3.0.3 | 密码哈希加密 |
| **数据验证** | Zod | 4.3.6 | Schema 校验 |

### 2.2 端口分配

| 服务 | 端口 | 访问地址 |
|------|------|----------|
| 后端服务 | 3000 | http://localhost:3000 |
| 后端文档 | 3000 | http://localhost:3000/api-docs |
| 移动端 | 3001 | http://localhost:3001 |
| PC 管理端 | 3002 | http://localhost:3002 |

---

## 3. 目录结构

```
EasyStay/
├── client-mobile/              # 移动端前端 (React + TypeScript + Vite)
│   ├── /src
│   │   ├── /components        # 业务组件
│   │   ├── /contexts          # Context 状态管理
│   │   ├── /hooks             # 自定义 Hooks
│   │   ├── /i18n              # 国际化配置
│   │   ├── /layouts           # 布局组件
│   │   ├── /pages             # 页面组件
│   │   ├── /services          # API 服务层
│   │   ├── /test              # 测试配置
│   │   ├── /types             # TypeScript 类型
│   │   ├── /utils             # 工具函数
│   │   ├── App.tsx            # 路由配置
│   │   └── main.tsx           # 应用入口
│   ├── /public                # 静态资源
│   ├── CLAUDE.md              # AI 上下文文档
│   ├── README.md              # 项目说明
│   └── API_INTEGRATION.md     # API 对接文档
├── client-pc/                  # PC 管理端 (React + TypeScript + Vite)
│   ├── /src
│   │   ├── /assets            # 项目资源文件
│   │   ├── /images            # 图片资源
│   │   ├── /constants         # 常量定义 (设施、标签)
│   │   ├── /layouts           # 布局组件 (侧边栏 + Header)
│   │   ├── /pages             # 页面组件
│   │   │   ├── /Admin          # 管理员页面 (审核、上下线)
│   │   │   ├── /Auth           # 认证页面 (登录、注册)
│   │   │   └── /Merchant       # 商户页面 (酒店列表、表单)
│   │   ├── /services          # API 服务层
│   │   ├── /test-data         # 测试数据管理 (LocalStorage)
│   │   ├── App.tsx            # 路由配置
│   │   └── main.tsx           # 应用入口
│   ├── CLAUDE.md              # AI 上下文文档
│   └── README.md              # 项目说明
├── server/                     # 后端服务 (Node.js + Express)
│   ├── /config                # 配置文件
│   │   ├── database.js        # SQLite 数据库连接与建表
│   │   └── cache.js           # 内存缓存实现
│   ├── /controllers           # 控制器（业务逻辑层）
│   │   ├── adminController.js    # 管理员业务逻辑
│   │   ├── authController.js     # 移动端认证业务
│   │   ├── merchantController.js # 商户业务逻辑
│   │   ├── mobileController.js   # 移动端首页和酒店查询
│   │   ├── mobileBookingController.js # 移动端订单业务
│   │   ├── orderController.js    # PC 端订单业务
│   │   └── userController.js     # PC 端用户认证业务
│   ├── /data                  # SQLite 数据库文件 (easystay.db, 自动生成)
│   ├── /routes                # API 路由处理
│   │   ├── admin.js           # 管理员路由
│   │   ├── auth.js            # 移动端认证路由
│   │   ├── merchant.js        # 商户路由
│   │   ├── mobile.js          # 移动端路由
│   │   ├── mobileBookings.js  # 移动端订单路由
│   │   ├── order.js           # PC 端订单路由
│   │   └── user.js            # PC 端用户路由
│   ├── /middlewares           # 中间件（认证、上传、验证）
│   │   ├── auth.js            # JWT 认证 + 角色权限检查
│   │   ├── upload.js          # Multer 图片上传配置
│   │   └── validate.js        # Zod 数据验证中间件
│   ├── /validators            # Zod 数据验证模式
│   │   └── schemas.js         # 注册、酒店、房型验证规则
│   ├── /utils                 # 工具函数
│   │   ├── file.js            # JSON 文件读写工具 (已废弃)
│   │   ├── location.js        # 地址解析工具 (省市提取)
│   │   └── swagger.js         # Swagger API 文档配置
│   ├── /scripts               # 工具脚本
│   │   ├── migrateData.js     # JSON 到 SQLite 数据迁移脚本
│   │   ├── pc-integration.ps1 # PC 端集成测试脚本
│   │   └── smoke.ps1          # 接口冒烟测试脚本
│   ├── /tests                 # 测试文件
│   │   └── authController.test.js # 认证控制器单元测试
│   ├── /uploads               # 上传的图片文件
│   ├── index.js               # 应用入口
│   ├── importMockData.js      # Mock 数据导入脚本
│   └── package.json           # 项目依赖
├── common/                     # 共享代码
├── docs/                       # 项目文档
│   ├── /product               # 产品需求文档
│   ├── /technical             # 技术规范文档
│   └── /teamwork              # 团队协作文档
├── Agent.md                    # AI 开发指南 (本文档)
├── README.md                   # 项目说明文档 (中文)
└── README_EN.md                # 项目说明文档 (英文)
```

---

## 4. 开发工作流

### 4.1 开发前准备

**AI 协助开发前，必须先了解：**

1. **确认开发任务类型**：
   - [ ] 新功能开发
   - [ ] Bug 修复
   - [ ] 代码重构
   - [ ] 代码审查

2. **确认相关文档**：
   - 功能需求：`docs/product/requirements_specification.md`
   - 接口定义：`docs/technical/api_spec.md`
   - 数据结构：`docs/technical/data_schema.md`
   - 各端 CLAUDE.md：`client-mobile/CLAUDE.md`, `client-pc/CLAUDE.md`, `server/CLAUDE.md`

3. **确认开发环境**：
   - Node.js 版本 >= 16
   - npm 已安装
   - 对应端的端口未被占用

### 4.2 代码开发流程

```
┌─────────────────────────────────────────────────────────────────┐
│                     AI 辅助开发流程                              │
├─────────────────────────────────────────────────────────────────┤
│ 1. 需求确认阶段                                                 │
│    • 理解用户需求                                               │
│    • 查阅相关文档                                               │
│    • 确认技术方案                                               │
│    • 列出开发任务清单                                           │
├─────────────────────────────────────────────────────────────────┤
│ 2. 代码生成阶段                                                 │
│    • 遵循项目目录结构                                           │
│    • 遵循代码规范约定                                           │
│    • 实现核心功能逻辑                                           │
│    • 添加必要的注释                                             │
├─────────────────────────────────────────────────────────────────┤
│ 3. 自查验证阶段                                                 │
│    • 检查代码语法                                               │
│    • 检查接口路径与字段                                         │
│    • 检查边界条件处理                                           │
│    • 检查错误处理                                               │
└─────────────────────────────────────────────────────────────────┘
```

### 4.3 接口优先原则

**重要约定**：前后端开发必须严格遵守 `docs/technical/api_spec.md` 中的接口定义。

- **接口路径**必须与规范一致
- **请求参数**名称和类型必须与规范一致
- **响应格式**必须遵循统一规范
- **前端可使用 Mock 数据先行开发**

---

## 5. API 接口规范与测试

> ⭐️ **【重要】**：后端已集成 Swagger 在线接口文档工具。
> 启动后端服务后，请直接访问 [http://localhost:3000/api-docs](http://localhost:3000/api-docs) 查阅所有的最新接口参数并进行在线联调测试。

### 5.1 全局约定

```typescript
// 基础配置
BASE_URL = 'http://localhost:3000/api/v1'
CONTENT_TYPE = 'application/json'

// 统一响应格式
interface ApiResponse<T = any> {
  code: number        // 200: 成功, 400+: 失败
  data?: T            // 成功时的数据
  message: string     // 响应消息
}

// 成功响应示例
{ "code": 200, "data": { ... }, "message": "success" }

// 失败响应示例
{ "code": 400, "message": "错误原因描述" }
```

### 5.2 接口清单

#### 移动端认证接口 (`/auth`) - 7个端点

| 方法 | 路径 | 功能 | 权限 |
|------|------|------|------|
| POST | `/auth/register` | 用户注册（手机号+密码+邮箱） | Public |
| POST | `/auth/login` | 用户登录（手机号+密码） | Public |
| GET | `/auth/me` | 获取当前用户信息 | Private |
| POST | `/auth/send-reset-code` | 发送密码重置验证码 | Public |
| POST | `/auth/verify-reset-code` | 验证重置验证码 | Public |
| POST | `/auth/reset-password-with-code` | 使用验证码重置密码 | Public |
| POST | `/auth/logout` | 用户登出 | Private |

#### 移动端首页接口 (`/mobile/home`) - 2个端点

| 方法 | 路径 | 功能 | 权限 |
|------|------|------|------|
| GET | `/mobile/home/banners` | 获取首页轮播图 | Public |
| GET | `/mobile/home/popular-cities` | 获取热门城市 | Public |

#### 移动端酒店接口 (`/mobile/hotels`) - 2个端点

| 方法 | 路径 | 功能 | 查询参数 |
|------|------|------|----------|
| GET | `/mobile/hotels` | 酒店列表查询 | keyword, city, checkIn, checkOut, starLevel, priceMin, priceMax, tags, page, pageSize |
| GET | `/mobile/hotels/:id` | 酒店详情获取（房型按价格升序） | - |

#### 移动端订单接口 (`/mobile/bookings`) - 5个端点

| 方法 | 路径 | 功能 | 权限 |
|------|------|------|------|
| POST | `/mobile/bookings` | 创建订单 | Private |
| GET | `/mobile/bookings` | 获取用户订单列表 | Private |
| GET | `/mobile/bookings/:id` | 获取订单详情 | Private |
| PATCH | `/mobile/bookings/:id/cancel` | 取消订单 | Private |
| PATCH | `/mobile/bookings/:id` | 更新订单状态 | Private |

#### PC 端用户接口 (`/user`) - 4个端点

| 方法 | 路径 | 功能 | 权限 |
|------|------|------|------|
| POST | `/user/register` | 用户注册（用户名+密码+角色） | Public |
| POST | `/user/login` | 用户登录（用户名+密码） | Public |
| GET | `/user/profile` | 获取个人信息 | Private |
| PUT | `/user/profile` | 更新个人信息 | Private |

#### 商户接口 (`/merchant`) - 6个端点

| 方法 | 路径 | 功能 | 权限 |
|------|------|------|------|
| GET | `/merchant/hotels` | 获取商户酒店列表 | Merchant |
| POST | `/merchant/hotels` | 创建酒店 | Merchant |
| PUT | `/merchant/hotels/:id` | 更新酒店 | Merchant |
| GET | `/merchant/hotels/:id` | 获取酒店详情 | Merchant |
| DELETE | `/merchant/hotels/:id` | 删除酒店 | Merchant |
| POST | `/merchant/upload` | 上传图片 | Public* |

#### 管理员接口 (`/admin`) - 4个端点

| 方法 | 路径 | 功能 | 权限 |
|------|------|------|------|
| GET | `/admin/hotels` | 获取所有酒店 | Admin |
| GET | `/admin/hotels/:id` | 获取酒店详情 | Admin |
| PATCH | `/admin/audit/:hotelId` | 审核酒店（通过/拒绝） | Admin |
| PATCH | `/admin/publish/:hotelId` | 发布/下线酒店 | Admin |

#### PC 端订单接口 (`/order`) - 6个端点

| 方法 | 路径 | 功能 | 权限 |
|------|------|------|------|
| POST | `/order` | 创建订单 | Private |
| GET | `/order` | 获取用户订单列表 | Private |
| GET | `/order/:id` | 获取订单详情 | Private |
| PATCH | `/order/:id/status` | 更新订单状态 | Private |
| PATCH | `/order/:id/payment` | 更新支付状态 | Private |
| GET | `/order/admin/all` | 管理员获取所有订单 | Admin |

### 5.3 Axios 请求配置模板

```javascript
// services/api.js (移动端示例)
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器 - 添加 Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器 - 统一错误处理
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Token 过期，跳转登录
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 5.4 双认证体系

**移动端认证** (`/auth`)：
- 登录方式：手机号 + 密码
- 注册方式：手机号 + 密码 + 邮箱

**PC 端认证** (`/user`)：
- 登录方式：用户名 + 密码
- 注册方式：用户名 + 密码 + 角色（商户/管理员）

---

## 6. 数据结构定义

### 6.1 酒店信息对象 (Hotel)

```typescript
interface Hotel {
  // 基础信息 (必须)
  id: string;                  // 酒店唯一标识符 (UUID)
  name_cn: string;             // 酒店中文名 (必须)
  name_en: string;             // 酒店英文名 (必须)
  address: string;             // 酒店详细地址 (必须)
  star_level: number;          // 星级 (1-5)

  // 位置与描述
  location: {                  // 位置信息 JSON
    province: string;
    city: string;
    address: string;
    coordinates?: { lat: number; lng: number };
  };
  description: string;         // 酒店描述
  facilities: string[];        // 设施列表 JSON 数组
  rating: number;              // 评分 (0-5)

  // 图片与标签
  image: string;               // 主图 URL
  images: string[];            // 图片列表 JSON 数组
  tags: string[];              // 标签 JSON 数组
  price_start: number;         // 起始价格
  open_date: string;           // 开业时间
  banner_url: string;          // Banner 图片 URL

  // 审核与发布状态
  audit_status: 'Pending' | 'Approved' | 'Rejected';  // 审核状态
  is_offline: number;          // 是否下线 (虚拟删除标志, 0/1)
  fail_reason?: string;        // 审核不通过原因

  // 商户信息
  merchant_id: string;         // 所属商户 ID
  merchant_username: string;   // 所属商户用户名

  // 时间戳
  created_at: string;          // 创建时间
  updated_at: string;          // 更新时间

  // 房型列表
  rooms: Room[];               // 嵌套房型数组
}

interface Room {
  id: string;                  // 房型唯一标识 (UUID)
  name: string;                // 房型名称 (必须)
  price: number;               // 房型价格 (必须，用于排序)
  capacity: number;            // 容纳人数
  description: string;         // 房型描述
  image_url: string;           // 房型图片 URL
  amenities: string[];         // 设施列表 JSON 数组
  hotelId: string;             // 所属酒店 ID (外键)
}
```

### 6.2 用户账户对象 (User)

```typescript
interface User {
  id: string;                  // 用户唯一标识 (UUID)
  phone: string;               // 手机号 (移动端登录)
  email: string;               // 邮箱 (用于密码重置)
  username: string;            // 用户名 (PC端登录)
  password: string;            // 加密后的密码
  name: string;                // 用户昵称
  avatar: string;              // 用户头像 URL
  role: 'user' | 'merchant' | 'admin';  // 角色
  created_at: string;          // 注册时间
}
```

### 6.3 订单对象 (Order)

```typescript
interface Order {
  id: string;                  // 订单唯一标识
  user_id: string;             // 下单用户 ID (外键)
  hotel_id: string;            // 预订酒店 ID (外键)
  room_id: string;             // 预订房型 ID (外键)
  check_in_date: string;       // 入住日期 (yyyy-MM-dd)
  check_out_date: string;      // 离店日期 (yyyy-MM-dd)
  guests: number;              // 入住人数
  total_price: number;         // 订单总价
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';  // 订单状态
  payment_status: 'unpaid' | 'paid' | 'refunded';  // 支付状态
  payment_method: string;      // 支付方式
  transaction_id: string;      // 交易流水号
  guestName: string;           // 入住人姓名
  guestPhone: string;          // 入住人电话
  hotelName: string;           // 酒店名称（冗余字段）
  hotelImage: string;          // 酒店图片（冗余字段）
  roomType: string;            // 房型名称（冗余字段）
  nights: number;              // 间夜数
  created_at: string;          // 创建时间
  updated_at: string;          // 更新时间
}
```

### 6.4 数据约束规则 (Zod 强校验保护)

> 后端路由已全面接入 `Zod` 参数校验能力，当前端传参不符以下规定的长度或类型时，将拦截请求并返回 `400` 错误。

| 字段 | 约束 | 说明 |
|------|------|------|
| `hotel.id` | 唯一 | 后端自动生成 |
| `hotel.name_cn` | 2 - 50 字符 | 必填，且必须是字符串 |
| `hotel.name_en` | >= 2 字符 | 可选 |
| `hotel.address` | >= 5 字符 | 必填 |
| `hotel.open_date` | DateString | 必须匹配 `YYYY-MM-DD` 格式 |
| `hotel.star_level` | 1-5 整数 | 必须在此范围内 |
| `hotel.audit_status` | 枚举 | Pending / Approved / Rejected |
| `hotel.is_offline` | 布尔/整数 | 0 或 1 |
| `room.name` | 非空字符串 | 必填 |
| `room.price` | Number | 必须为大于0的数字，不支持负数 |

---

## 7. 前端开发规范

### 7.1 React 组件开发约定

**组件结构模板**：

```jsx
// components/HotelCard/HotelCard.jsx
import React, { useState, useEffect } from 'react';
import { Card, Tag, Rate } from 'antd-mobile';
import PropTypes from 'prop-types';
import './HotelCard.css';

/**
 * 酒店卡片组件
 * @param {Object} props - 组件属性
 * @param {Hotel} props.hotel - 酒店信息对象
 * @param {Function} props.onClick - 点击回调
 */
const HotelCard = ({ hotel, onClick }) => {
  // 状态定义
  const [loading, setLoading] = useState(false);

  // 副作用
  useEffect(() => {
    // 初始化逻辑
  }, []);

  // 事件处理
  const handleClick = () => {
    onClick?.(hotel);
  };

  // 渲染
  return (
    <Card onClick={handleClick} className="hotel-card">
      {/* 组件内容 */}
    </Card>
  );
};

// 类型定义
HotelCard.propTypes = {
  hotel: PropTypes.object.isRequired,
  onClick: PropTypes.func,
};

HotelCard.defaultProps = {
  onClick: () => {},
};

export default HotelCard;
```

### 7.2 组件命名约定

| 类型 | 约定 | 示例 |
|------|------|------|
| 组件文件 | PascalCase | `HotelCard.tsx` |
| 组件名称 | PascalCase | `HotelCard` |
| 样式文件 | kebab-case | `hotel-card.css` |
| 工具函数 | camelCase | `formatPrice()` |
| 常量 | UPPER_SNAKE_CASE | `API_BASE_URL` |
| Hook | camelCase，use 前缀 | `useHotelList()` |

### 7.3 移动端特殊要求

#### 价格排序逻辑

```javascript
// 详情页房型列表 - 价格升序排列
const HotelDetail = ({ hotel }) => {
  const sortedRooms = [...hotel.rooms].sort((a, b) => a.price - b.price);

  return (
    <div className="room-list">
      {sortedRooms.map(room => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  );
};
```

#### 长列表优化

```javascript
// 使用 ahooks 的 useVirtualList 实现虚拟列表
import { useVirtualList } from 'ahooks';

const HotelList = ({ hotels }) => {
  const [list, scrollTo] = useVirtualList(
    hotels,
    { itemHeight: 200, overscan: 5 }
  );

  return (
    <div ref={list.containerRef} style={{ height: '500px', overflow: 'auto' }}>
      <div style={{ height: list.totalHeight }}>
        {list.virtualItems.map(virtualItem => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.height}px`,
              transform: `translateY(${virtualItem.top}px)`,
            }}
          >
            <HotelCard hotel={virtualItem.data} />
          </div>
        ))}
      </div>
    </div>
  );
};
```

### 7.4 PC 管理端特殊要求

#### 表单验证

```javascript
// 表单验证规则示例
const hotelRules = {
  name_cn: [
    { required: true, message: '请输入酒店中文名' },
    { min: 2, max: 50, message: '长度需在 2-50 之间' },
  ],
  star_level: [
    { required: true, message: '请选择酒店星级' },
    { type: 'number', min: 1, max: 5, message: '星级需在 1-5 之间' },
  ],
  rooms: [
    {
      validator: (_, value) => {
        if (!value || value.length === 0) {
          return Promise.reject('请至少添加一种房型');
        }
        return Promise.resolve();
      },
    },
  ],
};
```

#### 角色路由守卫

```javascript
// 根据角色路由跳转
const handleLoginSuccess = (user) => {
  localStorage.setItem('token', user.token);
  localStorage.setItem('role', user.role);

  if (user.role === 'merchant') {
    navigate('/merchant/hotels');
  } else if (user.role === 'admin') {
    navigate('/admin/audit');
  }
};
```

### 7.5 API 切换机制

**移动端**：通过 `VITE_USE_REAL_API` 环境变量控制

```typescript
// 默认使用真实 API，除非显式设置 VITE_USE_REAL_API=false
const USE_REAL_API = import.meta.env.VITE_USE_REAL_API !== 'false';

export const getHotels = async (params) => {
  if (USE_REAL_API) {
    try {
      return await apiClient.get('/mobile/hotels', { params });
    } catch (error) {
      console.error('API 请求失败，回退到 Mock 数据');
      // 自动回退到 Mock 数据
    }
  }
  // Mock 数据逻辑
};
```

**PC 端**：通过 `DATA_SOURCE` 常量控制

```typescript
// src/services/config.ts
export const DATA_SOURCE: string = "backend";  // "local" | "backend"

if (DATA_SOURCE === "local") {
  // 使用 LocalStorage 数据
  const hotels = readHotels();
} else {
  // 调用后端 API
  const result = await api.get("/merchant/hotels");
}
```

---

## 8. 后端开发规范

### 8.1 Express 路由结构模板

```javascript
// routes/mobile.js
const express = require('express');
const router = express.Router();
const mobileController = require('../controllers/mobileController');
const authMiddleware = require('../middlewares/auth');

/**
 * @route   GET /mobile/home/banners
 * @desc    获取首页 Banner
 * @access  Public
 */
router.get('/home/banners', mobileController.getBanners);

/**
 * @route   GET /mobile/home/popular-cities
 * @desc    获取热门城市
 * @access  Public
 */
router.get('/home/popular-cities', mobileController.getPopularCities);

/**
 * @route   GET /mobile/hotels
 * @desc    酒店列表查询
 * @access  Public
 * @query   keyword, city, checkIn, checkOut, starLevel, priceMin, priceMax, tags, page, pageSize
 */
router.get('/hotels', mobileController.getHotels);

/**
 * @route   GET /mobile/hotels/:id
 * @desc    酒店详情获取
 * @access  Public
 */
router.get('/hotels/:id', mobileController.getHotelById);

module.exports = router;
```

### 8.2 控制器模板

```javascript
// controllers/mobileController.js
const db = require('../config/database');
const Cache = require('../config/cache');

/**
 * 获取酒店列表
 * 支持多条件筛选和分页
 */
const getHotels = async (req, res) => {
  try {
    const { keyword, city, starLevel, page = 1, pageSize = 10 } = req.query;

    // 尝试从缓存获取
    const cacheKey = `hotels:v2:${JSON.stringify(req.query)}`;
    const cached = Cache.get(cacheKey);
    if (cached) {
      return res.json({ code: 200, data: cached, message: 'success' });
    }

    // 从数据库查询
    let sql = 'SELECT * FROM hotels WHERE is_offline = 0 AND audit_status = "Approved"';
    const params = [];

    if (city) {
      sql += ' AND location LIKE ?';
      params.push(`%"city":"${city}"%`);
    }
    if (starLevel) {
      sql += ' AND star_level = ?';
      params.push(parseInt(starLevel));
    }

    // 分页处理
    const offset = (page - 1) * pageSize;
    sql += ' LIMIT ? OFFSET ?';
    params.push(parseInt(pageSize), parseInt(offset));

    const hotels = db.prepare(sql).all(...params);

    // 缓存结果 (30分钟)
    Cache.set(cacheKey, hotels, 30 * 60 * 1000);

    res.json({
      code: 200,
      data: hotels,
      message: 'success',
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: error.message,
    });
  }
};

module.exports = { getHotels, ... };
```

### 8.3 JWT 认证中间件

```javascript
// middlewares/auth.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'easystay_secret_key';

const authMiddleware = (req, res, next) => {
  // 从请求头获取 Token
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      code: 401,
      message: '未提供认证令牌',
    });
  }

  try {
    // 验证 Token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;  // 将用户信息附加到请求对象
    next();
  } catch (error) {
    return res.status(401).json({
      code: 401,
      message: '令牌无效或已过期',
    });
  }
};

// 角色验证中间件
const roleCheck = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        code: 403,
        message: '无权限访问',
      });
    }
    next();
  };
};

module.exports = { authMiddleware, roleCheck };
```

### 8.4 虚拟删除实现

```javascript
// 下线操作 - 虚拟删除
const publishHotel = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const { action } = req.body;  // 'publish' 或 'unpublish'

    // 更新数据库
    const isOffline = action === 'unpublish' ? 1 : 0;

    db.prepare('UPDATE hotels SET is_offline = ? WHERE id = ?')
      .run(isOffline, hotelId);

    // 清除相关缓存
    Cache.del(/^hotels:v2:/);
    Cache.del(`hotel:v2:${hotelId}`);

    res.json({
      code: 200,
      message: action === 'publish' ? '上线成功' : '下线成功',
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: error.message,
    });
  }
};
```

### 8.5 缓存策略

```javascript
// config/cache.js - 内存缓存实现
class Cache {
  constructor() {
    this.cache = new Map();
  }

  set(key, value, expiration) {
    const expiresAt = Date.now() + expiration;
    this.cache.set(key, { value, expiresAt });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }

  del(pattern) {
    if (pattern instanceof RegExp) {
      for (const key of this.cache.keys()) {
        if (pattern.test(key)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.delete(pattern);
    }
  }
}

const cache = new Cache();

// 缓存配置示例
const CACHE_CONFIG = {
  banners: 60 * 60 * 1000,           // 1小时
  popular_cities: 24 * 60 * 60 * 1000, // 24小时
  hotels: 30 * 60 * 1000,            // 30分钟
  hotel: 60 * 60 * 1000,             // 1小时
};

module.exports = cache;
```

---

## 9. 代码规范与约定

### 9.1 通用规范

1. **使用中文注释**：所有注释和文档使用中文
2. **JSDoc 风格**：函数和组件应添加 JSDoc 注释
3. **错误处理**：所有异步操作必须包含 try-catch
4. **语义化命名**：变量和函数名称应清晰表达其用途
5. **单一职责**：每个函数/组件只做一件事

### 9.2 JavaScript/React 规范

```javascript
// ✅ 推荐 - 使用可选链和空值合并
const name = hotel?.name_cn ?? '未知';

// ✅ 推荐 - 使用解构赋值
const { name_cn, address, star_level } = hotel;

// ✅ 推荐 - 使用模板字符串
const message = `欢迎光临 ${hotel.name_cn}`;

// ❌ 避免 - 链式调用空值报错
const name = hotel.name_cn;  // hotel 可能为 null

// ❌ 避免 - 直接拼接字符串
const message = '欢迎光临 ' + hotel.name_cn;
```

### 9.3 Git 提交规范

```
<type>(<scope>): <subject>

type 类型:
- feat: 新功能
- fix: Bug 修复
- docs: 文档更新
- style: 代码格式调整
- refactor: 重构
- perf: 性能优化
- test: 测试相关
- chore: 构建/工具相关

scope 范围:
- mobile: 移动端
- pc: PC 管理端
- server: 后端
- docs: 文档

示例:
feat(mobile): 添加酒店列表无限滚动功能
fix(admin): 修复审核状态更新问题
docs: 更新 API 接口文档
```

---

## 10. 测试与调试

### 10.1 前端调试技巧

1. **React Developer Tools**：检查组件状态和 Props
2. **Network 面板**：检查 API 请求和响应
3. **Console 日志**：
   ```javascript
   console.log('Debug Info:', data);
   console.table(data);  // 表格形式输出数组
   ```

### 10.2 后端调试技巧

1. **使用环境变量控制日志**：
   ```javascript
   if (process.env.NODE_ENV === 'development') {
     console.log('[DEBUG]', req.body);
   }
   ```

2. **API 测试工具**：
   - Swagger UI: http://localhost:3000/api-docs
   - Postman
   - curl 命令

3. **冒烟测试脚本**：
   ```bash
   pwsh -NoProfile -ExecutionPolicy Bypass -File ./scripts/smoke.ps1
   ```

### 10.3 常见问题排查

| 问题 | 可能原因 | 解决方案 |
|------|----------|----------|
| CORS 跨域错误 | 前后端地址不同 | 后端添加 CORS 中间件 |
| Token 无效 | Token 过期或格式错误 | 检查 localStorage 中的 Token |
| 房型不排序 | 未调用 sort 方法 | 检查详情页排序逻辑 |
| 下线数据恢复失败 | 物理删除了数据 | 使用虚拟删除 (is_offline) |
| 请求超时 | 网络或后端响应慢 | 增加 Axios timeout 配置 |
| 缓存数据过期 | 缓存时间到 | 数据变更时主动清除缓存 |

---

## 11. 常见问题与解决方案

### 11.1 开发环境配置

**Q: npm install 速度慢或失败？**
```bash
# 使用国内镜像
npm config set registry https://registry.npmmirror.com
```

**Q: 端口被占用？**
```bash
# Windows 查找占用端口的进程
netstat -ano | findstr :3000
# 杀掉进程
taskkill /PID <进程ID> /F
```

### 11.2 前端常见问题

**Q: Ant Design 组件样式不生效？**
```javascript
// 确保正确导入了样式文件
import 'antd-mobile/bundle.css';
import 'antd/dist/reset.css';
```

**Q: React Hooks 报错？**
```javascript
// Hooks 只能在函数组件的顶层调用
// ❌ 错误 - 在条件语句中调用
if (condition) {
  const [state, setState] = useState();
}

// ✅ 正确
const [state, setState] = useState();
if (condition) {
  // 使用 state
}
```

### 11.3 后端常见问题

**Q: SQLite 数据库写入失败？**
```javascript
// 确保使用 better-sqlite3 同步 API
// 确保有文件写入权限
// 确保目录存在
```

**Q: JWT 验证失败？**
```javascript
// 检查 SECRET 是否一致
// 检查 Token 格式 (Bearer xxx)
// 检查 Token 是否过期 (7天有效期)
```

**Q: 缓存不更新？**
```javascript
// 数据变更时主动清除缓存
Cache.del(/^hotels:v2:/);  // 批量清除酒店列表缓存
Cache.del(`hotel:v2:${hotelId}`);  // 清除单个酒店详情缓存
```

---

## 附录

### A. 环境变量模板

```bash
# server/.env (后端)
PORT=3000
NODE_ENV=development
JWT_SECRET=easystay_jwt_secret_key_2024_please_change_this_in_production
```

```bash
# client-mobile/.env (移动端)
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_USE_REAL_API=true
```

```bash
# client-pc/.env (PC 管理端)
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

### B. 项目启动检查清单

开发前确保：
- [ ] Node.js 版本 >= 16
- [ ] 已创建 `.env` 文件并配置正确
- [ ] 后端 `data/` 目录可写
- [ ] 端口 3000、3001、3002 未被占用
- [ ] 已安装项目依赖 `npm install`

### C. 相关文档链接

- [产品需求规格说明](docs/product/requirements_specification.md)
- [技术实现方案](docs/technical/technical_specification.md)
- [API 接口规范](docs/technical/api_spec.md)
- [数据结构定义](docs/technical/data_schema.md)
- [团队分工协作](docs/teamwork/teamwork_distribution.md)
- [移动端文档](client-mobile/CLAUDE.md)
- [PC 管理端文档](client-pc/CLAUDE.md)
- [后端文档](server/CLAUDE.md)

### D. 启动命令速查

```bash
# 后端
cd server
npm install
npm run dev        # 开发模式 (nodemon)
npm start          # 生产模式

# 移动端
cd client-mobile
npm install
npm run dev        # 开发服务器 (端口 3001)

# PC 管理端
cd client-pc
npm install
npm run dev        # 开发服务器 (端口 3002)
```

---

**更新日期**: 2026-02-26
**版本**: v2.0
**维护者**: EasyStay Team

---

> 💡 **AI 助手使用提示**
>
> 当收到开发任务时，AI 助手应：
> 1. 首先阅读本文档相关章节
> 2. 确认任务类型和涉及的技术栈
> 3. 查阅对应的 API 规范和数据结构
> 4. 严格遵循代码规范和目录结构
> 5. 输出代码后进行自我检查
> 6. 提供必要的测试和使用说明
