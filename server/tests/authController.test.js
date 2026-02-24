const request = require('supertest');
const express = require('express');
const cors = require('cors');
const authRoutes = require('../routes/auth');
const connectDB = require('../config/db');
const mongoose = require('mongoose');

// 创建测试应用
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/v1/auth', authRoutes);

// 测试前连接数据库
beforeAll(async () => {
    await connectDB();
});

// 测试后断开数据库连接
afterAll(async () => {
    await mongoose.disconnect();
});

// 清空测试数据
beforeEach(async () => {
    // 清空用户集合
    await mongoose.model('User').deleteMany({});
});

describe('Auth Controller', () => {
    describe('POST /api/v1/auth/register', () => {
        it('should register a new user successfully', async () => {
            const response = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    username: 'testuser',
                    password: 'password123',
                    role: 'user'
                });

            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe('注册成功');
        });

        it('should return 400 if username, password or role is missing', async () => {
            const response = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    username: 'testuser'
                });

            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBe('请提供完整的注册信息 (username, password, role)');
        });

        it('should return 400 if role is invalid', async () => {
            const response = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    username: 'testuser',
                    password: 'password123',
                    role: 'invalid'
                });

            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBe('非法的角色类型，仅支持 user、merchant 或 admin');
        });

        it('should return 400 if username already exists', async () => {
            // 先注册一个用户
            await request(app)
                .post('/api/v1/auth/register')
                .send({
                    username: 'testuser',
                    password: 'password123',
                    role: 'user'
                });

            // 再次使用相同的用户名注册
            const response = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    username: 'testuser',
                    password: 'password123',
                    role: 'user'
                });

            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBe('用户名已存在');
        });
    });

    describe('POST /api/v1/auth/login', () => {
        it('should login successfully with valid credentials', async () => {
            // 先注册一个用户
            await request(app)
                .post('/api/v1/auth/register')
                .send({
                    username: 'testuser',
                    password: 'password123',
                    role: 'user'
                });

            // 登录
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    username: 'testuser',
                    password: 'password123'
                });

            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe('登录成功');
            expect(response.body.data).toHaveProperty('token');
            expect(response.body.data).toHaveProperty('role');
            expect(response.body.data).toHaveProperty('username');
        });

        it('should return 400 if username or password is missing', async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    username: 'testuser'
                });

            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBe('请提供用户名和密码');
        });

        it('should return 401 if username or password is incorrect', async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    username: 'nonexistent',
                    password: 'wrongpassword'
                });

            expect(response.statusCode).toBe(401);
            expect(response.body.message).toBe('用户名或密码错误');
        });
    });
});