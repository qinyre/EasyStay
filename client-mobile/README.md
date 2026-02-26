# EasyStay - Client Mobile 📱

EasyStay 酒店预订平台的**移动端**用户界面。基于 React 18 + TypeScript + Vite 构建，使用 Ant Design Mobile 组件库，为用户提供流畅的酒店查询、筛选和预订体验。

---

## 目录

- [功能特性](#功能特性)
- [技术栈](#技术栈)
- [环境要求](#环境要求)
- [快速开始](#快速开始)
- [环境配置](#环境配置)
- [项目结构](#项目结构)
- [开发指南](#开发指南)
- [测试指南](#测试指南)
- [API 对接](#api-对接)
- [构建部署](#构建部署)
- [常见问题](#常见问题)

---

## 功能特性

### 核心功能
| 功能模块 | 说明 | 状态 |
|---------|------|------|
| 首页 | 沉浸式轮播图、快捷搜索、热门推荐 | ✅ 已实现 |
| 酒店列表 | 无限滚动、下拉刷新、多维度筛选 | ✅ 已实现 |
| 酒店详情 | 相册展示、设施信息、房型预订 | ✅ 已实现 |
| 预订流程 | 入住信息填写、订单确认、支付模拟 | ✅ 已实现 |
| 我的订单 | 订单列表、订单详情、状态管理 | ✅ 已实现 |
| 个人中心 | 用户信息、设置、帮助中心 | ✅ 已实现 |
| 用户认证 | 登录、注册、邮箱验证码找回密码 | ✅ 已实现 |
| 法律页面 | 服务条款、隐私政策 | ✅ 已实现 |
| 国际化 | 中/英文一键切换 | ✅ 已实现 |

### 交互特性
- 流畅的下拉刷新与无限滚动
- 图片懒加载与骨架屏占位
- 日期选择器（支持入住/退房日期选择）
- 城市与关键字智能搜索
- 价格、评分、星级等多维度筛选
- 响应式移动端适配

---

## 技术栈

```
Frontend Framework
├── React 18.3.1          # UI 框架
├── TypeScript 5.8.3      # 类型安全
└── Vite 6.3.5            # 构建工具

UI & Styling
├── Ant Design Mobile 5.42.3  # 移动端组件库
├── Tailwind CSS 3.4.17       # 原子化样式
└── lucide-react 0.511.0      # 图标库

Routing & State
├── React Router DOM 7.3.0    # 路由管理
└── Zustand 5.0.3             # 状态管理

HTTP & Utilities
├── Axios 1.13.5              # HTTP 请求
├── date-fns 4.1.0            # 日期处理
├── clsx 2.1.1                # 类名合并
└── tailwind-merge 3.0.2      # Tailwind 类名合并

Internationalization
├── i18next 25.8.6            # 国际化核心
└── react-i18next 16.5.4      # React 集成

Testing
├── Vitest 3.0.9              # 测试运行器
├── @testing-library/react    # React 组件测试
├── @testing-library/jest-dom # Jest DOM 匹配器
└── jsdom 26.0.0              # DOM 环境模拟
```

---

## 环境要求

| 依赖 | 最低版本 | 推荐版本 |
|------|---------|---------|
| Node.js | 16.x | 20.x LTS |
| npm | 7.x | 10.x |
| 浏览器 | Chrome 90+, Safari 14+ | 最新版本 |

---

## 快速开始

### 1. 安装依赖

```bash
cd client-mobile
npm install
```

> 国内用户建议使用淘宝镜像加速：
> ```bash
> npm config set registry https://registry.npmmirror.com
> ```

### 2. 配置环境变量

创建 `.env` 文件（可选）：

```bash
# API 基础地址
VITE_API_BASE_URL=http://localhost:3000/api/v1

# 是否使用真实 API（true/false，默认为 true）
VITE_USE_REAL_API=true
```

### 3. 启动后端服务

移动端依赖后端 API 服务，请先确保后端服务已启动：

```bash
# 在另一个终端窗口
cd ../server
npm install
npm start
```

后端服务默认运行在 `http://localhost:3000`

### 4. 启动开发服务器

```bash
npm run dev
```

启动成功后访问：**http://localhost:3001**

### 5. 移动端预览

推荐使用以下方式预览：

- **Chrome DevTools**：按 `F12` → 点击设备图标 → 选择移动设备
- **局域网访问**：使用 `http://你的IP:3001` 在手机浏览器访问
- **真机调试**：使用微信开发者工具或 Chrome 远程调试

---

## 环境配置

### 环境变量说明

| 变量名 | 默认值 | 说明 |
|-------|--------|------|
| `VITE_API_BASE_URL` | `http://localhost:3000/api/v1` | 后端 API 地址 |
| `VITE_USE_REAL_API` | `true` | 是否使用真实 API（设置 `false` 使用本地 Mock 数据） |

### 开发模式 vs 生产模式

| 模式 | VITE_USE_REAL_API | 数据来源 |
|------|-------------------|---------|
| 真实模式(默认) | 未配置 或 `true` | 后端 API 服务 |
| 开发模式(Mock) | `false` | 本地 Mock 数据 + localStorage |

---

## 项目结构

```
client-mobile/
├── public/              # 静态资源
├── src/
│   ├── components/      # 通用组件
│   │   ├── DateRangePicker.tsx   # 日期范围选择器
│   │   ├── HotelCard.tsx         # 酒店卡片
│   │   ├── ImageSkeleton.tsx     # 图片骨架屏
│   │   └── RatingStars.tsx       # 评分星星
│   ├── contexts/        # React Context
│   │   ├── AuthContext.tsx       # 用户认证上下文
│   │   └── SearchContext.tsx     # 搜索上下文
│   ├── i18n/            # 国际化配置
│   │   └── config.ts             # 语言配置
│   ├── layouts/         # 布局组件
│   │   ├── Layout.tsx            # 主布局
│   │   └── TabBar.tsx            # 底部导航栏
│   ├── pages/           # 页面组件
│   │   ├── Home.tsx              # 首页
│   │   ├── HotelList.tsx         # 酒店列表
│   │   ├── HotelDetail.tsx       # 酒店详情
│   │   ├── BookingConfirm.tsx    # 预订确认
│   │   ├── BookingSuccess.tsx    # 预订成功
│   │   ├── Bookings.tsx          # 我的订单
│   │   ├── BookingDetail.tsx     # 订单详情
│   │   ├── Me.tsx                # 个人中心
│   │   ├── Login.tsx             # 登录
│   │   ├── Register.tsx          # 注册
│   │   ├── ForgotPassword.tsx    # 忘记密码
│   │   └── legal/                # 法律页面
│   ├── services/         # API 服务
│   │   ├── api.ts                # 通用 API 封装
│   │   ├── auth.ts               # 认证相关 API
│   │   ├── hotel.ts              # 酒店相关 API
│   │   └── booking.ts            # 预订相关 API
│   ├── store/           # Zustand 状态管理
│   │   └── useBookingStore.ts    # 预订状态
│   ├── test/            # 测试工具
│   │   ├── setup.ts              # 测试环境设置
│   │   └── test-utils.tsx        # 测试辅助函数
│   ├── types/           # TypeScript 类型
│   │   └── index.ts              # 类型定义
│   ├── utils/           # 工具函数
│   │   ├── date.ts               # 日期处理
│   │   └── cn.ts                 # 类名合并
│   ├── App.tsx          # 应用根组件
│   └── main.tsx         # 应用入口
├── index.html           # HTML 模板
├── package.json         # 项目配置
├── tsconfig.json        # TypeScript 配置
├── tailwind.config.js   # Tailwind 配置
├── vite.config.ts       # Vite 配置
├── vitest.config.ts     # Vitest 测试配置
└── README.md            # 项目文档
```

---

## 开发指南

### 可用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器（端口 3001） |
| `npm run build` | 构建生产版本 |
| `npm run preview` | 预览生产构建 |
| `npm run lint` | 代码检查 |
| `npm run check` | TypeScript 类型检查 |
| `npm test` | 运行测试（监听模式） |
| `npm run test:run` | 运行测试（单次） |
| `npm run test:ui` | 测试 UI 界面 |
| `npm run test:coverage` | 生成覆盖率报告 |

### 代码规范

#### 命名约定

| 类型 | 约定 | 示例 |
|------|------|------|
| 组件 | PascalCase | `HotelCard.tsx` |
| 组件名称 | PascalCase | `HotelCard` |
| Hook | camelCase，use 前缀 | `useBookingStore` |
| 工具函数 | camelCase | `formatPrice()` |
| 常量 | UPPER_SNAKE_CASE | `API_BASE_URL` |
| 类型/接口 | PascalCase | `Booking` |

#### Git 提交规范

```
<type>(<scope>): <subject>

类型: feat | fix | docs | style | refactor | perf | test | chore

示例:
feat(mobile): 添加酒店列表无限滚动功能
fix(auth): 修复登录状态持久化问题
docs: 更新 README 文档
```

### 添加新页面

1. 在 `src/pages/` 创建页面组件
2. 在 `src/App.tsx` 添加路由
3. 如需底部导航，在 `src/layouts/TabBar.tsx` 添加标签

```tsx
// src/pages/NewPage.tsx
import React from 'react';
import { NavBar } from 'antd-mobile';

const NewPage: React.FC = () => {
  return (
    <div>
      <NavBar>新页面</NavBar>
      {/* 页面内容 */}
    </div>
  );
};

export default NewPage;
```

### 国际化 (i18n)

添加新的翻译文本：

```typescript
// src/i18n/config.ts
const resources = {
  zh: {
    translation: {
      // 添加新的中文翻译
      'new.key': '新的翻译',
    }
  },
  en: {
    translation: {
      // 添加新的英文翻译
      'new.key': 'New Translation',
    }
  }
};
```

在组件中使用：

```tsx
import { useTranslation } from 'react-i18next';

const Component = () => {
  const { t } = useTranslation();
  return <div>{t('new.key')}</div>;
};
```

---

## 测试指南

### 测试框架

项目使用 **Vitest** + **Testing Library** 进行单元测试和组件测试。

### 测试命令

| 命令 | 说明 |
|------|------|
| `npm test` | 运行测试（监听模式，自动重跑） |
| `npm run test:run` | 运行测试（单次执行） |
| `npm run test:ui` | 打开测试 UI 界面 |
| `npm run test:coverage` | 生成代码覆盖率报告 |

### 测试文件结构

```
src/
├── test/
│   ├── setup.ts              # 测试环境设置
│   └── test-utils.tsx        # 测试辅助函数和 Mock 数据
├── utils/
│   └── format.test.ts        # 工具函数测试
├── components/
│   └── HotelCard.test.tsx    # 组件测试
├── contexts/
│   └── SearchContext.test.tsx # Context 测试
└── pages/
    └── Home.test.tsx         # 页面测试
```

### 编写测试

#### 1. 测试工具函数

```typescript
// src/utils/format.test.ts
import { describe, it, expect } from 'vitest'
import { formatCurrency } from './format'

describe('formatCurrency', () => {
  it('应该正确格式化金额', () => {
    expect(formatCurrency(299)).toBe('¥299')
    expect(formatCurrency(1000)).toBe('¥1,000')
  })
})
```

#### 2. 测试组件

```typescript
// src/components/HotelCard.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../test/test-utils'
import { HotelCard } from './HotelCard'

describe('HotelCard', () => {
  it('应该渲染酒店信息', () => {
    const mockHotel = { /* ... */ }
    const handleClick = vi.fn()
    render(<HotelCard hotel={mockHotel} onClick={handleClick} />)
    expect(screen.getByText('测试酒店')).toBeInTheDocument()
  })
})
```

#### 3. 测试 Context

```typescript
// src/contexts/SearchContext.test.tsx
import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { SearchProvider, useSearch } from './SearchContext'

describe('SearchContext', () => {
  it('应该能够设置城市', () => {
    const { result } = renderHook(() => useSearch(), { wrapper: SearchProvider })
    act(() => {
      result.current.setCity('北京')
    })
    expect(result.current.city).toBe('北京')
  })
})
```

### 测试最佳实践

1. **测试命名**: 使用 `应该...` 格式描述测试意图
2. **隔离测试**: 每个测试应该独立运行，不依赖其他测试
3. **Mock 外部依赖**: 使用 `vi.mock()` 模拟 API 调用
4. **使用数据测试属性**: 优先使用 `data-testid` 而不是 CSS 类名选择元素

### 代码覆盖率

当前测试覆盖率：

| 类型 | 覆盖率 |
| :--- | :--- |
| 工具函数 | ✅ 100% |
| 组件 | ✅ 80%+ |
| Context | ✅ 90%+ |
| 页面 | ✅ 70%+ |

---

## API 对接

### API 服务封装

所有 API 请求统一封装在 `src/services/` 目录：

| 文件 | 负责接口 |
|------|---------|
| `auth.ts` | 登录、注册、找回密码 |
| `hotel.ts` | 酒店列表、详情、搜索 |
| `booking.ts` | 创建订单、查询订单 |

### Mock 模式 vs 真实 API

项目支持两种模式：

```typescript
// src/services/auth.ts
// 默认使用真实API，除非显式指定为 'false'
const USE_REAL_API = import.meta.env.VITE_USE_REAL_API !== 'false';

export const login = async (params: LoginRequest) => {
  if (USE_REAL_API) {
    // 真实 API 请求
    return await authClient.post('/auth/login', params);
  }
  // Mock 数据返回
  return mockLoginResponse;
};
```

### 主要 API 端点

```
# 认证相关
POST /api/v1/auth/login              # 用户登录
POST /api/v1/auth/register           # 用户注册
POST /api/v1/auth/send-reset-code    # 发送验证码
POST /api/v1/auth/reset-password-with-code  # 重置密码

# 酒店相关
GET  /api/v1/mobile/home/banners     # 首页 Banner
GET  /api/v1/mobile/hotels           # 酒店列表
GET  /api/v1/mobile/hotels/:id       # 酒店详情

# 预订相关
POST /api/v1/mobile/bookings         # 创建订单
GET  /api/v1/mobile/bookings         # 订单列表
GET  /api/v1/mobile/bookings/:id     # 订单详情
```

---

## 构建部署

### 构建生产版本

```bash
npm run build
```

构建产物输出到 `dist/` 目录。

### 本地预览构建结果

```bash
npm run preview
```

### 部署到服务器

1. **构建项目**
   ```bash
   npm run build
   ```

2. **上传 dist 目录到服务器**

3. **配置 Nginx**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/easystay-mobile/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       location /api {
           proxy_pass http://localhost:3000;
       }
   }
   ```

4. **使用 PM2 部署（可选）**
   ```bash
   npm install -g serve
   serve -s dist -l 3001
   ```

---

## 常见问题

### Q1: npm install 速度慢？

```bash
# 使用淘宝镜像
npm config set registry https://registry.npmmirror.com
```

### Q2: 端口 3001 被占用？

```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <进程ID> /F

# 或修改 vite.config.ts 中的端口
server: {
  port: 3002,  // 改为其他端口
}
```

### Q3: 启动后页面空白？

1. 检查后端服务是否启动（端口 3000）
2. 打开浏览器控制台查看错误信息
3. 检查环境变量 `VITE_API_BASE_URL` 配置

### Q4: API 请求失败（CORS 错误）？

确保后端已配置 CORS 中间件，或在 `vite.config.ts` 添加代理：

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    }
  }
}
```

### Q5: 验证码功能如何使用？

1. **开发模式（Mock）**：验证码显示在页面黄色提示框中
2. **生产模式**：需配置后端邮件服务（参考 `../server/EMAIL_SETUP.md`）

### Q6: 如何切换语言？

点击个人中心 → 设置 → 语言，或使用 `i18next.changeLanguage()`：

```typescript
import i18next from 'i18next';
i18next.changeLanguage('en'); // 切换到英文
```

### Q7: TypeScript 类型错误？

```bash
# 清除缓存重新构建
rm -rf node_modules/.vite
npm run dev
```

---

## 相关文档

| 文档 | 路径 |
|------|------|
| 后端文档 | `../server/README.md` |
| 邮件配置 | `../server/EMAIL_SETUP.md` |
| API 规范 | `../docs/technical/api_spec.md` |
| 项目总览 | `../README.md` |

---

## 许可证

MIT License

---

## 联系方式

如有问题或建议，请通过以下方式联系：

- 项目 Issues: [GitHub Issues](https://github.com/qinyre/EasyStay/issues)
- 邮箱: support@easystay.com
