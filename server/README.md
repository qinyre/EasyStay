# EasyStay 后端服务 (Server)

这是 EasyStay 酒店预订平台的核心后端接口服务，使用 Node.js + Express 搭建，现已升级为 MongoDB 数据库存储，并集成了 Redis 缓存以提升性能。

## 🚀 快速启动指南

所有的前端同学（移动端与 PC 端）在进行接口联调前，请**务必先启动本服务**。

### 1. 环境要求
- Node.js >= 16
- npm >= 8
- MongoDB >= 4.0
- Redis >= 6.0（可选，用于缓存）

### 2. 启动步骤

确保你在命令行中已经进入了 `server` 文件夹：

1. **安装所有必须的依赖包：**
   ```bash
   npm install
   ```

2. **配置环境变量（可选）：**
   创建 `.env` 文件，可配置以下环境变量：
   ```
   # 数据库连接字符串
   MONGODB_URI=mongodb://localhost:27017/easystay
   
   # Redis连接字符串
   REDIS_URL=redis://localhost:6379
   
   # JWT密钥
   JWT_SECRET=your_jwt_secret_key
   
   # 服务器端口
   PORT=3000
   ```

3. **数据迁移（首次启动）：**
   将现有 JSON 数据导入 MongoDB：
   ```bash
   node scripts/migrateData.js
   ```

4. **启动开发服务器：**
   （支持热更新，修改代码后自动重启）
   ```bash
   npm run dev
   ```
   *如果不支持 nodemon 环境，也可以使用备用启动方式：`npm start`*

5. **验证启动：**
   看到终端底部输出以下绿色文字即代表启动成功：
   ```
   MongoDB connected successfully
   Server is running on http://localhost:3000
   ```
   **注意：启动成功后，请不要关闭该命令行窗口！**

---

## 📖 API 接口连调测试 (Swagger)

后端已内置了开箱即用的 **Swagger UI**。
它不仅是一份最新的接口文档，还可以让你直接在线点击发请求测试（免去你配置 Postman 的麻烦）。

**在启动服务后，请使用浏览器访问：**
👉 **[http://localhost:3000/api-docs](http://localhost:3000/api-docs)**

- 所有的**必传参数**及**类型约束**（利用 Zod 做了严格限制）都在文档上标明。
- 对于打着“小锁头”标志的接口，你需要先调用 `/auth/login` 并在右上方的 `Authorize` 按钮输入你换到的 Token。

## 🆕 新增功能

### 1. 用户管理
- **普通用户注册**：`POST /api/v1/user/register`
- **普通用户登录**：`POST /api/v1/user/login`
- **获取用户信息**：`GET /api/v1/user/profile`
- **更新用户信息**：`PUT /api/v1/user/profile`

### 2. 订单管理
- **创建订单**：`POST /api/v1/order`
- **获取用户订单列表**：`GET /api/v1/order`
- **获取订单详情**：`GET /api/v1/order/:id`
- **更新订单状态**：`PATCH /api/v1/order/:id/status`
- **更新支付状态**：`PATCH /api/v1/order/:id/payment`
- **管理员获取所有订单**：`GET /api/v1/order/admin/all`

## ⚠️ 联调注意事项

1. **统一前缀**：所有的接口访问路径均以 `/api/v1` 开头。
2. **严格参数拦截**：如果你的请求收到了带有 `数据格式校验失败` 的 `400` 报错，说明你传递的 JSON 参数不符合业务约束，请根据报错信息补充。
3. **返回数据结构**：所有返回体都统一包裹在以下格式中：
   ```json
   {
     "code": 200, 
     "data": { ... }, 
     "message": "success"
   }
   ```
4. **性能优化**：热点数据（如首页 Banner、酒店列表、酒店详情）已添加 Redis 缓存，缓存过期时间为 30 分钟至 1 小时。
5. **安全性**：用户密码已使用 bcrypt 加密存储，确保数据安全。

## 🔧 开发工具

### 测试
- **运行测试**：`npm test`
- **测试监视模式**：`npm run test:watch`

### 代码质量
- **代码 lint**：`npm run lint`
- **代码格式化**：`npm run format`

## 📁 项目结构

```
server/
├── controllers/          # 控制器
│   ├── adminController.js    # 管理端控制器
│   ├── authController.js     # 认证控制器
│   ├── merchantController.js # 商户端控制器
│   ├── mobileController.js   # 移动端控制器
│   ├── orderController.js    # 订单控制器
│   └── userController.js     # 用户控制器
├── models/              # 数据模型
│   ├── Hotel.js         # 酒店模型
│   ├── Order.js         # 订单模型
│   ├── Room.js          # 房型模型
│   └── User.js          # 用户模型
├── routes/              # 路由
│   ├── admin.js         # 管理端路由
│   ├── auth.js          # 认证路由
│   ├── merchant.js      # 商户端路由
│   ├── mobile.js        # 移动端路由
│   ├── order.js         # 订单路由
│   └── user.js          # 用户路由
├── config/              # 配置
│   ├── db.js            # 数据库配置
│   └── redis.js         # Redis配置
├── middlewares/         # 中间件
│   ├── auth.js          # 认证中间件
│   ├── upload.js        # 文件上传中间件
│   └── validate.js      # 数据验证中间件
├── utils/               # 工具函数
│   ├── file.js          # 文件操作工具
│   └── swagger.js       # Swagger配置
├── validators/          # 验证模式
│   └── schemas.js       # 验证模式定义
├── scripts/             # 脚本
│   └── migrateData.js   # 数据迁移脚本
├── tests/               # 测试文件
│   └── authController.test.js # 认证控制器测试
├── index.js             # 服务器入口
└── package.json         # 项目配置
```
