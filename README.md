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
- 酒店列表查询（支持定位、关键词搜索、日期筛选、星级过滤）
- 酒店详情展示（房型价格自动升序排列）
- 长列表优化渲染

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
- 前后端分离架构，RESTful API 设计
- JSON 文件持久化存储
- 权限分级与角色管理
- 虚拟删除机制保障数据安全
- 房型智能排序（价格升序）

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
   npm start
   ```

   启动PC管理端（默认端口 3002）：
   ```bash
   cd client-pc
   npm start
   ```

4. **访问应用**

   - 移动端：http://localhost:3001
   - PC管理端：http://localhost:3002
   - API文档：http://localhost:3000/api/v1/docs

---

## 项目结构

```
EasyStay/
├── client-mobile/          # 移动端前端应用（React）
├── client-pc/              # PC管理端前端应用（React）
├── server/                 # 后端服务（Node.js）
│   ├── data/               # JSON数据存储
│   │   ├── hotels.json     # 酒店信息数据
│   │   └── users.json      # 用户账户数据
│   └── routes/             # API路由处理
├── common/                 # 共享工具与类型定义
├── docs/                   # 项目文档
│   ├── product/            # 产品需求文档
│   ├── technical/          # 技术规范文档
│   └── teamwork/           # 团队协作文档
├── .gitignore
└── README.md
```

---

## 技术栈

### 前端
- **框架**：React 18
- **状态管理**：React Context / Hooks
- **HTTP客户端**：Axios
- **UI组件库**：Ant Design Mobile（移动端）/ Ant Design（PC端）

### 后端
- **运行环境**：Node.js
- **Web框架**：Express.js
- **数据存储**：JSON文件（fs模块）
- **认证**：JWT Token

### 开发工具
- Git（版本控制）
- ESLint（代码规范）
- Prettier（代码格式化）

---

## API 接口

系统采用 RESTful API 设计，基础路径为 `/api/v1`

### 认证接口
- `POST /auth/register` - 用户注册
- `POST /auth/login` - 用户登录

### 移动端接口
- `GET /mobile/home/banners` - 获取首页Banner
- `GET /mobile/hotels` - 酒店列表查询
- `GET /mobile/hotels/:id` - 酒店详情获取

### 管理端接口
- `POST /merchant/hotels` - 录入酒店信息
- `PUT /merchant/hotels/:id` - 编辑酒店信息
- `PATCH /admin/audit/:hotelId` - 审核酒店信息
- `PATCH /admin/publish/:hotelId` - 发布/下线酒店

> 详细文档请查看 [docs/technical/api_spec.md](docs/technical/api_spec.md)

---

## 数据结构

### 酒店信息（hotels.json）
```json
{
  "id": "string",
  "name_cn": "上海陆家嘴禧酒店",
  "name_en": "Joy Hotel Lujiazui",
  "address": "上海市浦东新区...",
  "star_level": 5,
  "open_date": "2012-01-01",
  "audit_status": "Approved",
  "is_offline": false,
  "banner_url": "https://...",
  "tags": ["亲子", "豪华"],
  "rooms": [
    { "type_name": "经典双床房", "price": 936, "stock": 10 }
  ]
}
```

### 用户账户（users.json）
```json
{
  "username": "merchant001",
  "password": "hashed_password",
  "role": "merchant"
}
```

> 完整定义请查看 [docs/technical/data_schema.md](docs/technical/data_schema.md)

---

## 文档

| 文档 | 描述 |
|------|------|
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
