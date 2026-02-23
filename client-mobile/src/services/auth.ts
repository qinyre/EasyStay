import { AuthResponse, LoginRequest, RegisterRequest, User, SendVerificationCodeRequest, ResetPasswordWithCodeRequest } from '../types';

// ============================================================
// 纯 Mock 模式 - 不连接后端 API
// ============================================================

/**
 * 用户登录
 */
export const login = async (params: LoginRequest): Promise<AuthResponse> => {
  // Mock 登录逻辑
  await new Promise(resolve => setTimeout(resolve, 500));

  // 简单验证：手机号11位，密码不少于6位
  if (!params.phone || params.phone.length !== 11) {
    throw new Error('请输入正确的手机号');
  }
  if (!params.password || params.password.length < 6) {
    throw new Error('密码长度不能少于6位');
  }

  // 模拟生成用户数据
  const mockUser: User = {
    id: `user_${Date.now()}`,
    phone: params.phone,
    name: params.phone.slice(0, 3) + '****' + params.phone.slice(7),
    role: 'user',
    createdAt: new Date().toISOString(),
  };

  const mockToken = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;

  return {
    user: mockUser,
    token: mockToken,
  };
};

/**
 * 用户注册
 */
export const register = async (params: RegisterRequest): Promise<AuthResponse> => {
  // Mock 注册逻辑
  await new Promise(resolve => setTimeout(resolve, 800));

  // 验证
  if (!params.phone || params.phone.length !== 11) {
    throw new Error('请输入正确的手机号');
  }
  if (!params.password || params.password.length < 6) {
    throw new Error('密码长度不能少于6位');
  }
  if (params.password !== params.confirmPassword) {
    throw new Error('两次输入的密码不一致');
  }

  // 模拟生成用户数据
  const mockUser: User = {
    id: `user_${Date.now()}`,
    phone: params.phone,
    email: params.email,
    name: params.name || params.phone.slice(0, 3) + '****' + params.phone.slice(7),
    role: params.role || 'user',
    createdAt: new Date().toISOString(),
  };

  const mockToken = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;

  return {
    user: mockUser,
    token: mockToken,
  };
};

/**
 * 获取当前用户信息
 */
export const getCurrentUser = async (): Promise<User> => {
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
export const logout = async (): Promise<void> => {
  // 清除本地存储
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * 发送密码重置验证码到邮箱
 */
export const sendResetCode = async (params: SendVerificationCodeRequest): Promise<void> => {
  // Mock: 模拟发送验证码
  await new Promise(resolve => setTimeout(resolve, 800));

  // 验证邮箱格式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(params.email)) {
    throw new Error('请输入正确的邮箱格式');
  }

  // Mock: 生成6位验证码并存储到 localStorage (仅用于测试)
  const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
  localStorage.setItem(`reset_code_${params.email}`, mockCode);
  console.log(`[Mock] 验证码已发送至: ${params.email}, 验证码: ${mockCode}`);
};

/**
 * 使用验证码重置密码
 */
export const resetPasswordWithCode = async (params: ResetPasswordWithCodeRequest): Promise<void> => {
  // Mock: 模拟验证码验证和密码重置
  await new Promise(resolve => setTimeout(resolve, 500));

  // 验证码验证
  const storedCode = localStorage.getItem(`reset_code_${params.email}`);
  if (!storedCode || storedCode !== params.code) {
    throw new Error('验证码错误或已过期');
  }

  // 验证密码
  if (!params.newPassword || params.newPassword.length < 6) {
    throw new Error('密码长度不能少于6位');
  }

  // 清除已使用的验证码
  localStorage.removeItem(`reset_code_${params.email}`);

  console.log(`[Mock] 密码已重置, 邮箱: ${params.email}`);
};

/**
 * 验证验证码是否正确 (用于前端实时验证)
 */
export const verifyResetCode = async (email: string, code: string): Promise<boolean> => {
  // Mock: 从 localStorage 验证
  const storedCode = localStorage.getItem(`reset_code_${email}`);
  return storedCode === code;
};
