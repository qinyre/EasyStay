import axios from 'axios';
import { AuthResponse, LoginRequest, RegisterRequest, User, SendVerificationCodeRequest, ResetPasswordWithCodeRequest } from '../types';

// ============================================================
// API 客户端配置
// ============================================================

const authClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加 Token
authClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器 - 统一处理响应
authClient.interceptors.response.use(
  (response) => {
    return response.data?.data || response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      // 清除过期的 token
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// 是否使用真实 API
const USE_REAL_API = import.meta.env.VITE_USE_REAL_API === 'true';

// ============================================================
// 认证 API 函数
// ============================================================

/**
 * 用户登录
 */
export const login = async (params: LoginRequest): Promise<AuthResponse> => {
  if (USE_REAL_API) {
    return await authClient.post('/auth/login', params);
  }

  // Mock 登录逻辑
  await new Promise(resolve => setTimeout(resolve, 500));

  if (!params.phone || params.phone.length !== 11) {
    throw new Error('请输入正确的手机号');
  }
  if (!params.password || params.password.length < 6) {
    throw new Error('密码长度不能少于6位');
  }

  const mockUser: User = {
    id: `user_${Date.now()}`,
    phone: params.phone,
    name: params.phone.slice(0, 3) + '****' + params.phone.slice(7),
    role: 'user',
    createdAt: new Date().toISOString(),
  };

  const mockToken = `mock_token_${Date.now()}_${Math.random().toString(36).substring(2, 18)}`;

  return {
    user: mockUser,
    token: mockToken,
  };
};

/**
 * 用户注册
 */
export const register = async (params: RegisterRequest): Promise<AuthResponse> => {
  if (USE_REAL_API) {
    return await authClient.post('/auth/register', params);
  }

  // Mock 注册逻辑
  await new Promise(resolve => setTimeout(resolve, 800));

  if (!params.phone || params.phone.length !== 11) {
    throw new Error('请输入正确的手机号');
  }
  if (!params.password || params.password.length < 6) {
    throw new Error('密码长度不能少于6位');
  }
  if (params.password !== params.confirmPassword) {
    throw new Error('两次输入的密码不一致');
  }

  const mockUser: User = {
    id: `user_${Date.now()}`,
    phone: params.phone,
    email: params.email,
    name: params.name || params.phone.slice(0, 3) + '****' + params.phone.slice(7),
    role: params.role || 'user',
    createdAt: new Date().toISOString(),
  };

  const mockToken = `mock_token_${Date.now()}_${Math.random().toString(36).substring(2, 18)}`;

  return {
    user: mockUser,
    token: mockToken,
  };
};

/**
 * 获取当前用户信息
 */
export const getCurrentUser = async (): Promise<User> => {
  if (USE_REAL_API) {
    return await authClient.get('/auth/me');
  }

  // Mock: 从 localStorage 获取
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    throw new Error('用户信息不存在');
  }

  return JSON.parse(userStr);
};

/**
 * 用户登出
 */
export const logout = async (): Promise<any> => {
  if (USE_REAL_API) {
    return await authClient.post('/auth/logout');
  }

  // 清除本地存储
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * 发送密码重置验证码到邮箱
 */
export const sendResetCode = async (params: SendVerificationCodeRequest): Promise<any> => {
  if (USE_REAL_API) {
    return await authClient.post('/auth/send-reset-code', params);
  }

  // Mock: 模拟发送验证码
  await new Promise(resolve => setTimeout(resolve, 800));

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(params.email)) {
    throw new Error('请输入正确的邮箱格式');
  }

  // Mock: 生成6位验证码并存储
  const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
  localStorage.setItem(`reset_code_${params.email}`, mockCode);
  console.log(`[Mock] 验证码已发送至: ${params.email}, 验证码: ${mockCode}`);
};

/**
 * 使用验证码重置密码
 */
export const resetPasswordWithCode = async (params: ResetPasswordWithCodeRequest): Promise<any> => {
  if (USE_REAL_API) {
    return await authClient.post('/auth/reset-password-with-code', params);
  }

  // Mock: 模拟验证码验证和密码重置
  await new Promise(resolve => setTimeout(resolve, 500));

  const storedCode = localStorage.getItem(`reset_code_${params.email}`);
  if (!storedCode || storedCode !== params.code) {
    throw new Error('验证码错误或已过期');
  }

  if (!params.newPassword || params.newPassword.length < 6) {
    throw new Error('密码长度不能少于6位');
  }

  localStorage.removeItem(`reset_code_${params.email}`);
  console.log(`[Mock] 密码已重置, 邮箱: ${params.email}`);
};

/**
 * 验证验证码是否正确 (用于前端实时验证)
 */
export const verifyResetCode = async (email: string, code: string): Promise<boolean> => {
  if (USE_REAL_API) {
    return await authClient.post('/auth/verify-reset-code', { email, code });
  }

  const storedCode = localStorage.getItem(`reset_code_${email}`);
  return storedCode === code;
};
