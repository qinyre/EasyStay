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

处理商户与管理员的账号体系。

### 2.1 用户注册

* **接口路径**: `POST /auth/register`
* **功能描述**: 注册界面需提供角色选择（商户/管理员）
* **请求体**:
  * `username` (string): 用户名
  * `password` (string): 密码
  * `role` (string): 角色类型（`merchant` 或 `admin`）

### 2.2 用户登录

* **接口路径**: `POST /auth/login`
* **功能描述**: 登录界面不选择角色，由后端根据账号自动判断角色并返回权限

---

## 3. 用户端接口 (Mobile Consumer API)

服务于移动端酒店预定流程页面。

### 3.1 获取首页 Banner

* **接口路径**: `GET /mobile/home/banners`
* **功能描述**: 获取酒店广告信息，点击后跳转至酒店详情页

### 3.2 酒店列表查询

* **接口路径**: `GET /mobile/hotels`
* **查询参数**:
  * `location` (string): 当前地点（支持定位）
  * `keyword` (string): 关键字搜索
  * `startDate` / `endDate` (date): 入住与离店日期
  * `starLevel` (number): 酒店星级筛选
  * `page` (number): 用于支持上滑自动加载的分页索引

### 3.3 酒店详情获取

* **接口路径**: `GET /mobile/hotels/:id`
* **功能描述**: 返回酒店基础信息及房型价格列表
* **逻辑约束**: 房型列表必须按价格从低到高进行排序

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
  "hotel_id": "string",
  "name_cn": "上海陆家嘴禧酒店",
  "name_en": "Joy Hotel Lujiazui",
  "address": "上海市浦东新区...",
  "star_level": 5,
  "open_date": "2012-01-01",
  "status": "Approved",
  "is_online": true,
  "rooms": [
    { "type": "经典双床房", "price": 936, "stock": 10 }
  ]
}
```
