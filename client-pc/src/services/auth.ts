import api from "./api";
import { DATA_SOURCE } from "./config";
import { readUsers, writeUsers } from "../test-data/dataManager";

// 定义响应类型
interface AuthResponse {
  code: number;
  data?: {
    user: any;
    token: string;
    role: string;
  };
  message: string;
}

// 注册
export const register = async (data: {
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  role: string;
}): Promise<AuthResponse> => {
  // 根据配置选择数据源
  if (DATA_SOURCE === "local") {
    // 本地存储逻辑
    return new Promise<{
      code: number;
      data?: { user: any; token: string; role: string };
      message: string;
    }>((resolve) => {
      setTimeout(() => {
        // 读取用户数据
        const users = readUsers();

        // 检查手机号是否已存在
        const existingUser = users.find(
          (u: { phone: string }) => u.phone === data.phone,
        );
        if (existingUser) {
          resolve({ code: 400, message: "手机号已存在" });
          return;
        }

        // 检查邮箱是否已存在
        const existingEmail = users.find(
          (u: { email: string }) => u.email === data.email,
        );
        if (existingEmail) {
          resolve({ code: 400, message: "邮箱已存在" });
          return;
        }

        // 检查密码是否一致
        if (data.password !== data.confirmPassword) {
          resolve({ code: 400, message: "两次输入的密码不一致" });
          return;
        }

        // 添加新用户
        const newUser = {
          phone: data.phone,
          email: data.email,
          name: data.name,
          password: data.password,
          role: data.role,
        };
        users.push(newUser);

        // 写入数据
        writeUsers(users);

        resolve({
          code: 200,
          data: {
            token: "mock-token",
            role: data.role,
            user: undefined,
          },
          message: "success",
        });
      }, 500);
    });
  } else {
    // 后端API调用
    try {
      const result = (await api.post(
        "/auth/register",
        data,
      )) as unknown as AuthResponse;
      return result;
    } catch (error: any) {
      return {
        code: error.code || 500,
        message: error.message || "服务器错误",
      };
    }
  }
};

// 登录
export const login = async (data: {
  phone: string;
  password: string;
}): Promise<AuthResponse> => {
  // 根据配置选择数据源
  if (DATA_SOURCE === "local") {
    // 本地存储逻辑
    return new Promise<{
      code: number;
      data?: { user: any; token: string; role: string };
      message: string;
    }>((resolve) => {
      setTimeout(() => {
        // 读取用户数据
        const users = readUsers();

        const user = users.find(
          (u: { phone: string; password: string }) =>
            u.phone === data.phone && u.password === data.password,
        );
        if (user) {
          resolve({
            code: 200,
            data: {
              token: "mock-token",
              role: user.role,
              user: user,
            },
            message: "success",
          });
        } else {
          resolve({ code: 400, message: "手机号或密码错误" });
        }
      }, 500);
    });
  } else {
    // 后端API调用
    try {
      const result = (await api.post(
        "/auth/login",
        data,
      )) as unknown as AuthResponse;
      return result;
    } catch (error: any) {
      return {
        code: error.code || 500,
        message: error.message || "服务器错误",
      };
    }
  }
};
