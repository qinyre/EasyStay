# 易宿酒店预订平台 - 团队分工协作文档

## 0. 协作核心原则：接口先行

为了实现**进度互不干扰**，项目启动后的前两个小时，三人必须共同确认 `docs/technical/api_spec.md` 中的字段名。一旦确认，前端使用 Mock 数据（静态假数据）开发界面，后端独立开发接口逻辑。

---

## 1. 成员 A：移动端前端工程师 (Mobile Developer)

**核心目标**：负责 C 端用户体验，确保预定流程流畅。

**技术栈**：React 18 + TypeScript + Vite + Ant Design Mobile + Tailwind CSS

### 页面开发任务

#### 酒店查询页 (首页 - `/`)
* 实现顶部广告 Banner 及其跳转逻辑
* 实现搜索栏、定位功能及快捷标签展示
* 热门城市横向滚动列表
* **技术难点**：独立开发**日历组件** (`CalendarPicker`)，支持入住与离店日期选择，最多180晚

#### 酒店列表页 (`/hotels`)
* 实现多维度筛选头（城市、日期、星级、价格区间、标签）
* **技术得分点**：开发**虚拟列表**优化（使用 `ahooks` 的 `useVirtualList`），支持下拉刷新和无限滚动
* 实现筛选面板（排序、价格、星级、标签）
* 返回顶部按钮

#### 酒店详情页 (`/hotel/:id`)
* 实现图片轮播 Banner（优化预加载策略）
* 实现动态透明度导航栏
* **逻辑难点**：对后端返回的房型数据进行**价格由低到高排序**呈现
* 实现日期选择器
* 设施图标展示

#### 订单相关页面
* **预订确认页** (`/hotel/:hotelId/booking/:roomId`)：入住人信息表单、费用明细、同意条款
* **预订成功页** (`/booking/success`)：订单展示
* **我的订单页** (`/bookings`)：标签筛选、订单卡片、倒计时显示（15分钟支付时限）
* **订单详情页** (`/booking/:id`)：订单状态、进度条、操作按钮

#### 用户认证页面
* **登录页** (`/login`)：手机号+密码表单
* **注册页** (`/register`)：手机号、邮箱、密码表单
* **忘记密码页** (`/forgot-password`)：邮箱验证码重置密码

#### 个人中心页面
* **个人中心** (`/profile`)：用户信息、登录状态判断
* **设置页** (`/settings`)：语言切换（中/英）
* **关于我们** (`/about`)
* **法律页面**：用户协议、隐私政策

### 技术实现要求

#### 状态管理
* **SearchContext**：管理搜索参数（城市、日期、关键词、筛选条件）
* **AuthContext**：管理用户认证状态（登录、注册、登出）
* **ProtectedRoute**：路由守卫，保护需要认证的页面

#### 自定义 Hooks
* **useCountdown**：倒计时 Hook（分:秒格式、过期回调）

#### API 切换机制
* 支持通过环境变量 `VITE_USE_REAL_API` 切换真实 API 和 Mock 数据
* 实现自动回退机制（API 失败自动使用 Mock 数据）

#### 国际化
* 使用 i18next 实现中英文切换
* 覆盖所有页面文本

#### 测试
* 使用 Vitest + Testing Library 编写单元测试
* 测试覆盖率目标：工具函数 100%，组件 80%+，Context 90%+

---

## 2. 成员 B：PC 管理端前端工程师 (PC Admin Developer)

**核心目标**：负责 B 端管理逻辑，确保商户与管理员操作闭环。

**技术栈**：React 19 + TypeScript + Vite + Ant Design + Tailwind CSS

### 页面开发任务

#### 认证页面
* **登录页** (`/login`)：用户名+密码表单，根据角色自动跳转
* **注册页** (`/register`)：用户名、密码、角色选择（商户/管理员）

#### 商户端页面
* **酒店列表页** (`/merchant/hotels`)：分页展示、状态 Tag（待审核/已通过/已拒绝）、操作按钮
* **酒店表单页** (`/merchant/add` 和 `/merchant/edit/:id`)：
  - 基本信息：中英文名、地址、星级、开业时间
  - 酒店标签：多选（8个标签：亲子、豪华、度假、商务等）
  - 酒店设施：多选（12项设施：免费Wi-Fi、游泳池、健身房等）
  - 房型管理：动态添加/删除房型（名称、价格、容纳人数、库存、描述、图片）
  - 图片上传：支持上传酒店图片
  - 表单验证：必填项检查、数据类型验证

#### 管理员页面
* **审核管理页** (`/admin/audit`)：
  - 仅显示待审核酒店
  - 一键通过（自动上线）
  - 拒绝时填写原因
  - 查看详细信息
* **上下线管理页** (`/admin/publish`)：
  - 仅显示已通过审核的酒店
  - 上线/下线切换
  - 虚拟删除（可恢复）

### 技术实现要求

#### 路由与布局
* **Layout 组件**：侧边栏导航 + 顶部 Header（用户信息 + 退出登录）
* **ProtectedRoute**：基于角色的路由守卫
* **响应式布局**：适配不同屏幕尺寸

#### 数据源切换
* 支持通过 `DATA_SOURCE` 常量切换 LocalStorage 和后端 API
* 实现数据无缝切换

#### 常量管理
* `facilities.ts`：酒店设施列表（12项）
* `hotelTags.ts`：酒店标签列表（8个）

---

## 3. 成员 C：后端全栈工程师 (Backend & DB Coordinator)

**核心目标**：负责数据持久化、接口实现及全局文档。

**技术栈**：Node.js + Express.js + SQLite (better-sqlite3) + JWT + bcryptjs + Multer + Zod

### 服务端架构

* 使用 Node.js + Express 搭建基础服务框架
* 设计并维护 SQLite 数据库结构（`hotels`、`rooms`、`users`、`orders` 表）
* 实现 JWT 认证中间件（7天有效期）
* 实现图片上传中间件（Multer，50MB 限制）
* 实现 Zod 数据验证中间件
* 实现内存缓存机制（替代 Redis）
* 集成 Swagger API 文档

### API 接口实现

#### 移动端认证接口 (`/auth`) - 7个端点
* `POST /auth/register` - 用户注册（手机号+密码+邮箱）
* `POST /auth/login` - 用户登录（手机号+密码）
* `GET /auth/me` - 获取当前用户信息
* `POST /auth/send-reset-code` - 发送密码重置验证码
* `POST /auth/verify-reset-code` - 验证重置验证码
* `POST /auth/reset-password-with-code` - 使用验证码重置密码
* `POST /auth/logout` - 用户登出

#### 移动端首页接口 (`/mobile/home`) - 2个端点
* `GET /mobile/home/banners` - 获取首页轮播图（1小时缓存）
* `GET /mobile/home/popular-cities` - 获取热门城市（24小时缓存）

#### 移动端酒店接口 (`/mobile/hotels`) - 2个端点
* `GET /mobile/hotels` - 酒店列表查询（支持关键词、城市、日期、星级、价格区间、标签筛选、分页，30分钟缓存）
* `GET /mobile/hotels/:id` - 酒店详情获取（房型按价格升序，1小时缓存）

#### 移动端订单接口 (`/mobile/bookings`) - 5个端点
* `POST /mobile/bookings` - 创建订单
* `GET /mobile/bookings` - 获取用户订单列表
* `GET /mobile/bookings/:id` - 获取订单详情
* `PATCH /mobile/bookings/:id/cancel` - 取消订单
* `PATCH /mobile/bookings/:id` - 更新订单状态

#### PC 端用户接口 (`/user`) - 4个端点
* `POST /user/register` - 用户注册（用户名+密码+角色）
* `POST /user/login` - 用户登录（用户名+密码）
* `GET /user/profile` - 获取个人信息
* `PUT /user/profile` - 更新个人信息

#### 商户接口 (`/merchant`) - 6个端点
* `GET /merchant/hotels` - 获取商户酒店列表
* `POST /merchant/hotels` - 创建酒店
* `PUT /merchant/hotels/:id` - 更新酒店
* `GET /merchant/hotels/:id` - 获取酒店详情
* `DELETE /merchant/hotels/:id` - 删除酒店
* `POST /merchant/upload` - 上传图片

#### 管理员接口 (`/admin`) - 4个端点
* `GET /admin/hotels` - 获取所有酒店
* `GET /admin/hotels/:id` - 获取酒店详情
* `PATCH /admin/audit/:hotelId` - 审核酒店（通过/拒绝）
* `PATCH /admin/publish/:hotelId` - 发布/下线酒店

#### PC 端订单接口 (`/order`) - 6个端点
* `POST /order` - 创建订单
* `GET /order` - 获取用户订单列表
* `GET /order/:id` - 获取订单详情
* `PATCH /order/:id/status` - 更新订单状态
* `PATCH /order/:id/payment` - 更新支付状态
* `GET /order/admin/all` - 管理员获取所有订单

### 双认证体系

**移动端认证** (`/auth`)：
- 登录方式：手机号 + 密码
- 注册方式：手机号 + 密码 + 邮箱

**PC 端认证** (`/user`)：
- 登录方式：用户名 + 密码
- 注册方式：用户名 + 密码 + 角色（商户/管理员）

### 数据库 Schema

**Hotels 表**（25个字段）：id、name_cn、name_en、address、star_level、location、description、facilities、rating、image、images、tags、price_start、open_date、banner_url、audit_status、is_offline、fail_reason、merchant_id、merchant_username、created_at、updated_at

**Rooms 表**（8个字段）：id、name、price、capacity、description、image_url、amenities、hotelId

**Users 表**（9个字段）：id、phone、email、username、password、name、avatar、role、created_at

**Orders 表**（16个字段）：id、user_id、hotel_id、room_id、check_in_date、check_out_date、guests、total_price、status、payment_status、payment_method、transaction_id、guestName、guestPhone、hotelName、hotelImage、roomType、nights、created_at、updated_at

### 数据一致性保障

* 实现 SQLite 事务处理，确保数据一致性
* **技术得分点**：确保商户端修改后的数据能**实时通过 API 更新**至移动端
* 实现内存缓存机制，热点数据加速访问：
  - 首页轮播图：1小时
  - 热门城市：24小时
  - 酒店列表：30分钟
  - 酒店详情：1小时
* 缓存失效：创建/更新/删除酒店时自动清除相关缓存

### 测试与文档

* 使用 Jest + Supertest 编写单元测试
* 提供冒烟测试脚本 (`scripts/smoke.ps1`)
* 集成 Swagger API 文档（访问 `/api-docs`）
* 提供 Mock 数据导入脚本 (`importMockData.js`)

### 公共交付物

* 负责编写最终的 `README.md` 项目运行指南
* 维护 API 接口文档 (`docs/technical/api_spec.md`)
* 维护数据结构文档 (`docs/technical/data_schema.md`)

---

## 4. 进度同步路线图

| 时间 | 成员 A 任务 | 成员 B 任务 | 成员 C 任务 |
| :--- | :--- | :--- | :--- |
| **第 1 天** | 三人对齐 API 字段（docs 目录搭建完成） | 同左 | 同左 |
| **第 2-3 天** | 攻克日历组件与长列表优化 | 攻克录入表单 | 完成 SQLite 读写接口 |
| **第 4-5 天** | 完成订单流程页面 | 完成审核与下线功能 | 完成认证与订单接口 |
| **第 6 天** | 完善用户认证与个人中心 | 联调测试 | 联调测试 |
| **第 7 天** | 全面联调，将前端地址由本地 Mock 切换为后端地址 | 同左 | 对照测试文档进行最终验收 |

---

## 5. 交付物清单

### 成员 A 交付物
- [ ] 完整的移动端应用代码
- [ ] 单元测试代码（覆盖率达标）
- [ ] 移动端 API 对接文档 (`client-mobile/API_INTEGRATION.md`)
- [ ] 移动端 AI 上下文文档 (`client-mobile/CLAUDE.md`)

### 成员 B 交付物
- [ ] 完整的 PC 管理端应用代码
- [ ] 商户录入功能
- [ ] 管理员审核功能

### 成员 C 交付物
- [ ] 完整的后端服务代码
- [ ] SQLite 数据库建表脚本
- [ ] API 接口文档 (`docs/technical/api_spec.md`)
- [ ] 数据结构文档 (`docs/technical/data_schema.md`)
- [ ] 项目运行指南 (`README.md`)

---

## 6. 技术规范约束

1. **房型排序规则**：详情页房型必须按价格从低到高排序
2. **虚拟删除机制**：下线操作仅修改 `is_offline` 标志，数据可恢复
3. **响应格式统一**：后端必须返回 `{ code: 200, data: {...}, message: "success" }` 格式
4. **日期格式统一**：使用 `yyyy-MM-dd` 格式
5. **环境变量控制**：移动端通过 `VITE_USE_REAL_API` 控制 Mock/真实 API 切换
