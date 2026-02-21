import api from "./api";
import { DATA_SOURCE } from "./config";
import { readUsers, writeUsers } from "../test-data/dataManager";

// 定义响应类型
interface AuthResponse {
  code: number;
  data?: { token: string; role: string };
  message: string;
}

// 注册
export const register = async (data: {
  username: string;
  password: string;
  role: string;
}): Promise<AuthResponse> => {
  // 根据配置选择数据源
  if (DATA_SOURCE === "local") {
    // 本地存储逻辑
    return new Promise<{
      code: number;
      data?: { token: string; role: string };
      message: string;
    }>((resolve) => {
      setTimeout(() => {
        // 读取用户数据
        const users = readUsers();

        // 检查用户名是否已存在
        const existingUser = users.find(
          (u: { username: string }) => u.username === data.username,
        );
        if (existingUser) {
          resolve({ code: 400, message: "用户名已存在" });
          return;
        }

        // 添加新用户
        const newUser = {
          username: data.username,
          password: data.password,
          role: data.role,
        };
        users.push(newUser);

        // 写入数据
        writeUsers(users);

        resolve({
          code: 200,
          data: { token: "mock-token", role: data.role },
          message: "success",
        });
      }, 500);
    });
  } else {
    // 后端API调用
    try {
      const result = await api.post("/auth/register", data);
      return result.data;
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
  username: string;
  password: string;
}): Promise<AuthResponse> => {
  // 根据配置选择数据源
  if (DATA_SOURCE === "local") {
    // 本地存储逻辑
    return new Promise<{
      code: number;
      data?: { token: string; role: string };
      message: string;
    }>((resolve) => {
      setTimeout(() => {
        // 读取用户数据
        const users = readUsers();

        const user = users.find(
          (u: { username: string; password: string }) =>
            u.username === data.username && u.password === data.password,
        );
        if (user) {
          resolve({
            code: 200,
            data: { token: "mock-token", role: user.role },
            message: "success",
          });
        } else {
          resolve({ code: 400, message: "用户名或密码错误" });
        }
      }, 500);
    });
  } else {
    // 后端API调用
    try {
      const result = await api.post("/auth/login", data);
      return result.data;
    } catch (error: any) {
      return {
        code: error.code || 500,
        message: error.message || "服务器错误",
      };
    }
  }
};
