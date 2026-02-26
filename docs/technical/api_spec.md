# 易宿酒店预订平台 - API 接口规范 (API Specification)

## 1. 全局约定

* **基础路径 (Base URL)**: `/api/v1`
* **通信协议**: HTTP/1.1
* **数据格式**: 请求与响应均使用 `application/json`
* **响应规范**:
  * 成功: `{ "code": 200, "data": { ... }, "message": "success" }`
  * 失败: `{ "code": 400, "message": "错误原因描述" }`

---

## 2. 用户认证接口 (Authentication)

### 2.1 用户注册

* **接口路径**: `POST /auth/register`
* **功能描述**: 用户注册（支持普通用户、商户角色）
* **请求体**:
  * `phone` (string): 手机号（必填，11位）
  * `email` (string): 邮箱地址（必填）
  * `password` (string): 密码（必填，最少6位）
  * `confirmPassword` (string): 确认密码（必填）
  * `name` (string): 用户昵称（可选）
  * `role` (string): 角色类型，可选值：`user`（默认）、`merchant`

### 2.2 用户登录

* **接口路径**: `POST /auth/login`
* **功能描述**: 用户登录（支持手机号+密码登录）
* **请求体**:
  * `phone` (string): 手机号
  * `password` (string): 密码
* **响应**:
  * `user`: 用户信息对象
  * `token`: JWT 认证令牌

### 2.3 获取当前用户信息

* **接口路径**: `GET /auth/me`
* **请求头**: `Authorization: Bearer {token}`
* **功能描述**: 获取当前登录用户信息

### 2.4 发送密码重置验证码

* **接口路径**: `POST /auth/send-reset-code`
* **请求体**:
  * `email` (string): 邮箱地址
* **功能描述**: 发送密码重置验证码到用户邮箱

### 2.5 验证密码重置验证码

* **接口路径**: `POST /auth/verify-reset-code`
* **请求体**:
  * `email` (string): 邮箱地址
  * `code` (string): 验证码
* **功能描述**: 验证验证码是否正确

### 2.6 使用验证码重置密码

* **接口路径**: `POST /auth/reset-password-with-code`
* **请求体**:
  * `email` (string): 邮箱地址
  * `code` (string): 验证码
  * `newPassword` (string): 新密码
* **功能描述**: 使用验证码重置密码

### 2.7 用户登出

* **接口路径**: `POST /auth/logout`
* **请求头**: `Authorization: Bearer {token}`
* **功能描述**: 用户登出

---

## 3. 用户端接口 (Mobile Consumer API)

服务于移动端酒店预定流程页面。

### 3.1 获取首页 Banner

* **接口路径**: `GET /mobile/home/banners`
* **功能描述**: 获取酒店广告信息，点击后跳转至酒店详情页
* **响应数据**:
  * `id` (string): Banner ID
  * `name` (string): 酒店名称
  * `image` (string): 图片 URL
  * `hotelId` (string): 关联的酒店 ID

### 3.2 获取热门城市

* **接口路径**: `GET /mobile/home/popular-cities`
* **功能描述**: 获取热门城市列表
* **响应数据**:
  * `name` (string): 城市名称
  * `image` (string): 城市图片 URL

### 3.3 酒店列表查询

* **接口路径**: `GET /mobile/hotels`
* **查询参数**:
  * `city` (string): 城市名称（如：上海、北京）
  * `keyword` (string): 关键字搜索
  * `checkIn` (string): 入住日期（yyyy-MM-dd）
  * `checkOut` (string): 离店日期（yyyy-MM-dd）
  * `starLevel` (number): 酒店星级筛选（1-5，0表示全部）
  * `priceMin` (number): 最低价格
  * `priceMax` (number): 最高价格
  * `tags` (string): 标签筛选（逗号分隔：亲子,豪华）
  * `page` (number): 页码（默认：1）
  * `pageSize` (number): 每页数量（默认：10）
* **响应数据**:
  * `list` (array): 酒店列表
  * `total` (number): 总数
  * `page` (number): 当前页码
  * `pageSize` (number): 每页数量

### 3.4 酒店详情获取

* **接口路径**: `GET /mobile/hotels/:id`
* **功能描述**: 返回酒店基础信息及房型价格列表
* **逻辑约束**: 房型列表必须按价格从低到高进行排序
* **响应数据**:
  * `id` (string): 酒店 ID
  * `name_cn` (string): 酒店中文名
  * `name_en` (string): 酒店英文名
  * `star_level` (number): 星级
  * `location` (object): 位置信息（省份、城市、地址、经纬度）
  * `description` (string): 酒店描述
  * `rating` (number): 评分
  * `image` (string): 主图 URL
  * `images` (array): 图片列表
  * `tags` (array): 标签列表
  * `facilities` (array): 设施列表
  * `rooms` (array): 房型列表（按价格升序）
    * `id` (string): 房型 ID
    * `type` (string): 房型名称
    * `price` (number): 价格
    * `stock` (number): 库存
    * `description` (string): 描述
    * `image` (string): 图片 URL
  * `price_start` (number): 起始价格
  * `is_offline` (boolean): 是否下线
  * `audit_status` (string): 审核状态

### 3.5 创建订单

* **接口路径**: `POST /mobile/bookings`
* **请求头**: `Authorization: Bearer {token}`
* **请求体**:
  * `hotelId` (string): 酒店 ID
  * `roomId` (string): 房型 ID
  * `checkIn` (string): 入住日期（yyyy-MM-dd）
  * `checkOut` (string): 离店日期（yyyy-MM-dd）
  * `totalPrice` (number): 订单总价
  * `guestName` (string): 入住人姓名
  * `guestPhone` (string): 入住人手机号
* **响应数据**: 完整的订单对象

### 3.6 获取订单列表

* **接口路径**: `GET /mobile/bookings`
* **请求头**: `Authorization: Bearer {token}`
* **查询参数**:
  * `status` (string): 订单状态筛选（pending/confirmed/completed/cancelled）
  * `page` (number): 页码（默认：1）
  * `pageSize` (number): 每页数量（默认：10）
* **响应数据**:
  * `list` (array): 订单列表
  * `total` (number): 总数
  * `page` (number): 当前页码
  * `pageSize` (number): 每页数量

### 3.7 获取订单详情

* **接口路径**: `GET /mobile/bookings/:id`
* **请求头**: `Authorization: Bearer {token}`
* **响应数据**: 完整的订单对象（含酒店信息）

### 3.8 取消订单

* **接口路径**: `PATCH /mobile/bookings/:id/cancel`
* **请求头**: `Authorization: Bearer {token}`
* **功能描述**: 取消指定订单

### 3.9 更新订单状态

* **接口路径**: `PATCH /mobile/bookings/:id`
* **请求头**: `Authorization: Bearer {token}`
* **请求体**:
  * `status` (string): 新状态（confirmed/completed/cancelled）
* **功能描述**: 更新订单状态

---

## 4. 管理端接口 (Management API)

服务于 PC 端的酒店信息录入与审核系统。

### 4.1 酒店信息维护 (商户)

* **接口路径**: `POST /merchant/hotels` (录入) / `PUT /merchant/hotels/:id` (编辑)
* **核心数据维度**:
  * **必须项**: 中英文酒店名、地址、星级、房型、价格、开业时间
  * **可选项**: 热门景点、交通、打折优惠场景
  * **实时性**: 保存后的数据需实时更新到移动端侧

### 4.2 酒店信息审核 (管理员)

* **接口路径**: `PATCH /admin/audit/:hotelId`
* **审核状态**: 通过 (`Approved`)、不通过 (`Rejected`)、审核中 (`Pending`)
* **特殊逻辑**: 若审核不通过，需返回具体原因说明

### 4.3 发布管理 (管理员)

* **接口路径**: `PATCH /admin/publish/:hotelId`
* **功能描述**: 控制酒店信息的发布与下线
* **数据保护**: 下线功能应采用虚拟删除，确保信息可被恢复

---

## 5. 数据对象示例 (Hotel Object Schema)

```json
{
  "id": "hotel_123",
  "name_cn": "上海陆家嘴禧酒店",
  "name_en": "Joy Hotel Lujiazui",
  "star_level": 5,
  "location": {
    "province": "上海市",
    "city": "上海市",
    "address": "浦东新区陆家嘴环路1000号",
    "latitude": 31.2397,
    "longitude": 121.4997
  },
  "description": "酒店位于上海陆家嘴金融中心，毗邻东方明珠...",
  "rating": 4.8,
  "image": "https://example.com/hotel.jpg",
  "images": [
    "https://example.com/hotel1.jpg",
    "https://example.com/hotel2.jpg"
  ],
  "tags": ["豪华", "亲子", "免费停车"],
  "facilities": ["健身房", "游泳池", "WiFi", "停车场"],
  "rooms": [
    {
      "id": "room_1",
      "type": "经典双床房",
      "price": 936,
      "stock": 10,
      "description": "38平方米，双床，免费WiFi",
      "image": "https://example.com/room1.jpg"
    },
    {
      "id": "room_2",
      "type": "豪华大床房",
      "price": 1288,
      "stock": 5,
      "description": "45平方米，大床，免费WiFi",
      "image": "https://example.com/room2.jpg"
    }
  ],
  "price_start": 936,
  "is_offline": false,
  "audit_status": "approved",
  "created_at": "2026-01-01T00:00:00.000Z"
}
```

---

## 6. 订单对象示例 (Booking Object Schema)

```json
{
  "id": "bk_1234567890_abc123",
  "hotelId": "hotel_123",
  "roomId": "room_1",
  "userId": "user_123456",
  "checkIn": "2026-03-01",
  "checkOut": "2026-03-03",
  "totalPrice": 1872,
  "status": "pending",
  "guestName": "张三",
  "guestPhone": "13800138000",
  "createdAt": "2026-02-26T10:30:00.000Z",
  "hotelName": "上海陆家嘴禧酒店",
  "hotelImage": "https://example.com/hotel.jpg",
  "roomType": "经典双床房",
  "hotelAddress": "上海市浦东新区陆家嘴环路1000号",
  "nights": 2
}
```
