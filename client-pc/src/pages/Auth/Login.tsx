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
        phone: values.phone,
        password: values.password,
      });
      if (result.code === 200 && result.data) {
        // 存储用户名（优先使用真实用户名，否则使用手机号）
        const userName = result.data.user?.name || values.phone;
        localStorage.setItem("username", userName);
        const userRole = result.data.user?.role || result.data.role;
        localStorage.setItem("role", userRole);
        if (result.data.token) {
          localStorage.setItem("token", result.data.token);
        }
        // 使用window.location.href确保跳转成功
        if (userRole === "admin") {
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
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "url(/src/images/background.png) no-repeat center center fixed" /* 替换为你的背景图片路径 */,
        backgroundSize: "cover",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
        }}
      >
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
                请登录您的账号
              </p>
            </div>
          }
          className="shadow-xl rounded-lg overflow-hidden"
          style={{ width: "100%" }}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              name="phone"
              label="手机号"
              rules={[{ required: true, message: "请输入手机号" }]}
            >
              <Input placeholder="请输入手机号" size="large" />
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
                style={{ width: "100%", height: 48, fontSize: 16 }}
                loading={loading}
              >
                登录
              </Button>
            </Form.Item>

            <Form.Item>
              <div className="text-center">
                <a
                  href="/register"
                  className="text-blue-500 hover:text-blue-700 font-medium"
                >
                  注册新账号
                </a>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
