# EasyStay 酒店管理系统 - 前端 PC 端

## 项目介绍

EasyStay 是一个现代化的酒店管理系统，本仓库为 PC 端管理界面，主要面向酒店商户和系统管理员，提供酒店信息管理、审核管理、上下线管理等功能。

## 技术栈

- **前端框架**: React 19.2.0 + TypeScript 5.9.3
- **UI 组件库**: Ant Design 6.3.0
- **样式方案**: Tailwind CSS 3.4.17
- **路由管理**: React Router 7.13.0
- **状态管理**: Zustand 5.0.11
- **构建工具**: Vite 7.3.1
- **包管理器**: npm

## 快速开始

### 环境要求

- Node.js 18.0.0 或更高版本
- npm 9.0.0 或更高版本

### 安装依赖

```bash
# 进入项目目录
cd client-pc

# 安装依赖
npm install
```

### 启动开发服务器

```bash
# 启动开发服务器
npm run dev
```

## 项目结构

```
client-pc/
├── public/              # 静态资源
├── src/
│   ├── assets/         # 项目资源文件
│   ├── images/         # 图片资源
│   ├── layouts/        # 布局组件
│   ├── mock/           # 模拟数据
│   ├── pages/          # 页面组件
│   │   ├── Admin/      # 管理员页面
│   │   ├── Auth/       # 登录注册页面
│   │   └── Merchant/   # 商户页面
│   ├── services/       # API 服务
│   ├── test-data/      # 测试数据
│   ├── App.tsx         # 应用入口组件
│   ├── main.tsx        # 应用启动文件
│   └── index.css       # 全局样式
├── tailwind.config.js  # Tailwind 配置
├── tsconfig.json       # TypeScript 配置
├── vite.config.ts      # Vite 配置
└── package.json        # 项目依赖
```

## 核心功能

### 1. 认证系统

- **登录/注册**：支持商户和管理员账号登录注册
- **权限管理**：基于角色的访问控制，商户只能管理自己的酒店，管理员可以管理所有酒店

### 2. 商户功能

- **酒店管理**：添加、编辑、查看、删除酒店信息
- **房型管理**：为酒店添加多个房型，设置价格和库存
- **图片上传**：支持酒店图片上传功能
- **状态查看**：实时查看酒店的审核状态和上下线状态

### 3. 管理员功能

- **审核管理**：审核商户提交的酒店信息，支持通过或拒绝
- **上下线管理**：管理酒店的上线和下线状态
- **酒店详情**：查看所有酒店的详细信息

### 4. 特色功能

- **响应式设计**：适配不同屏幕尺寸的设备
- **优雅的 UI**：采用 Ant Design 和 Tailwind CSS 构建现代化界面
- **背景图片**：登录注册页面使用酒店主题背景图片
- **表单验证**：完善的表单验证和错误提示
- **数据可视化**：直观的状态显示和操作反馈
- **错误处理**：优雅的错误处理和边界情况处理

## 开发指南

### 代码规范

- 使用 TypeScript 类型定义
- 组件命名使用 PascalCase
- 变量和函数命名使用 camelCase
- 常量使用 UPPER_SNAKE_CASE
- 缩进使用 2 个空格
- 每行代码长度不超过 100 个字符

### 组件开发

1. **功能组件**：放在 `src/components` 目录
2. **页面组件**：放在 `src/pages` 对应角色目录下
3. **布局组件**：放在 `src/layouts` 目录
4. **服务层**：放在 `src/services` 目录，处理 API 调用

### API 服务

本项目提供了两种数据源模式：

1. **本地存储模式**：使用 localStorage 模拟数据存储，适合开发和测试
2. **后端 API 模式**：调用真实的后端 API，适合生产环境

可在 `src/services/config.ts` 中切换数据源模式：

```typescript
export const DATA_SOURCE: string = "local"; // 本地存储模式
// export const DATA_SOURCE: string = "backend"; // 后端 API 模式
```

## 后端集成

本项目默认配置为使用本地存储模拟数据，如需集成后端服务，请：

1. 修改 `src/services/config.ts` 中的 API_BASE_URL：

   ```typescript
   export const API_BASE_URL = "http://localhost:3000/api/v1";
   ```

2. 切换到后端 API 模式：

   ```typescript
   export const DATA_SOURCE: string = "backend";
   ```

3. 确保后端服务提供以下 API 端点：
   - POST `/auth/login` - 用户登录
   - POST `/auth/register` - 用户注册
   - GET `/merchant/hotels` - 商户获取酒店列表
   - POST `/merchant/hotels` - 商户添加酒店
   - PUT `/merchant/hotels/:id` - 商户编辑酒店
   - DELETE `/merchant/hotels/:id` - 商户删除酒店
   - POST `/merchant/upload` - 商户上传图片
   - GET `/admin/hotels` - 管理员获取所有酒店
   - PATCH `/admin/audit/:hotelId` - 管理员审核酒店
   - PATCH `/admin/publish/:hotelId` - 管理员上下线酒店

**感谢使用 EasyStay 酒店管理系统！** 🎉# React + TypeScript + Vite
