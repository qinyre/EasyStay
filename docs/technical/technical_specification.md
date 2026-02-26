# 易宿酒店预订平台 - 开发实现方案 (Technical Implementation Spec)

## 1. 系统架构与分层

本项目采用前后端分离架构。

**客户端**：两个独立的 React 应用，通过 Axios 与服务端进行 RESTful 通信。

*   **移动端** ([client-mobile/](../client-mobile/))：React 18 + TypeScript + Vite，服务于终端用户
*   **PC 管理端** ([client-pc/](../client-pc/))：React + Vite，服务于商户和管理员

**服务端** ([server/](../server/))：Node.js 环境，负责业务逻辑中转、权限验证及数据库操作。

**持久层**：基于 SQLite 轻量级本地关系型数据库（`server/data/easystay.db`），通过 `better-sqlite3` 驱动进行同步读写。无需安装独立的数据库服务，数据库文件在首次启动时自动创建。

---

## 2. 项目目录结构 (Directory Structure)

```text
/EasyStay
├── /client-mobile         # 移动端源代码 (React + TypeScript + Vite)
│   ├── /src
│   │   ├── /components    # 业务组件
│   │   ├── /contexts      # Context 状态管理
│   │   ├── /hooks         # 自定义 Hooks
│   │   ├── /i18n          # 国际化配置
│   │   ├── /layouts       # 布局组件
│   │   ├── /pages         # 页面组件
│   │   ├── /services      # API 服务层
│   │   ├── /test          # 测试配置
│   │   ├── /types         # TypeScript 类型
│   │   ├── /utils         # 工具函数
│   │   ├── App.tsx        # 路由配置
│   │   └── main.tsx       # 应用入口
│   ├── /public            # 静态资源
│   ├── CLAUDE.md          # AI 上下文文档
│   ├── README.md          # 项目说明
│   └── API_INTEGRATION.md # API 对接文档
├── /client-pc             # PC 管理端源代码 (React + TypeScript + Vite)
│   ├── /src
│   │   ├── /assets        # 项目资源文件
│   │   ├── /images        # 图片资源
│   │   ├── /constants     # 常量定义 (设施、标签)
│   │   ├── /layouts       # 布局组件 (侧边栏 + Header)
│   │   ├── /mock          # Mock 数据
│   │   ├── /pages         # 页面组件
│   │   │   ├── /Admin      # 管理员页面 (审核、上下线)
│   │   │   ├── /Auth       # 认证页面 (登录、注册)
│   │   │   └── /Merchant   # 商户页面 (酒店列表、表单)
│   │   ├── /services      # API 服务层
│   │   ├── /test-data     # 测试数据管理 (LocalStorage)
│   │   ├── App.tsx        # 路由配置
│   │   └── main.tsx       # 应用入口
│   ├── CLAUDE.md          # AI 上下文文档
│   └── README.md          # 项目说明
├── /server                # Node.js 后端源代码
│   ├── /config            # 数据库连接 (database.js) 与缓存配置 (cache.js)
│   ├── /controllers       # 控制器（业务逻辑层）
│   ├── /data              # SQLite 数据库文件 (easystay.db, 自动生成)
│   ├── /routes            # API 路由处理
│   ├── /uploads           # 上传的图片文件
│   └── /middlewares       # 中间件（认证、上传、验证）
└── /docs                  # 开发文档、接口规范、截图资产
```

---

## 3. 移动端技术实现

### 3.1 技术栈

| 类别 | 技术 | 版本 | 用途 |
| :--- | :--- | :--- | :--- |
| 框架 | React | 18.3.1 | UI 框架 |
| 语言 | TypeScript | 5.8.3 | 类型安全 |
| 构建工具 | Vite | 6.3.5 | 开发服务器与构建 |
| 路由 | React Router DOM | 7.3.0 | 页面路由 |
| UI 组件库 | Ant Design Mobile | 5.42.3 | 移动端组件 |
| 图标库 | @ant-design/icons | 6.1.0 | Ant Design 图标 |
| 图标库 | lucide-react | 0.511.0 | 补充图标 |
| 样式 | Tailwind CSS | 3.4.17 | 原子化 CSS |
| HTTP 客户端 | Axios | 1.13.5 | API 请求 |
| 状态管理 | Context API | - | SearchContext, AuthContext |
| 工具库 | ahooks | 3.9.6 | React Hooks 工具 |
| 国际化 | i18next | 25.8.6 | 多语言支持 |
| 日期处理 | date-fns | 4.1.0 | 日期格式化 |
| 测试 | Vitest | 3.0.9 | 单元测试 |

### 3.2 核心页面路由

#### 公开路由
| 路由 | 组件 | 功能 |
| :--- | :--- | :--- |
| `/` | `Home` | 首页 - Banner、城市选择、日期选择 |
| `/hotels` | `HotelList` | 酒店列表页 - 下拉刷新、无限滚动、筛选 |
| `/hotel/:id` | `HotelDetail` | 酒店详情页 - 房型列表（价格升序） |
| `/login` | `Login` | 登录页 |
| `/register` | `Register` | 注册页 |
| `/forgot-password` | `ForgotPassword` | 忘记密码（验证码重置） |
| `/profile` | `Me` | 个人中心 |
| `/settings` | `Settings` | 设置页（语言切换） |
| `/about` | `About` | 关于我们 |
| `/terms` | `TermsPage` | 用户协议 |
| `/privacy` | `PrivacyPage` | 隐私政策 |

#### 需要认证的路由 (ProtectedRoute)
| 路由 | 组件 | 功能 |
| :--- | :--- | :--- |
| `/hotel/:hotelId/booking/:roomId` | `BookingConfirm` | 预订确认页 |
| `/booking/success` | `BookingSuccess` | 预订成功页 |
| `/bookings` | `Bookings` | 我的订单列表（含倒计时） |
| `/booking/:id` | `BookingDetail` | 订单详情页 |

### 3.3 状态管理架构

#### SearchContext（搜索上下文）
```typescript
{
  city: string;              // 默认: '上海'
  setCity: (city: string) => void;
  dateRange: { start: Date; end: Date };
  setDateRange: (range) => void;
  keyword: string;
  setKeyword: (keyword: string) => void;
  starLevel: number;         // 默认: 0 (全部)
  setStarLevel: (level: number) => void;
  priceRange: { min: number; max: number };
  setPriceRange: (range) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  toggleTag: (tag: string) => void;
  adjustNights: (delta: number) => void;
  resetFilters: () => void;
  toSearchParams: () => URLSearchParams;
}
```

#### AuthContext（认证上下文）
```typescript
{
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (phone: string, password: string) => Promise<void>;
  register: (phone, email, password, name?, role?) => Promise<void>;
  logout: () => Promise<void>;
}
```

### 3.4 排序与过滤算法

**详情页排序**：前端获取房型列表后，必须调用 `.sort((a, b) => a.price - b.price)` 进行升序排列。

**列表页优化**：
*   使用 `ahooks` 的 `useVirtualList` 实现虚拟列表优化
*   使用 Ant Design Mobile 的 `PullToRefresh` 和 `InfiniteScroll` 实现下拉刷新和无限滚动
*   支持多维度筛选：星级、价格区间、特色标签

**图片优化**：
*   使用 `loading="lazy"` 实现懒加载
*   轮播图预加载策略（当前、前一张、后一张）
*   骨架屏占位

### 3.5 API 切换机制

前端支持真实 API 和 Mock 数据自动切换：

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

---

## 4. 核心技术逻辑实现

### 4.1 权限与状态机

**登录逻辑**：后端从 SQLite 的 `users` 表中查询用户，使用 `bcryptjs` 验证密码，根据 `role` 字段签发对应权限的 JWT Token。

**虚拟删除 (下线)**：在 `hotels` 表中设置 `is_offline` 整数字段（0=在线, 1=下线），管理员执行"下线"仅修改此标志位，不物理删除数据。

**订单倒计时**：移动端使用自定义 Hook `useCountdown` 实现 15 分钟支付倒计时，过期后自动取消订单。

---

## 5. 数据库 Schema 设计 (SQLite 表结构)

核心数据表定义如下：

### Hotels 表

| 字段名 | 类型 | 说明 |
| :--- | :--- | :--- |
| `id` | TEXT (PK) | 酒店唯一标识（UUID） |
| `name_cn` | TEXT | 酒店中文名 (必须维度) |
| `name_en` | TEXT | 酒店英文名 (必须维度) |
| `star_level` | INTEGER | 星级 (1-5) |
| `address` | TEXT | 酒店详细地址 |
| `tags` | TEXT | JSON 数组，如 `["亲子","豪华"]` |
| `is_offline` | INTEGER | 是否已下线 (虚拟删除标志, 0/1) |
| `audit_status` | TEXT | 枚举值：`Pending`, `Approved`, `Rejected` |
| `createdAt` | TEXT | 创建时间 (ISO 8601 格式) |

### Rooms 表

| 字段名 | 类型 | 说明 |
| :--- | :--- | :--- |
| `id` | TEXT (PK) | 房型唯一标识 |
| `name` | TEXT | 房型名称 |
| `price` | REAL | 房型价格 |
| `hotelId` | TEXT (FK) | 所属酒店 ID |

### Users 表

| 字段名 | 类型 | 说明 |
| :--- | :--- | :--- |
| `id` | TEXT (PK) | 用户唯一标识 |
| `phone` | TEXT (UNIQUE) | 手机号（移动端登录） |
| `email` | TEXT (UNIQUE) | 邮箱（用于密码重置） |
| `username` | TEXT (UNIQUE) | 用户名（PC端登录） |
| `password` | TEXT | bcryptjs 加密后的密码 |
| `role` | TEXT | 角色：`user`, `merchant`, `admin` |

### Orders 表（新增）

| 字段名 | 类型 | 说明 |
| :--- | :--- | :--- |
| `id` | TEXT (PK) | 订单唯一标识 |
| `user_id` | TEXT (FK) | 下单用户 ID |
| `hotel_id` | TEXT (FK) | 预订酒店 ID |
| `room_id` | TEXT (FK) | 预订房型 ID |
| `check_in_date` | TEXT | 入住日期 |
| `check_out_date` | TEXT | 离店日期 |
| `total_price` | REAL | 订单总价 |
| `status` | TEXT | 订单状态：`pending`, `confirmed`, `completed`, `cancelled` |
| `guestName` | TEXT | 入住人姓名 |
| `guestPhone` | TEXT | 入住人电话 |

---

## 6. 开发协同规范

1.  **接口先行**：所有接口路径和返回字段必须严格遵守 `docs/technical/api_spec.md` 下的定义。
2.  **前端 Mock**：在后端接口未完成前，前端可使用 Mock 数据进行开发，支持通过 `VITE_USE_REAL_API` 环境变量切换。
3.  **实时更新**：商户保存数据后，后端需在写入 SQLite 成功后立即返回 `200 OK`，前端接收到成功响应后触发页面重连或局部状态更新。
4.  **房型排序**：详情页房型列表必须按价格从低到高排序。
5.  **虚拟删除**：下线操作采用虚拟删除，确保数据可恢复。

---

## 8. PC 管理端技术实现

### 8.1 技术栈

| 类别 | 技术 | 版本 | 用途 |
| :--- | :--- | :--- | :--- |
| 框架 | React | 19.2.0 | UI 框架 |
| 语言 | TypeScript | 5.9.3 | 类型安全 |
| 构建工具 | Vite | 7.3.1 | 开发服务器与构建 |
| 路由 | React Router DOM | 7.13.0 | 页面路由 |
| UI 组件库 | Ant Design | 6.3.0 | PC 端组件 |
| 图标库 | @ant-design/icons | 6.1.0 | Ant Design 图标 |
| 样式 | Tailwind CSS | 3.4.17 | 原子化 CSS |
| HTTP 客户端 | Axios | 1.13.5 | API 请求 |
| 状态管理 | Zustand | 5.0.11 | 状态管理（已引入未使用） |

### 8.2 核心页面路由

#### 公开路由
| 路由 | 组件 | 功能 |
| :--- | :--- | :--- |
| `/login` | `Login` | 登录页（手机号+密码，自动角色跳转） |
| `/register` | `Register` | 注册页（选择商户/管理员角色） |
| `/` | 自动跳转 | 根据角色跳转到对应页面 |

#### 需要认证的路由 (ProtectedRoute)
| 路由 | 角色 | 组件 | 功能 |
| :--- | :--- | :--- | :--- |
| `/merchant/hotels` | merchant | `HotelList` | 商户酒店列表（分页、状态查看） |
| `/merchant/add` | merchant | `HotelForm` | 添加酒店（表单录入） |
| `/merchant/edit/:id` | merchant | `HotelForm` | 编辑酒店 |
| `/admin/audit` | admin | `AuditList` | 审核管理（通过/拒绝） |
| `/admin/publish` | admin | `PublishList` | 上下线管理（虚拟删除） |

### 8.3 路由守卫机制

```typescript
// ProtectedRoute 组件实现基于角色的访问控制
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  requiredRole?: string;
}> = ({ children, requiredRole }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
```

### 8.4 数据源切换机制

```typescript
// src/services/config.ts
export const DATA_SOURCE: string = "backend";  // "local" | "backend"

// 所有服务层函数都根据此配置切换数据源
if (DATA_SOURCE === "local") {
  // 使用 LocalStorage 数据
  const hotels = readHotels();
} else {
  // 调用后端 API
  const result = await api.get("/merchant/hotels");
}
```

### 8.5 布局组件

**主布局 (Layout.tsx)**：
- 侧边栏导航菜单（根据角色显示不同菜单）
- 顶部 Header（用户信息 + 退出登录）
- 响应式布局

**菜单配置**：
- 管理员：审核管理、上下线管理
- 商户：我的酒店、添加酒店

### 8.6 核心功能实现

#### 商户功能
- **酒店列表**：分页展示、状态 Tag（待审核/已通过/已拒绝）、操作按钮
- **酒店表单**：
  - 基本信息：中英文名、地址、星级、开业时间
  - 酒店标签：多选（8个标签）
  - 酒店设施：多选（12项设施）
  - 房型管理：动态添加/删除房型
  - 图片上传：支持上传酒店图片
  - 表单验证：必填项检查、数据类型验证

#### 管理员功能
- **审核管理**：
  - 仅显示待审核酒店
  - 一键通过（自动上线）
  - 拒绝时填写原因
  - 查看详细信息
- **上下线管理**：
  - 仅显示已通过审核的酒店
  - 上线/下线切换
  - 虚拟删除（可恢复）

---

## 9. 移动端主要 API 端点

### 认证相关
*   `POST /auth/register` - 用户注册
*   `POST /auth/login` - 用户登录
*   `GET /auth/me` - 获取当前用户
*   `POST /auth/send-reset-code` - 发送验证码
*   `POST /auth/verify-reset-code` - 验证验证码
*   `POST /auth/reset-password-with-code` - 重置密码
*   `POST /auth/logout` - 用户登出

### 首页相关
*   `GET /mobile/home/banners` - 获取首页 Banner
*   `GET /mobile/home/popular-cities` - 获取热门城市

### 酒店相关
*   `GET /mobile/hotels` - 酒店列表查询
*   `GET /mobile/hotels/:id` - 酒店详情获取

### 订单相关
*   `POST /mobile/bookings` - 创建订单
*   `GET /mobile/bookings` - 获取订单列表
*   `GET /mobile/bookings/:id` - 获取订单详情
*   `PATCH /mobile/bookings/:id/cancel` - 取消订单
*   `PATCH /mobile/bookings/:id` - 更新订单状态

---

## 9. PC 管理端主要 API 端点

### 认证相关
*   `POST /auth/register` - 用户注册（商户/管理员）
*   `POST /auth/login` - 用户登录

### 商户接口
*   `GET /merchant/hotels` - 获取商户酒店列表
*   `POST /merchant/hotels` - 创建酒店
*   `PUT /merchant/hotels/:id` - 更新酒店
*   `DELETE /merchant/hotels/:id` - 删除酒店
*   `POST /merchant/upload` - 上传图片

### 管理员接口
*   `GET /admin/hotels` - 获取所有酒店
*   `PATCH /admin/audit/:id` - 审核酒店（通过/拒绝）
*   `PATCH /admin/publish/:id` - 上下线酒店

---

## 10. 相关文档

| 文档 | 路径 |
| :--- | :--- |
| 产品需求 | [docs/product/requirements_specification.md](../product/requirements_specification.md) |
| API 规范 | [docs/technical/api_spec.md](./api_spec.md) |
| 数据结构 | [docs/technical/data_schema.md](./data_schema.md) |
| 团队分工 | [docs/teamwork/teamwork_distribution.md](../teamwork/teamwork_distribution.md) |
| 移动端文档 | [client-mobile/CLAUDE.md](../../client-mobile/CLAUDE.md) |
| 移动端 API 对接 | [client-mobile/API_INTEGRATION.md](../../client-mobile/API_INTEGRATION.md) |
| PC 管理端文档 | [client-pc/CLAUDE.md](../../client-pc/CLAUDE.md) |
| PC 管理端说明 | [client-pc/README.md](../../client-pc/README.md) |
