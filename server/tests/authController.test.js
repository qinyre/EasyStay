const request = require('supertest');
const express = require('express');
const cors = require('cors');
const authRoutes = require('../routes/auth');
const { db, initDatabase } = require('../config/database');

// 创建测试应用
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/v1/auth', authRoutes);

// 测试前确保数据库已初始化
beforeAll(() => {
    initDatabase();
});

// 清空测试数据
beforeEach(() => {
    // 清空用户表
    db.prepare('DELETE FROM users').run();
});

describe('Auth Controller', () => {
    describe('POST /api/v1/auth/register', () => {
        it('should register a new user successfully', async () => {
            const response = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    phone: '13812345678',
                    email: 'testuser@example.com',
                    password: 'password123',
                    confirmPassword: 'password123',
                    name: 'Test User',
                    role: 'user'
                });

            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe('注册成功');
        });

        it('should return 400 if phone, email, password or confirmPassword is missing', async () => {
            const response = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    phone: '13812345678'
                });

            expect(response.statusCode).toBe(400);
        });

        it('should return 400 if phone already exists', async () => {
            // 先注册一个用户
            await request(app)
                .post('/api/v1/auth/register')
                .send({
                    phone: '13812345678',
                    email: 'testuser1@example.com',
                    password: 'password123',
                    confirmPassword: 'password123',
                    name: 'Test User 1',
                    role: 'user'
                });

            // 再次使用相同的手机号注册
            const response = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    phone: '13812345678',
                    email: 'testuser2@example.com',
                    password: 'password123',
                    confirmPassword: 'password123',
                    name: 'Test User 2',
                    role: 'user'
                });

            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBe('手机号已注册');
        });
    });

    describe('POST /api/v1/auth/login', () => {
        it('should login successfully with valid credentials', async () => {
            // 先注册一个用户
            await request(app)
                .post('/api/v1/auth/register')
                .send({
                    phone: '13812345678',
                    email: 'testuser@example.com',
                    password: 'password123',
                    confirmPassword: 'password123',
                    name: 'Test User',
                    role: 'user'
                });

            // 登录
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    phone: '13812345678',
                    password: 'password123'
                });

            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe('登录成功');
            expect(response.body.data).toHaveProperty('token');
            expect(response.body.data.user).toHaveProperty('role');
            expect(response.body.data.user).toHaveProperty('phone');
        });

        it('should return 400 if phone or password is missing', async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    phone: '13812345678'
                });

            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBe('请提供手机号和密码');
        });

        it('should return 401 if phone or password is incorrect', async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    phone: '13800000000',
                    password: 'wrongpassword'
                });

            expect(response.statusCode).toBe(401);
            expect(response.body.message).toBe('手机号或密码错误');
        });
    });
});