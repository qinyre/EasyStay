# 易宿酒店预订平台 - 开发实现方案 (Technical Implementation Spec)

## 1. 系统架构与分层

本项目采用前后端分离架构 。

**客户端**：两个独立的 React 应用，通过 Axios 与服务端进行 RESTful 通信 。

**服务端**：Node.js 环境，负责业务逻辑中转、权限验证及文件系统操作 。

**持久层**：基于 `fs` 模块的静态 JSON 文件读写。

---

## 2. 项目目录结构 (Directory Structure)

```text
/EasyStay
├── /client-mobile         # 成员A：移动端源代码 (React)
├── /client-pc             # 成员B：PC管理端源代码 (React)
├── /server                # 成员C：Node.js 后端源代码
│   ├── /data              # 存放 JSON "数据库" 文件
│   └── /routes            # API 路由处理
└── /docs                  # 开发文档、接口规范、截图资产

```

---

## 3. 核心技术逻辑实现

### 3.1 排序与过滤算法 (成员 A 关注)

**详情页排序**：前端获取房型列表后，必须调用 `.sort((a, b) => a.price - b.price)` 进行升序排列 。

**列表页优化**：酒店列表需实现长列表渲染优化（如 Virtual List 或 Intersection Observer 监听滑动） 。

### 3.2 权限与状态机 (成员 B/C 关注)

**登录逻辑**：后端读取 `users.json` 匹配账号，根据 `role` 字段返回对应的权限 Token 。

**虚拟删除 (下线)**：在 `hotels.json` 中设置 `is_offline` 布尔值，管理员执行“下线”仅修改此标志位，不物理删除数据 。

---

## 4. 数据库 Schema 设计 (JSON 结构)

核心数据对象定义如下：

### Hotel Object (`hotels.json`)

| 字段名 | 类型 | 说明 |
| --- | --- | --- |
| `id` | String | 酒店唯一标识 |
| `name_cn` | String | 酒店中文名 (必须维度) |
| `name_en` | String | 酒店英文名 (必须维度) |
| `star_level` | Number | 星级 (1-5) |
| `location` | Object | 包含 `province`, `city`, `address` 等地理信息 |
| `rooms` | Array | 包含 `type`, `price`, `stock` 等对象的数组 |
| `is_offline` | Boolean | 是否已下线 (虚拟删除标志) |
| `audit_status` | String | 枚举值：`pending` (审核中), `approved` (通过), `rejected` (不通过) |
| `created_at` | String | 创建时间 (ISO 8601 格式) |

---

## 5. 开发协同规范

1. **接口先行**：所有接口路径和返回字段必须严格遵守 `docs/api/` 下的定义。
2. **前端 Mock**：在后端接口未完成前，成员 A/B 在代码中定义局部常量数据，确保 UI 开发不受后端进度影响。
3. **实时更新**：商户保存数据后，后端需在写入 JSON 成功后立即返回 `200 OK`，前端接收到成功响应后触发页面重连或局部状态更新 。

---
