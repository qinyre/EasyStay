# 易宿酒店预订平台 - 开发实现方案 (Technical Implementation Spec)

## 1. 系统架构与分层

本项目采用前后端分离架构 。

**客户端**：两个独立的 React 应用，通过 Axios 与服务端进行 RESTful 通信 。

**服务端**：Node.js 环境，负责业务逻辑中转、权限验证及数据库操作 。

**持久层**：基于 SQLite 轻量级本地关系型数据库（`server/data/easystay.db`），通过 `better-sqlite3` 驱动进行同步读写。无需安装独立的数据库服务，数据库文件在首次启动时自动创建。

---

## 2. 项目目录结构 (Directory Structure)

```text
/EasyStay
├── /client-mobile         # 成员A：移动端源代码 (React)
├── /client-pc             # 成员B：PC管理端源代码 (React)
├── /server                # 成员C：Node.js 后端源代码
│   ├── /config            # 数据库连接 (database.js) 与缓存配置 (cache.js)
│   ├── /controllers       # 控制器（业务逻辑层）
│   ├── /data              # SQLite 数据库文件 (easystay.db, 自动生成)
│   ├── /routes            # API 路由处理
│   ├── /uploads           # 上传的图片文件
│   └── /middlewares       # 中间件（认证、上传、验证）
└── /docs                  # 开发文档、接口规范、截图资产

```

---

## 3. 核心技术逻辑实现

### 3.1 排序与过滤算法 (成员 A 关注)

**详情页排序**：前端获取房型列表后，必须调用 `.sort((a, b) => a.price - b.price)` 进行升序排列 。

**列表页优化**：酒店列表需实现长列表渲染优化（如 Virtual List 或 Intersection Observer 监听滑动） 。

### 3.2 权限与状态机 (成员 B/C 关注)

**登录逻辑**：后端从 SQLite 的 `users` 表中查询用户，使用 `bcryptjs` 验证密码，根据 `role` 字段签发对应权限的 JWT Token 。

**虚拟删除 (下线)**：在 `hotels` 表中设置 `is_offline` 整数字段（0=在线, 1=下线），管理员执行"下线"仅修改此标志位，不物理删除数据 。

---

## 4. 数据库 Schema 设计 (SQLite 表结构)

核心数据表定义如下：

### Hotels 表

| 字段名 | 类型 | 说明 |
| --- | --- | --- |
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
| --- | --- | --- |
| `id` | TEXT (PK) | 房型唯一标识 |
| `name` | TEXT | 房型名称 |
| `price` | REAL | 房型价格 |
| `hotelId` | TEXT (FK) | 所属酒店 ID |

### Users 表

| 字段名 | 类型 | 说明 |
| --- | --- | --- |
| `id` | TEXT (PK) | 用户唯一标识 |
| `phone` | TEXT (UNIQUE) | 手机号（移动端登录） |
| `username` | TEXT (UNIQUE) | 用户名（PC端登录） |
| `password` | TEXT | bcryptjs 加密后的密码 |
| `role` | TEXT | 角色：`user`, `merchant`, `admin` |

---

## 5. 开发协同规范

1. **接口先行**：所有接口路径和返回字段必须严格遵守 `docs/technical/api_spec.md` 下的定义。
2. **前端 Mock**：在后端接口未完成前，成员 A/B 在代码中定义局部常量数据，确保 UI 开发不受后端进度影响。
3. **实时更新**：商户保存数据后，后端需在写入 SQLite 成功后立即返回 `200 OK`，前端接收到成功响应后触发页面重连或局部状态更新 。

---
