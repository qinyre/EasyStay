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
      window.location.href = "/login"; // 倒计时结束，跳转到登录页面
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
      <div
        style={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #e3f2fd 0%, #f5f5f5 100%)",
          padding: "20px",
        }}
      >
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <Card
            style={{ width: "100%", textAlign: "center" }}
            className="shadow-xl rounded-lg"
          >
            <Title level={2} style={{ color: "#52c41a", textAlign: "center" }}>
              注册成功
            </Title>
            <p className="text-lg mt-4" style={{ textAlign: "center" }}>
              即将返回登录页面
            </p>
            <p
              className="text-3xl mt-8 text-blue-500 font-bold"
              style={{ textAlign: "center" }}
            >
              {countdown}
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #e3f2fd 0%, #f5f5f5 100%)",
        padding: "20px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <Card
          title={
            <div style={{ textAlign: "center" }}>
              <Title
                level={2}
                style={{
                  margin: "0 auto",
                  color: "#1890ff",
                  textAlign: "center",
                }}
              >
                易宿酒店管理系统
              </Title>
              <p className="text-gray-500 mt-2" style={{ textAlign: "center" }}>
                注册新账号
              </p>
            </div>
          }
          className="shadow-xl rounded-lg overflow-hidden"
          style={{ width: "100%" }}
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
                style={{ width: "100%", height: 48, fontSize: 16 }}
                loading={loading}
              >
                注册
              </Button>
            </Form.Item>

            <Form.Item>
              <div className="text-center">
                <a
                  href="/login"
                  className="text-blue-500 hover:text-blue-700 font-medium"
                >
                  已有账号？立即登录
                </a>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Register;
