import React, { useState } from "react";
import { login } from "../../services/auth";
import { Form, Input, Button, message } from "antd";

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const result = await login({
        phone: values.phone,
        password: values.password,
      });
      if (result.code === 200 && result.data) {
        const userName = result.data.user?.name || values.phone;
        localStorage.setItem("username", userName);
        const userRole = result.data.user?.role || result.data.role;
        localStorage.setItem("role", userRole);
        if (result.data.token) {
          localStorage.setItem("token", result.data.token);
        }
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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400;600&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');

        .login-root {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: url(/src/images/background.png) no-repeat center center fixed;
          background-size: cover;
          padding: 20px;
          position: relative;
          font-family: 'Noto Serif SC', serif;
        }

        .login-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(10, 14, 26, 0.48) 0%,
            rgba(20, 28, 48, 0.32) 50%,
            rgba(10, 14, 26, 0.44) 100%
          );
          backdrop-filter: blur(1px);
          z-index: 0;
        }

        .login-panel {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 420px;
          animation: fadeSlideUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .login-card {
          background: rgba(255, 255, 255, 0.10);
          border: 1px solid rgba(212, 175, 100, 0.35);
          border-radius: 4px;
          padding: 48px 44px 40px;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.08) inset,
            0 32px 80px rgba(0,0,0,0.35),
            0 8px 24px rgba(0,0,0,0.2);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
        }

        .login-brand {
          text-align: center;
          margin-bottom: 36px;
        }

        .login-brand-ornament {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .login-brand-line {
          height: 1px;
          width: 40px;
          background: linear-gradient(90deg, transparent, rgba(212,175,100,0.7));
        }
        .login-brand-line.right {
          background: linear-gradient(90deg, rgba(212,175,100,0.7), transparent);
        }

        .login-brand-diamond {
          width: 6px;
          height: 6px;
          background: #d4af64;
          transform: rotate(45deg);
          flex-shrink: 0;
        }

        .login-title {
          font-family: 'Playfair Display', 'Noto Serif SC', serif;
          font-size: 26px;
          font-weight: 600;
          color: #f5e6c8;
          letter-spacing: 0.06em;
          margin: 0 0 8px;
          line-height: 1.3;
        }

        .login-subtitle {
          font-size: 15px;
          color: #f0d080;
          letter-spacing: 0.18em;
          margin: 0;
          font-weight: 400;
          text-shadow: 0 1px 8px rgba(0,0,0,0.3);
        }

        /* Override Ant Design styles */
        .login-form .ant-form-item {
          margin-bottom: 20px;
        }

        .login-form .ant-form-item-label > label {
          color: #ffffff !important;
          font-size: 14px !important;
          letter-spacing: 0.1em !important;
          font-family: 'Noto Serif SC', serif !important;
          font-weight: 400 !important;
          height: auto !important;
          text-shadow: 0 1px 4px rgba(0,0,0,0.4) !important;
        }

        .login-form .ant-form-item-label > label::before {
          color: #d4af64 !important;
        }

        .login-form .ant-input,
        .login-form .ant-input-password {
          background: rgba(255,255,255,0.14) !important;
          border: 1px solid rgba(212, 175, 100, 0.3) !important;
          border-radius: 2px !important;
          color: #f5e6c8 !important;
          font-family: 'Noto Serif SC', serif !important;
          font-size: 14px !important;
          height: 46px !important;
          padding: 0 16px !important;
          transition: all 0.3s ease !important;
          box-shadow: none !important;
        }

        .login-form .ant-input-password {
          padding: 0 !important;
        }

        .login-form .ant-input-password .ant-input {
          height: 44px !important;
          border: none !important;
          background: transparent !important;
          padding: 0 16px !important;
        }

        .login-form .ant-input-affix-wrapper {
          background: rgba(255,255,255,0.14) !important;
          border: 1px solid rgba(212, 175, 100, 0.3) !important;
          border-radius: 2px !important;
          padding: 0 12px 0 0 !important;
          height: 46px !important;
          display: flex !important;
          align-items: center !important;
        }

        .login-form .ant-input-affix-wrapper .ant-input {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          color: #f5e6c8 !important;
          padding-left: 16px !important;
        }

        .login-form .ant-input::placeholder,
        .login-form .ant-input-affix-wrapper input::placeholder {
          color: rgba(255, 245, 220, 0.6) !important;
          font-size: 14px !important;
        }

        .login-form .ant-input:focus,
        .login-form .ant-input-affix-wrapper:focus,
        .login-form .ant-input-affix-wrapper-focused {
          border-color: rgba(212, 175, 100, 0.6) !important;
          box-shadow: 0 0 0 2px rgba(212,175,100,0.1) !important;
          background: rgba(255,255,255,0.09) !important;
        }

        .login-form .ant-input-suffix .anticon {
          color: rgba(212, 175, 100, 0.5) !important;
        }

        .login-form .ant-form-item-explain-error {
          color: #e8907a !important;
          font-size: 12px !important;
          font-family: 'Noto Serif SC', serif !important;
        }

        .login-btn {
          width: 100% !important;
          height: 48px !important;
          background: linear-gradient(135deg, #c9a84c 0%, #e8c87a 50%, #c9a84c 100%) !important;
          border: none !important;
          border-radius: 2px !important;
          font-family: 'Noto Serif SC', serif !important;
          font-size: 15px !important;
          font-weight: 400 !important;
          letter-spacing: 0.25em !important;
          color: #1a1208 !important;
          cursor: pointer !important;
          transition: all 0.3s ease !important;
          margin-top: 4px !important;
          background-size: 200% 100% !important;
          position: relative !important;
          overflow: hidden !important;
        }

        .login-btn:hover {
          background-position: right center !important;
          box-shadow: 0 4px 20px rgba(212,175,100,0.4) !important;
          transform: translateY(-1px) !important;
          opacity: 0.95 !important;
        }

        .login-btn:active {
          transform: translateY(0) !important;
        }

        .login-btn[disabled],
        .login-btn.ant-btn-loading {
          opacity: 0.7 !important;
          cursor: not-allowed !important;
        }

        .login-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 4px 0 16px;
        }

        .login-divider-line {
          flex: 1;
          height: 1px;
          background: rgba(212,175,100,0.15);
        }

        .login-link-wrap {
          text-align: center;
          padding-top: 4px;
        }

        .login-link {
          color: rgba(212, 175, 100, 0.95) !important;
          font-size: 13px !important;
          letter-spacing: 0.05em !important;
          text-decoration: none !important;
          transition: color 0.2s !important;
          font-family: 'Noto Serif SC', serif !important;
          font-weight: 300 !important;
          border-bottom: 1px solid transparent;
        }

        .login-link:hover {
          color: #e8c87a !important;
          border-bottom-color: rgba(212,175,100,0.4);
        }

        .login-form .ant-form-item:last-child {
          margin-bottom: 0;
        }
      `}</style>

      <div className="login-root">
        <div className="login-panel">
          <div className="login-card">
            <div className="login-brand">
              <div className="login-brand-ornament">
                <div className="login-brand-line"></div>
                <div className="login-brand-diamond"></div>
                <div className="login-brand-line right"></div>
              </div>
              <h1 className="login-title">易宿酒店管理系统</h1>
              <p className="login-subtitle">请登录您的账号</p>
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              className="login-form"
            >
              <Form.Item
                name="phone"
                label="手机号"
                rules={[{ required: true, message: "请输入手机号" }]}
              >
                <Input placeholder="请输入手机号" />
              </Form.Item>

              <Form.Item
                name="password"
                label="密码"
                rules={[{ required: true, message: "请输入密码" }]}
              >
                <Input.Password placeholder="请输入密码" />
              </Form.Item>

              <Form.Item style={{ marginTop: 28 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="login-btn"
                >
                  登　录
                </Button>
              </Form.Item>

              <Form.Item>
                <div className="login-link-wrap">
                  <a href="/register" className="login-link">
                    注册新账号
                  </a>
                </div>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
