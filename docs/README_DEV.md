# EasyStay 开发文档

> 本文档面向开发者，提供项目开发环境配置、开发规范和快速上手指南。

---

## 目录

- [快速开始](#快速开始)
- [开发环境配置](#开发环境配置)
- [技术栈](#技术栈)
- [开发规范](#开发规范)
- [常用命令](#常用命令)
- [相关文档](#相关文档)

---

## 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd EasyStay
```

### 2. 安装依赖

```bash
# 后端服务
cd server
npm install

# 移动端
cd ../client-mobile
npm install

# PC 管理端
cd ../client-pc
npm install
```

### 3. 启动服务

```bash
# 后端服务 (端口 3000)
cd server
npm start

# 移动端 (端口 3001)
cd client-mobile
npm start

# PC 管理端 (端口 3002)
cd client-pc
npm start
```

### 4. 访问应用

| 服务 | 地址 | 说明 |
|------|------|------|
| 移动端 | http://localhost:3001 | 用户浏览酒店 |
| PC 管理端 | http://localhost:3002 | 商户/管理员操作 |
| 后端 API | http://localhost:3000/api/v1 | 接口服务 |

---

## 开发环境配置

### 必需软件

| 软件 | 版本要求 | 说明 |
|------|----------|------|
| Node.js | >= 16.x | JavaScript 运行环境 |
| npm | >= 8.x | 包管理器 |

### 推荐工具

- **IDE**: VS Code
- **API 测试**: Postman / Insomnia
- **版本控制**: Git

### VS Code 推荐插件

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "dsznajder.es7-react-js-snippets"
  ]
}
```

### 环境变量配置

**后端 (server/.env)**:
```bash
PORT=3000
NODE_ENV=development
JWT_SECRET=your_secret_key_here
```

**移动端 (client-mobile/.env)**:
```bash
REACT_APP_API_BASE_URL=http://localhost:3000/api/v1
```

**PC 管理端 (client-pc/.env)**:
```bash
REACT_APP_API_BASE_URL=http://localhost:3000/api/v1
```

---

## 技术栈

### 前端

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18+ | 前端框架 |
| Ant Design Mobile | 5.x | 移动端 UI 组件库 |
| Ant Design | 5.x | PC 端 UI 组件库 |
| Axios | 1.6+ | HTTP 客户端 |
| React Router | 6.x | 路由管理 |

### 后端

| 技术 | 版本 | 用途 |
| ------ | ------ | ------ |
| Node.js | 16+ | 运行环境 |
| Express.js | 4.x | Web 框架 |
| jsonwebtoken | - | JWT 认证 |
| fs (内置) | - | JSON 文件存储 |

---

## 开发规范

### 代码风格

- 使用 **ESLint** 进行代码检查
- 使用 **Prettier** 进行代码格式化
- 遵循 **Airbnb JavaScript 风格指南**

### Git 提交规范

```
<type>(<scope>): <subject>

类型:
- feat: 新功能
- fix: Bug 修复
- docs: 文档更新
- style: 代码格式调整
- refactor: 重构
- perf: 性能优化
- test: 测试相关
- chore: 构建/工具相关
```

### 接口开发规范

1. **接口先行**: 前后端接口先定义，后实现
2. **统一响应格式**:
   ```json
   { "code": 200, "data": {}, "message": "success" }
   ```
3. **错误处理**: 统一使用 try-catch 捕获

---

## 常用命令

### 后端

```bash
# 启动服务
npm start

# 开发模式 (nodemon)
npm run dev

# 代码检查
npm run lint

# 运行测试
npm test
```

### 前端 (移动端 / PC 端)

```bash
# 启动开发服务器
npm start

# 构建生产版本
npm run build

# 代码检查
npm run lint

# 代码格式化
npm run format
```

---

## 相关文档

| 文档 | 说明 |
|------|------|
| [Agent.md](../Agent.md) | AI 辅助开发指南 |
| [产品需求规格说明](product/requirements_specification.md) | 功能需求 |
| [技术实现方案](technical/technical_specification.md) | 技术架构 |
| [API 接口规范](technical/api_spec.md) | 接口定义 |
| [数据结构定义](technical/data_schema.md) | 数据模型 |
| [团队分工协作](teamwork/teamwork_distribution.md) | 开发分工 |

---

## 常见问题

### Q: npm install 速度慢？

```bash
# 使用国内镜像
npm config set registry https://registry.npmmirror.com
```

### Q: 端口被占用？

```bash
# Windows 查找占用端口的进程
netstat -ano | findstr :3000
# 杀掉进程
taskkill /PID <进程ID> /F
```

### Q: 前端请求后端报 CORS 错误？
确保后端已启动，并检查 CORS 中间件配置。

---

## 开发进度

| 模块 | 状态 | 说明 |
|------|------|------|
| 后端服务 | ⏳ 待开发 | Node.js + Express + JSON 存储 |
| 移动端 | ⏳ 待开发 | React + Ant Design Mobile |
| PC 管理端 | ⏳ 待开发 | React + Ant Design |

---

**更新时间**: 2026-02-13
