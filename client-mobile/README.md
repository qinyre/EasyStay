# EasyStay - Client Mobile 📱

EasyStay 酒店预订平台的**移动端**用户界面。该项目基于 **React** 和 **Ant Design Mobile** 构建，旨在为终端用户提供流畅的酒店查询、筛选和预订体验。

## ✨ 特性

- **现代化 UI**：使用 Ant Design Mobile v5 组件库，遵循移动端设计规范。
- **流畅交互**：
  - 首页沉浸式轮播图 (`Swiper`)
  - 列表页无限滚动加载 (`InfiniteScroll`)
  - 下拉刷新 (`PullToRefresh`)
  - 图片懒加载与骨架屏
- **功能完备**：
  - 📍 城市与关键字搜索
  - 📅 日期选择 (`DatePicker`)
  - 🏨 多维度筛选（价格、评分、标签）
  - 🛏️ 房型展示与预订流程
  - 🌐 **国际化支持**：中/英文一键切换 (`i18next`)
- **工程化**：
  - 使用 **Vite** 极速构建
  - **TypeScript** 类型安全
  - **Tailwind CSS** 原子化样式

## 🛠️ 技术栈

- **Core**: [React 18](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **UI Framework**: [Ant Design Mobile](https://mobile.ant.design/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **Utilities**: `date-fns` (日期处理), `axios` (HTTP 请求), `clsx` (类名合并)
- **Internationalization**: `i18next`, `react-i18next`
- **Icons**: `lucide-react`

## 📂 目录结构

```text
src/
├── components/       # 通用 UI 组件 (HotelCard, RoomCard)
├── layouts/          # 布局组件 (Layout, TabBar)
├── pages/            # 页面组件
│   ├── Home.tsx        # 首页 (搜索、Banner、热门推荐)
│   ├── HotelList.tsx   # 列表页 (筛选、排序、无限加载)
│   └── HotelDetail.tsx # 详情页 (相册、设施、房型预订)
├── services/         # API 服务
│   ├── api.ts          # 接口请求逻辑
│   └── mockData.ts     # 模拟数据 (本地开发用)
├── types/            # TypeScript 类型定义
└── utils/            # 工具函数
```

## 🚀 快速开始

### 前置要求

- Node.js (v16+)
- npm 或 yarn

### 1. 安装依赖

在 `client-mobile` 目录下运行：

```bash
npm install
# 或者
yarn install
```

### 2. 启动开发服务器

```bash
npm run dev
```

启动后访问 `http://localhost:5173`。建议在浏览器开发者工具中开启 **移动端模拟模式** 以获得最佳预览效果。

### 3. 构建生产版本

```bash
npm run build
```

## 🔌 API 对接说明

目前项目使用 `src/services/mockData.ts` 中的本地 Mock 数据。

若要对接真实后端：
1. 修改 `src/services/api.ts`。
2. 将 `MOCK_HOTELS` 的引用替换为真实的 `axios.get('/api/hotels')` 请求。
3. 配置 `vite.config.ts` 中的 `server.proxy` 以解决跨域问题。

## 📝 待办事项 (TODO)

- [ ] 集成真实后端 API
- [ ] 用户登录/注册页面
- [ ] "我的订单" 页面实现
- [ ] 个人中心页完善
