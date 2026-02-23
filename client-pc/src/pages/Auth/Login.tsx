import React, { useState } from "react";
import { login } from "../../services/auth";
import { Card, Form, Input, Button, message, Typography } from "antd";

const { Title } = Typography;

const Login: React.FC = () => {
  const [form] = Form.useForm(); // 添加这一行
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const result = await login({
        username: values.username,
        password: values.password,
      });
      if (result.code === 200 && result.data) {
        localStorage.setItem("username", values.username);
        localStorage.setItem("role", result.data.role);
        if (result.data.token) {
          localStorage.setItem("token", result.data.token);
        }
        // 使用window.location.href确保跳转成功
        if (result.data.role === "admin") {
          window.location.href = "/admin/audit";
        } else {
          window.location.href = "/merchant/hotels";
        }
      } else {
        message.error(result.message || "登录失败");
      }
    } catch (error) {
      message.error("登录过程中出现错误");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card
        title={
          <div className="text-center">
            <Title level={3} style={{ margin: 0 }}>
              易宿酒店管理系统
            </Title>
            <p className="text-gray-500">请登录您的账号</p>
          </div>
        }
        style={{ width: 400 }}
        className="shadow-lg"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input placeholder="请输入用户名" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password placeholder="请输入密码" size="large" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              style={{ width: "100%" }}
              loading={loading}
            >
              登录
            </Button>
          </Form.Item>

          <Form.Item>
            <div className="text-center">
              <a href="/register" className="text-blue-500">
                注册新账号
              </a>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
