<div align="center">

# EasyStay 易宿酒店预订平台

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-Web-lightgrey.svg)
![Framework](https://img.shields.io/badge/frontend-React-61DAFB.svg)
![Backend](https://img.shields.io/badge/backend-Node.js-339933.svg)

[English](./README_EN.md) | **简体中文**

</div>

---

## 项目简介

EasyStay 是一个功能完善的酒店预订管理系统，采用前后端分离架构设计。系统为不同角色用户提供专属界面：

- **移动端用户**：浏览酒店信息、查看房型价格、完成预订
- **商户**：录入酒店信息、管理房型、更新价格库存
- **管理员**：审核酒店信息、控制发布状态、平台管理

系统实现了完整的信息审核工作流——商户提交的酒店信息需经过管理员审核通过后方可发布上线，同时支持虚拟删除（下线）功能，确保数据安全可恢复。

---

## 功能特性

### 用户端（移动端）

- 首页 Banner 展示与跳转
- 酒店列表查询（支持定位、关键词搜索、日期筛选、星级过滤、价格区间）
- 酒店详情展示（房型价格自动升序排列）
- 长列表优化渲染（虚拟列表、下拉刷新、无限滚动）
- 用户认证（登录、注册、验证码找回密码）
- 订单管理（创建订单、订单列表、订单详情、取消订单）
- 订单倒计时（15分钟支付时限）
- 个人中心（设置、语言切换、关于我们）
- 国际化支持（中文/英文）

### 管理端（PC端）

- **商户功能**
  - 酒店信息录入与编辑
  - 房型与价格管理
  - 实时数据更新
- **管理员功能**
  - 酒店信息审核（通过/不通过/待审核）
  - 发布管理（上线/下线）
  - 虚拟删除与数据恢复

### 技术亮点

- **前后端分离架构**，RESTful API 设计
- **SQLite 轻量级本地数据库**，无需安装外部数据库服务，开箱即用
- **权限分级与角色管理**，确保系统安全
- **虚拟删除机制**，保障数据可恢复
- **房型智能排序**（价格升序），提升用户体验
- **内存缓存机制**，热点数据加速访问

---

## 快速开始

### 环境要求

- Node.js >= 16.x
- npm >= 8.x 或 yarn >= 1.22.x

### 安装步骤

1. **克隆项目**

   ```bash
   git clone https://github.com/your-username/EasyStay.git
   cd EasyStay
   ```

2. **安装依赖**

   服务端：

   ```bash
   cd server
   npm install
   ```

   移动端：

   ```bash
   cd client-mobile
   npm install
   ```

   PC管理端：

   ```bash
   cd client-pc
   npm install
   ```

3. **启动服务**

   启动后端服务（默认端口 3000）：

   ```bash
   cd server
   npm start
   ```

   启动移动端（默认端口 3001）：

   ```bash
   cd client-mobile
   npm run dev
   ```

   启动PC管理端（默认端口 3002）：

   ```bash
   cd client-pc
   npm run dev
   ```

4. **访问应用**

   - 移动端：http://localhost:3001
   - PC管理端：http://localhost:3002
   - API文档：http://localhost:3000/api/v1/docs

---

## 项目结构

```
EasyStay/
├── client-mobile/          # 移动端前端应用（React + TypeScript + Vite）
├── client-pc/              # PC管理端前端应用（React）
├── server/                 # 后端服务（Node.js + SQLite）
│   ├── config/             # 配置文件
│   │   ├── database.js     # SQLite 数据库连接与建表
│   │   └── cache.js        # 内存缓存
│   ├── controllers/        # 控制器（业务逻辑）
│   ├── data/               # SQLite 数据库文件（自动生成）
│   │   └── easystay.db     # SQLite 数据库
│   ├── routes/             # API 路由处理
│   ├── uploads/            # 上传的图片文件
│   └── middlewares/        # 中间件（认证、上传、验证）
├── common/                 # 共享工具与类型定义
├── docs/                   # 项目文档
│   ├── product/            # 产品需求文档
│   ├── technical/          # 技术规范文档
│   └── teamwork/           # 团队协作文档
├── .gitignore
├── README.md               # 中文说明文档
└── README_EN.md            # 英文说明文档
```

---

## 技术栈

### 前端

- **框架**：React 18 + TypeScript
- **构建工具**：Vite 6
- **状态管理**：React Context API (SearchContext, AuthContext)
- **路由**：React Router DOM 7
- **HTTP客户端**：Axios
- **UI组件库**：Ant Design Mobile 5（移动端）/ Ant Design（PC端）
- **样式**：Tailwind CSS 3
- **国际化**：i18next
- **日期处理**：date-fns
- **测试**：Vitest + Testing Library

### 后端

- **运行环境**：Node.js
- **Web框架**：Express.js
- **数据存储**：SQLite（better-sqlite3）
- **缓存**：内存级 Map 缓存（替代 Redis）
- **认证**：JWT Token
- **密码加密**：bcryptjs

### 开发工具

- **版本控制**：Git
- **代码规范**：ESLint
- **代码格式化**：Prettier

### AI 辅助开发（Vibe Coding）

本项目采用 Vibe Coding 模式进行开发，使用以下 AI 开发工具：

| 开发工具 | 说明 |
|---------|------|
| **Trae CN** | 字节跳动推出的AI编程助手 |
| **Trae** | 国际版 Trae AI 编程工具 |
| **Antigravity** | AI 辅助开发工具 |
| **Claude Code** | Anthropic 官方 CLI 编程助手 |

**使用的 AI 模型**：
- GLM-5
- Doubao-Seed-Code（豆包）
- Gemini-3.1 Pro
- Claude Opus 4.6
- Claude Sonnet 4.6

---

## API 接口

系统采用 RESTful API 设计，基础路径为 `/api/v1`

### 认证接口

- `POST /auth/register` - 用户注册
- `POST /auth/login` - 用户登录

### 移动端接口

- `GET /mobile/home/banners` - 获取首页Banner
- `GET /mobile/home/popular-cities` - 获取热门城市
- `GET /mobile/hotels` - 酒店列表查询（支持多维度筛选）
- `GET /mobile/hotels/:id` - 酒店详情获取
- `POST /mobile/bookings` - 创建订单
- `GET /mobile/bookings` - 获取订单列表
- `GET /mobile/bookings/:id` - 获取订单详情
- `PATCH /mobile/bookings/:id/cancel` - 取消订单

### 管理端接口

- `POST /merchant/hotels` - 录入酒店信息
- `PUT /merchant/hotels/:id` - 编辑酒店信息
- `PATCH /admin/audit/:hotelId` - 审核酒店信息
- `PATCH /admin/publish/:hotelId` - 发布/下线酒店

> 详细文档请查看 [docs/technical/api_spec.md](docs/technical/api_spec.md)

---

## 数据结构

系统使用 SQLite 数据库（`server/data/easystay.db`），包含以下四张表：

### 酒店表（hotels）

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | TEXT | 酒店唯一标识（UUID） |
| `name_cn` | TEXT | 酒店中文名 |
| `name_en` | TEXT | 酒店英文名 |
| `address` | TEXT | 酒店详细地址 |
| `star_level` | INTEGER | 星级（1-5） |
| `location` | TEXT | 位置信息（JSON：省份、城市、地址、经纬度） |
| `description` | TEXT | 酒店描述 |
| `facilities` | TEXT | 设施列表（JSON 数组） |
| `rating` | REAL | 评分（0-5） |
| `image` | TEXT | 主图 URL |
| `images` | TEXT | 图片列表（JSON 数组） |
| `tags` | TEXT | 标签（JSON 数组） |
| `price_start` | REAL | 起始价格 |
| `open_date` | TEXT | 开业时间 |
| `banner_url` | TEXT | Banner 图片 URL |
| `audit_status` | TEXT | 审核状态（Pending/Approved/Rejected） |
| `is_offline` | INTEGER | 是否下线（0/1） |
| `fail_reason` | TEXT | 审核拒绝原因 |
| `merchant_id` | TEXT | 所属商户 ID |
| `merchant_username` | TEXT | 所属商户用户名 |
| `created_at` | TEXT | 创建时间 |
| `updated_at` | TEXT | 更新时间 |

### 房型表（rooms）

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | TEXT | 房型唯一标识（UUID） |
| `name` | TEXT | 房型名称 |
| `price` | REAL | 房型价格 |
| `capacity` | INTEGER | 容纳人数 |
| `description` | TEXT | 房型描述 |
| `image_url` | TEXT | 房型图片 URL |
| `amenities` | TEXT | 设施列表（JSON 数组） |
| `hotelId` | TEXT | 所属酒店 ID（外键） |

### 用户表（users）

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | TEXT | 用户唯一标识（UUID） |
| `phone` | TEXT | 手机号（移动端登录） |
| `email` | TEXT | 邮箱（用于密码重置） |
| `username` | TEXT | 用户名（PC端登录） |
| `password` | TEXT | 加密后的密码（bcryptjs） |
| `name` | TEXT | 用户昵称 |
| `avatar` | TEXT | 用户头像 URL |
| `role` | TEXT | 角色（user/merchant/admin） |
| `created_at` | TEXT | 注册时间 |

### 订单表（orders）

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | TEXT | 订单唯一标识 |
| `user_id` | TEXT | 下单用户 ID（外键） |
| `hotel_id` | TEXT | 预订酒店 ID（外键） |
| `room_id` | TEXT | 预订房型 ID（外键） |
| `check_in_date` | TEXT | 入住日期（yyyy-MM-dd） |
| `check_out_date` | TEXT | 离店日期（yyyy-MM-dd） |
| `guests` | INTEGER | 入住人数 |
| `total_price` | REAL | 订单总价 |
| `status` | TEXT | 订单状态（pending/confirmed/completed/cancelled） |
| `payment_status` | TEXT | 支付状态（unpaid/paid/refunded） |
| `guestName` | TEXT | 入住人姓名 |
| `guestPhone` | TEXT | 入住人电话 |
| `hotelName` | TEXT | 酒店名称（冗余字段） |
| `hotelImage` | TEXT | 酒店图片（冗余字段） |
| `roomType` | TEXT | 房型名称（冗余字段） |
| `nights` | INTEGER | 间夜数 |
| `created_at` | TEXT | 创建时间 |
| `updated_at` | TEXT | 更新时间 |

> 完整定义请查看 [docs/technical/data_schema.md](docs/technical/data_schema.md)

---

## 文档

| 文档 | 描述 |
| ------ | ------ |
| [产品需求规格说明](docs/product/requirements_specification.md) | 产品功能需求 |
| [技术实现方案](docs/technical/technical_specification.md) | 技术架构设计 |
| [API接口规范](docs/technical/api_spec.md) | 接口定义文档 |
| [数据结构定义](docs/technical/data_schema.md) | 数据模型说明 |
| [团队分工协作](docs/teamwork/teamwork_distribution.md) | 开发分工安排 |

---

## 开发规范

1. **接口先行**：所有接口路径和返回字段必须严格遵守API规范
2. **前端Mock**：后端接口未完成前，前端可使用局部常量数据进行开发
3. **实时更新**：商户保存数据后需实时更新到移动端
4. **虚拟删除**：下线操作采用虚拟删除，确保数据可恢复
5. **价格排序**：详情页房型列表必须按价格从低到高排序

---

## 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

---

<div align="center">
**Built with ❤️ by EasyStay Team**

[English](./README_EN.md) | **简体中文**

</div>