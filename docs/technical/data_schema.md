# 易宿酒店预订平台 - 数据结构定义文档 (Data Schema)

> 这份数据结构定义文档（Data Schema）是项目存储逻辑的蓝图。它规定了 SQLite 数据库（`server/data/easystay.db`）中各表的字段类型与业务含义，确保前端在渲染页面和后端在读写数据时，对数据的理解完全一致。

## 1. 酒店信息数据结构（`hotels` 表）

此表存储所有酒店对象，是整个系统的核心数据。

| 字段名 (Column) | 类型 | 描述 | 约束与备注 |
| --- | --- | --- | --- |
| `id` | TEXT | 酒店唯一标识符 | 主键，使用 UUID 字符串。 |
| `name_cn` | TEXT | 酒店中文名 | **必须维度**，NOT NULL。 |
| `name_en` | TEXT | 酒店英文名 | 支持国际化展示。 |
| `address` | TEXT | 酒店详细地址 | **必须维度**，NOT NULL。 |
| `star_level` | INTEGER | 酒店星级 | 取值范围：1-5。 |
| `banner_url` | TEXT | 酒店大图 URL | 对应移动端详情页的轮播图。 |
| `description` | TEXT | 酒店描述 | 可选维度。 |
| `tags` | TEXT | 快捷标签 | JSON 数组序列化存储，如：`["亲子", "豪华", "免费停车场"]`。 |
| `audit_status` | TEXT | 审核状态 | 枚举值：`Pending` (审核中), `Approved` (通过), `Rejected` (不通过)，默认 `Pending`。 |
| `fail_reason` | TEXT | 审核不通过原因 | 仅当状态为 `Rejected` 时填写。 |
| `is_offline` | INTEGER | 是否已下线 | **虚拟删除标志**：`1` 为下线（移动端不显示），`0` 为在线，支持数据恢复。 |
| `merchant_username` | TEXT | 所属商户用户名 | 关联创建该酒店的商户账号。 |
| `createdAt` | TEXT | 创建时间 | ISO 8601 格式，默认为当前时间。 |
| `updatedAt` | TEXT | 更新时间 | ISO 8601 格式，每次保存自动更新。 |

---

## 2. 房型数据结构（`rooms` 表）

此表存储酒店的房型信息，通过 `hotelId` 外键关联到 `hotels` 表。

| 字段名 (Column) | 类型 | 描述 | 备注 |
| --- | --- | --- | --- |
| `id` | TEXT | 房型唯一标识 | 主键，使用 UUID。 |
| `name` | TEXT | 房型名称 | 如：经典双床房。NOT NULL。 |
| `price` | REAL | 房型价格 | **核心字段**，移动端需据此进行升序排序。NOT NULL。 |
| `capacity` | INTEGER | 房间容纳人数 | 默认为 2。 |
| `description` | TEXT | 房型描述 | 可选维度。 |
| `image_url` | TEXT | 房型图片 URL | 可选维度。 |
| `amenities` | TEXT | 房间设施 | JSON 数组序列化存储，如：`["WiFi", "空调", "迷你吧"]`。 |
| `hotelId` | TEXT | 所属酒店 ID | **外键**，关联 `hotels.id`，ON DELETE CASCADE。 |

---

## 3. 用户账户数据结构（`users` 表）

此表用于管理所有用户的登录验证，支持移动端（手机号登录）和 PC 端（用户名登录）。

| 字段名 (Column) | 类型 | 描述 | 备注 |
| --- | --- | --- | --- |
| `id` | TEXT | 用户唯一标识 | 主键，使用 UUID。 |
| `phone` | TEXT | 手机号 | UNIQUE，移动端登录使用。 |
| `email` | TEXT | 邮箱地址 | UNIQUE，用于密码重置。 |
| `password` | TEXT | 登录密码 | 使用 bcryptjs 加密后的哈希值。NOT NULL。 |
| `name` | TEXT | 用户昵称 | 可选维度。 |
| `avatar` | TEXT | 用户头像 URL | 可选维度。 |
| `username` | TEXT | 登录用户名 | UNIQUE，PC 端登录使用。 |
| `role` | TEXT | 账户角色 | 枚举值：`user` (普通用户), `merchant` (商户), `admin` (管理员)。默认 `user`。 |
| `createdAt` | TEXT | 注册时间 | ISO 8601 格式。 |

---

## 4. 订单数据结构（`orders` 表）

此表存储所有预订订单信息。

| 字段名 (Column) | 类型 | 描述 | 备注 |
| --- | --- | --- | --- |
| `id` | TEXT | 订单唯一标识 | 主键，格式：`bk_时间戳_随机字符`。 |
| `user_id` | TEXT | 下单用户 ID | **外键**，关联 `users.id`。 |
| `hotel_id` | TEXT | 预订酒店 ID | **外键**，关联 `hotels.id`。 |
| `room_id` | TEXT | 预订房型 ID | **外键**，关联 `rooms.id`。 |
| `check_in_date` | TEXT | 入住日期 | ISO 格式。NOT NULL。 |
| `check_out_date` | TEXT | 离店日期 | ISO 格式。NOT NULL。 |
| `guests` | INTEGER | 入住人数 | 默认 1。 |
| `total_price` | REAL | 订单总价 | NOT NULL。 |
| `status` | TEXT | 订单状态 | 枚举值：`pending`, `confirmed`, `completed`, `cancelled`。默认 `pending`。 |
| `payment_status` | TEXT | 支付状态 | 枚举值：`unpaid`, `paid`, `refunded`。默认 `unpaid`。 |
| `guestName` | TEXT | 入住人姓名 | 移动端下单时填写。 |
| `guestPhone` | TEXT | 入住人电话 | 移动端下单时填写。 |
| `createdAt` | TEXT | 创建时间 | ISO 8601 格式。 |
| `updatedAt` | TEXT | 更新时间 | ISO 8601 格式。 |

---

## 5. 设计规范与约束

1. **价格类型限制**：`price` 必须存储为 `REAL` 类型，以便成员 A 实现详情页"价格从低到高"的自动排序逻辑。
2. **虚拟删除逻辑**：执行"下线"操作时，后端仅修改 `is_offline = 1`，不物理删除数据库中的记录，以满足"下线可以被恢复"的需求。
3. **状态实时性**：商户修改保存后，后端需更新 `audit_status` 为 `Pending`，确保数据流向管理员审核队列。
4. **数组字段存储**：`tags` 和 `amenities` 等数组类型字段以 JSON 字符串形式存储在 TEXT 列中，读取时需使用 `JSON.parse()` 反序列化。
5. **密码安全**：所有密码字段存储 `bcryptjs` 加密后的哈希值，禁止明文存储。
6. **外键约束**：SQLite 已开启外键支持（`PRAGMA foreign_keys = ON`），确保数据引用完整性。
