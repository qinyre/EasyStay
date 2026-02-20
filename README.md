# EasyStay 易宿酒店预订平台

> 一个简易的基于 Node.js 本地文件系统的酒店预订平台 (后端部分已完工 ✅)

## 项目结构
- `server/`：后端服务集群 (Express)
- `docs/`：项目全量文档 (含 API 说明、前端分工说明)

## 如何启动后端服务 (成员C交付物)

由于后端需要提供 API 接口给移动端 (A) 和 PC 管理端 (B) 使用，请在联调前**务必先启动后端服务**。

### 1. 环境要求
- Node.js >= 16
- npm >= 8

### 2. 启动步骤

1. 打开终端，进入后端目录：
   ```bash
   cd server
   ```
2. 安装项目依赖：
   ```bash
   npm install
   ```
3. 启动开发服务器（支持热更新）：
   ```bash
   npm run dev
   # 或者使用常规启动: npm start
   ```
4. 看到控制台输出以下内容即代表启动成功：
   ```
   Server is running on http://localhost:3000
   ```

### 3. API 联调测试
你可以通过浏览器或 Postman 访问以下测试接口验证连通性：
[http://localhost:3000/api/v1/ping](http://localhost:3000/api/v1/ping)

## 针对前端成员(A和B)的联调注意事项

1. **接口前缀**：所有接口均以 `/api/v1/` 开头（例如：`/api/v1/auth/login`）。
2. **返回结构**：后端严格遵循文档约定，所有响应结构均为：
   ```json
   {
     "code": 200, 
     "data": { ... }, 
     "message": "success"
   }
   ```
3. **权限校验**：商户和管理员的接口必须在 Header 中携带 Token：
   ```
   Authorization: Bearer <你从登录接口拿到的Token>
   ```
4. 请严格阅读 `docs/Agent.md` 第 5、6 节关于排序、参数传递及数据类型的约定。
