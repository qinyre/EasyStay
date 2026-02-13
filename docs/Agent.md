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
| **普通用户** | 移动端 (H5) | 浏览酒店、查看房型、完成预订 |
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

---

## 2. 技术栈与架构

### 2.1 技术选型

| 层级 | 技术选型 | 版本要求 | 说明 |
| ------ | ---------- | ---------- | ------ |
| **移动端前端** | React | 18+ | 函数式组件 + Hooks |
| **PC 管理端** | React | 18+ | 函数式组件 + Hooks |
| **状态管理** | Context API / Zustand | - | 轻量级状态管理 |
| **HTTP 客户端** | Axios | 1.6+ | 请求拦截器统一处理 Token |
| **移动端 UI** | Ant Design Mobile | 5.x | 移动端组件库 |
| **PC 端 UI** | Ant Design | 5.x | 企业级 UI 组件库 |
| **后端框架** | Node.js + Express | 16+ | RESTful API 服务 |
| **数据存储** | JSON 文件 | - | fs 模块读写 |
| **认证方案** | JWT | - | jsonwebtoken 库 |

### 2.2 端口分配

| 服务 | 端口 | 访问地址 |
|------|------|----------|
| 后端服务 | 3000 | http://localhost:3000 |
| 移动端 | 3001 | http://localhost:3001 |
| PC 管理端 | 3002 | http://localhost:3002 |

---

## 3. 当前目录结构

> 目录结构将随着开发进展逐步完善，以下为当前实际结构：

```
EasyStay/
├── client-mobile/              # 移动端前端 (React) - 待开发
├── client-pc/                  # PC 管理端 (React) - 待开发
├── server/                     # 后端服务 (Node.js) - 待开发
├── common/                     # 共享代码
├── docs/                      # 项目文档
│   ├── product/               # 产品需求文档
│   ├── technical/             # 技术规范文档
│   └── teamwork/              # 团队协作文档
├── Agent.md                   # AI 开发指南
└── README.md                  # 项目说明文档
```

> 💡 随着开发进行，各子目录的详细结构将逐步建立并更新到此文档。

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

3. **确认开发环境**：
   - Node.js 版本 >= 16
   - npm/yarn 已安装
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

## 5. API 接口规范

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

#### 认证接口

| 方法 | 路径 | 功能 | 请求参数 |
|------|------|------|----------|
| POST | `/auth/register` | 用户注册 | username, password, role |
| POST | `/auth/login` | 用户登录 | username, password |

#### 移动端接口

| 方法 | 路径 | 功能 | 查询参数 |
|------|------|------|----------|
| GET | `/mobile/home/banners` | 获取首页Banner | - |
| GET | `/mobile/hotels` | 酒店列表查询 | location, keyword, startDate, endDate, starLevel, page |
| GET | `/mobile/hotels/:id` | 酒店详情获取 | - |

#### 管理端接口

| 方法 | 路径 | 功能 | 说明 |
|------|------|------|------|
| POST | `/merchant/hotels` | 录入酒店信息 | 商户端 |
| PUT | `/merchant/hotels/:id` | 编辑酒店信息 | 商户端 |
| PATCH | `/admin/audit/:hotelId` | 审核酒店信息 | 管理员端 |
| PATCH | `/admin/publish/:hotelId` | 发布/下线酒店 | 管理员端 |

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

---

## 6. 数据结构定义

### 6.1 酒店信息对象 (Hotel)

```typescript
interface Hotel {
  // 基础信息 (必须维度)
  id: string;                  // 酒店唯一标识符
  name_cn: string;            // 酒店中文名
  name_en: string;            // 酒店英文名
  address: string;            // 酒店详细地址
  star_level: number;         // 星级 (1-5)
  open_date: string;          // 开业时间 (YYYY-MM-DD)

  // 审核与发布状态
  audit_status: 'Pending' | 'Approved' | 'Rejected';  // 审核状态
  fail_reason?: string;       // 审核不通过原因
  is_offline: boolean;        // 是否已下线 (虚拟删除标志)

  // 展示信息
  banner_url: string;         // 酒店大图 URL
  tags: string[];             // 快捷标签，如 ["亲子", "豪华"]

  // 可选维度
  attractions?: string;       // 附近景点/交通
  discount_info?: string;     // 优惠信息

  // 房型列表
  rooms: Room[];              // 嵌套房型数组
}

interface Room {
  type_name: string;          // 房型名称，如 "经典双床房"
  price: number;             // 房型价格 (核心字段，用于排序)
  stock: number;             // 房间库存
}
```

### 6.2 用户账户对象 (User)

```typescript
interface User {
  username: string;          // 登录账号 (唯一)
  password: string;          // 登录密码 (实际存储哈希值)
  role: 'merchant' | 'admin'; // 账户角色
}
```

### 6.3 数据约束规则

| 字段 | 约束 | 说明 |
|------|------|------|
| `hotel.id` | 唯一 | 建议使用时间戳或 UUID |
| `hotel.star_level` | 1-5 | 必须在此范围内 |
| `hotel.audit_status` | 枚举 | Pending / Approved / Rejected |
| `hotel.is_offline` | 布尔 | true 表示下线 |
| `room.price` | Number | 必须为数字类型，支持排序 |
| `room.stock` | >= 0 | 库存不能为负数 |

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
| 组件文件 | PascalCase | `HotelCard.jsx` |
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
        <RoomCard key={room.type_name} room={room} />
      ))}
    </div>
  );
};
```

#### 长列表优化

```javascript
// 使用 Intersection Observer 实现无限滚动
const useInfiniteScroll = (callback) => {
  const observerRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          callback();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [callback]);

  return observerRef;
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

---

## 8. 后端开发规范

### 8.1 Express 路由结构模板

```javascript
// routes/mobile.js
const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');
const authMiddleware = require('../middlewares/auth');

/**
 * @route   GET /mobile/home/banners
 * @desc    获取首页 Banner
 * @access  Public
 */
router.get('/home/banners', hotelController.getBanners);

/**
 * @route   GET /mobile/hotels
 * @desc    酒店列表查询
 * @access  Public
 * @query   location, keyword, startDate, endDate, starLevel, page
 */
router.get('/hotels', hotelController.getHotels);

/**
 * @route   GET /mobile/hotels/:id
 * @desc    酒店详情获取
 * @access  Public
 */
router.get('/hotels/:id', hotelController.getHotelById);

module.exports = router;
```

### 8.2 控制器模板

```javascript
// controllers/hotelController.js
const { readHotels, writeHotels } = require('../utils/file');

/**
 * 获取酒店列表
 * 支持多条件筛选和分页
 */
const getHotels = async (req, res) => {
  try {
    const { location, keyword, starLevel, page = 1 } = req.query;

    // 读取数据
    let hotels = await readHotels();

    // 筛选已上线且审核通过的酒店
    hotels = hotels.filter(
      h => !h.is_offline && h.audit_status === 'Approved'
    );

    // 应用筛选条件
    if (location) {
      hotels = hotels.filter(h => h.address.includes(location));
    }
    if (keyword) {
      hotels = hotels.filter(h =>
        h.name_cn.includes(keyword) || h.name_en.includes(keyword)
      );
    }
    if (starLevel) {
      hotels = hotels.filter(h => h.star_level === parseInt(starLevel));
    }

    // 分页处理
    const pageSize = 10;
    const start = (page - 1) * pageSize;
    const paginatedHotels = hotels.slice(start, start + pageSize);

    res.json({
      code: 200,
      data: {
        list: paginatedHotels,
        total: hotels.length,
        page: parseInt(page),
        pageSize,
      },
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

### 8.4 JSON 文件操作工具

```javascript
// utils/file.js
const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');

/**
 * 读取酒店数据
 */
async function readHotels() {
  const filePath = path.join(DATA_DIR, 'hotels.json');
  const content = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(content);
}

/**
 * 写入酒店数据 (带文件锁保护)
 */
async function writeHotels(hotels) {
  const filePath = path.join(DATA_DIR, 'hotels.json');
  await fs.writeFile(
    filePath,
    JSON.stringify(hotels, null, 2),
    'utf-8'
  );
}

/**
 * 读取用户数据
 */
async function readUsers() {
  const filePath = path.join(DATA_DIR, 'users.json');
  const content = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(content);
}

module.exports = {
  readHotels,
  writeHotels,
  readUsers,
};
```

### 8.5 虚拟删除实现

```javascript
// 下线操作 - 虚拟删除
const publishHotel = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const { action } = req.body;  // 'publish' 或 'unpublish'

    const hotels = await readHotels();
    const hotelIndex = hotels.findIndex(h => h.id === hotelId);

    if (hotelIndex === -1) {
      return res.status(404).json({
        code: 404,
        message: '酒店不存在',
      });
    }

    // 虚拟删除：仅修改标志位
    if (action === 'unpublish') {
      hotels[hotelIndex].is_offline = true;
    } else if (action === 'publish') {
      hotels[hotelIndex].is_offline = false;
    }

    await writeHotels(hotels);

    res.json({
      code: 200,
      message: '操作成功',
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: error.message,
    });
  }
};
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
   - Postman
   - Insomnia
   - curl 命令

### 10.3 常见问题排查

| 问题 | 可能原因 | 解决方案 |
|------|----------|----------|
| CORS 跨域错误 | 前后端地址不同 | 后端添加 CORS 中间件 |
| Token 无效 | Token 过期或格式错误 | 检查 localStorage 中的 Token |
| 房型不排序 | 未调用 sort 方法 | 检查详情页排序逻辑 |
| 下线数据恢复失败 | 物理删除了数据 | 使用虚拟删除 (is_offline) |
| 请求超时 | 网络或后端响应慢 | 增加 Axios timeout 配置 |

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

**Q: JSON 文件写入失败？**
```javascript
// 确保使用 fs.promises 异步操作
// 确保有文件写入权限
// 确保目录存在
```

**Q: JWT 验证失败？**
```javascript
// 检查 SECRET 是否一致
// 检查 Token 格式 (Bearer xxx)
// 检查 Token 是否过期
```

---

## 附录

### A. 环境变量模板

```bash
# .env (服务器)
PORT=3000
NODE_ENV=development
JWT_SECRET=your_secret_key_here
CORS_ORIGIN=http://localhost:3001,http://localhost:3002
```

```bash
# .env (移动端)
REACT_APP_API_BASE_URL=http://localhost:3000/api/v1
```

```bash
# .env (PC 管理端)
REACT_APP_API_BASE_URL=http://localhost:3000/api/v1
```

### B. 项目启动检查清单

开发前确保：
- [ ] Node.js 版本 >= 16
- [ ] 已创建 `.env` 文件并配置正确
- [ ] 后端 `data/` 目录下有初始 JSON 文件
- [ ] 端口 3000、3001、3002 未被占用
- [ ] 已安装项目依赖 `npm install`

### C. 相关文档链接

- [产品需求规格说明](docs/product/requirements_specification.md)
- [技术实现方案](docs/technical/technical_specification.md)
- [API 接口规范](docs/technical/api_spec.md)
- [数据结构定义](docs/technical/data_schema.md)
- [团队分工协作](docs/teamwork/teamwork_distribution.md)
- [开发文档说明](docs/README_DEV.md)

---

**更新日期**: 2026-02-13
**版本**: v1.0
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
