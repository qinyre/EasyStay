import React, { useState, useEffect } from "react";
import { register } from "../../services/auth";
import { Card, Form, Input, Select, Button, message, Typography } from "antd";

const { Title } = Typography;

const Register: React.FC = () => {
  const [form] = Form.useForm(); // 添加这一行
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [role, setRole] = useState("merchant");

  // 倒计时效果
  useEffect(() => {
    if (showSuccess && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showSuccess && countdown === 0) {
      // 倒计时结束，跳转到对应页面
      if (role === "admin") {
        window.location.href = "/admin/audit";
      } else {
        window.location.href = "/merchant/hotels";
      }
    }
  }, [showSuccess, countdown, role]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    setRole(values.role);
    try {
      const result = await register({
        username: values.username,
        password: values.password,
        role: values.role,
      });
      if (result.code === 200) {
        // 保存用户信息到localStorage
        localStorage.setItem("username", values.username);
        localStorage.setItem("role", values.role);
        if (result.data && result.data.token) {
          localStorage.setItem("token", result.data.token);
        }
        // 显示成功页面
        setShowSuccess(true);
      } else {
        message.error(result.message || "注册失败");
      }
    } catch (error) {
      message.error("注册过程中出现错误");
    } finally {
      setLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card style={{ width: 400, textAlign: "center" }} className="shadow-lg">
          <Title level={3} style={{ color: "#52c41a" }}>
            注册成功
          </Title>
          <p className="text-lg mt-4">
            即将进入{role === "admin" ? "管理员" : "商户"}页面
          </p>
          <p className="text-2xl mt-8 text-blue-500">{countdown}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card
        title={
          <div className="text-center">
            <Title level={3} style={{ margin: 0 }}>
              易宿酒店管理系统
            </Title>
            <p className="text-gray-500">注册新账号</p>
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

          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: "请选择角色" }]}
            initialValue="merchant"
          >
            <Select size="large">
              <Select.Option value="merchant">商户</Select.Option>
              <Select.Option value="admin">管理员</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              style={{ width: "100%" }}
              loading={loading}
            >
              注册
            </Button>
          </Form.Item>

          <Form.Item>
            <div className="text-center">
              <a href="/login" className="text-blue-500">
                已有账号？立即登录
              </a>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
