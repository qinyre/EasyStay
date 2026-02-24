require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// 基础中间件
app.use(cors());
app.use(express.json()); // 解析 application/json
app.use(express.urlencoded({ extended: true })); // 解析 application/x-www-form-urlencoded

// 导入路由
const authRoutes = require('./routes/auth');
const mobileRoutes = require('./routes/mobile');
const mobileBookingRoutes = require('./routes/mobileBookings');
const merchantRoutes = require('./routes/merchant');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const orderRoutes = require('./routes/order');
const setupSwagger = require('./utils/swagger');

// 接入 Swagger 接口描述文档
setupSwagger(app);

// 暴露静态文件目录供前端访问上传的图片
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 注册路由
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/mobile', mobileRoutes);
app.use('/api/v1/mobile', mobileBookingRoutes);
app.use('/api/v1/merchant', merchantRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/order', orderRoutes);

// 定义一个基础的测试路由
app.get('/api/v1/ping', (req, res) => {
  res.json({
    code: 200,
    data: { message: 'pong', timestamp: new Date().toISOString() },
    message: 'success'
  });
});

// 全局 404 处理
app.use((req, res) => {
  res.status(404).json({
    code: 404,
    message: '接口路径不存在'
  });
});

// 全局错误处理
app.use((err, req, res, next) => {
  console.error('[Error]:', err.stack);
  res.status(500).json({
    code: 500,
    message: err.message || '服务器内部错误'
  });
});

// 启动服务器
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
