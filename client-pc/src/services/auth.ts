import api from "./api";
import { mockUsers } from "../mock/user";

// 注册
export const register = async (data: {
  username: string;
  password: string;
  role: string;
}) => {
  // 模拟API调用
  return new Promise<{
    code: number;
    data?: { token: string; role: string };
    message: string;
  }>((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: { token: "mock-token", role: data.role },
        message: "success",
      });
    }, 500);
  });
  // 实际API调用
  // return api.post('/auth/register', data);
};

// 登录
export const login = async (data: { username: string; password: string }) => {
  // 模拟API调用
  return new Promise<{
    code: number;
    data?: { token: string; role: string };
    message: string;
  }>((resolve) => {
    setTimeout(() => {
      const user = mockUsers.find(
        (u) => u.username === data.username && u.password === data.password,
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
  // 实际API调用
  // return api.post('/auth/login', data);
};
