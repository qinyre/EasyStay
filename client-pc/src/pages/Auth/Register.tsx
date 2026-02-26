import React, { useState, useEffect } from "react";
import { register } from "../../services/auth";
import { Form, Input, Select, Button, message, Typography } from "antd";

const Register: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [role, setRole] = useState("merchant");

  useEffect(() => {
    if (showSuccess && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showSuccess && countdown === 0) {
      window.location.href = "/login";
    }
  }, [showSuccess, countdown, role]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    setRole(values.role);
    try {
      const result = await register({
        phone: values.phone,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        name: values.name,
        role: values.role,
      });
      if (result.code === 200) {
        const userName = result.data?.user?.name || values.name || values.phone;
        localStorage.setItem("username", userName);
        localStorage.setItem("role", values.role);
        if (result.data && result.data.token) {
          localStorage.setItem("token", result.data.token);
        }
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

  const sharedStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400;600&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');

    .reg-root {
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

    .reg-root::before {
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

    .reg-panel {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 460px;
      animation: fadeSlideUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
    }

    @keyframes fadeSlideUp {
      from { opacity: 0; transform: translateY(32px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .reg-card {
      background: rgba(255, 255, 255, 0.16);
      border: 1px solid rgba(212, 175, 100, 0.35);
      border-radius: 4px;
      padding: 44px 44px 36px;
      box-shadow:
        0 0 0 1px rgba(255,255,255,0.08) inset,
        0 32px 80px rgba(0,0,0,0.35),
        0 8px 24px rgba(0,0,0,0.2);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
    }

    .reg-brand {
      text-align: center;
      margin-bottom: 30px;
    }

    .reg-brand-ornament {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 14px;
    }

    .reg-brand-line {
      height: 1px;
      width: 40px;
      background: linear-gradient(90deg, transparent, rgba(212,175,100,0.7));
    }
    .reg-brand-line.right {
      background: linear-gradient(90deg, rgba(212,175,100,0.7), transparent);
    }

    .reg-brand-diamond {
      width: 6px;
      height: 6px;
      background: #d4af64;
      transform: rotate(45deg);
      flex-shrink: 0;
    }

    .reg-title {
      font-family: 'Playfair Display', 'Noto Serif SC', serif;
      font-size: 24px;
      font-weight: 600;
      color: #f5e6c8;
      letter-spacing: 0.06em;
      margin: 0 0 8px;
      line-height: 1.3;
    }

    .reg-subtitle {
      font-size: 15px;
      color: #f0d080;
      letter-spacing: 0.18em;
      margin: 0;
      font-weight: 400;
      text-shadow: 0 1px 8px rgba(0,0,0,0.3);
    }

    .reg-form .ant-form-item {
      margin-bottom: 16px;
    }

    .reg-form .ant-form-item-label > label {
      color: #ffffff !important;
      font-size: 14px !important;
      letter-spacing: 0.1em !important;
      font-family: 'Noto Serif SC', serif !important;
      font-weight: 400 !important;
      height: auto !important;
      text-shadow: 0 1px 4px rgba(0,0,0,0.4) !important;
    }

    .reg-form .ant-form-item-label > label::before {
      color: #d4af64 !important;
    }

    .reg-form .ant-input {
      background: rgba(255,255,255,0.14) !important;
      border: 1px solid rgba(212, 175, 100, 0.3) !important;
      border-radius: 2px !important;
      color: #f5e6c8 !important;
      font-family: 'Noto Serif SC', serif !important;
      font-size: 14px !important;
      height: 44px !important;
      padding: 0 16px !important;
      transition: all 0.3s ease !important;
      box-shadow: none !important;
    }

    .reg-form .ant-input-affix-wrapper {
      background: rgba(255,255,255,0.14) !important;
      border: 1px solid rgba(212, 175, 100, 0.3) !important;
      border-radius: 2px !important;
      padding: 0 12px 0 0 !important;
      height: 44px !important;
      display: flex !important;
      align-items: center !important;
    }

    .reg-form .ant-input-affix-wrapper .ant-input {
      background: transparent !important;
      border: none !important;
      box-shadow: none !important;
      color: #f5e6c8 !important;
      padding-left: 16px !important;
      height: 42px !important;
    }

    .reg-form .ant-input::placeholder,
    .reg-form .ant-input-affix-wrapper input::placeholder {
      color: rgba(255, 245, 220, 0.6) !important;
      font-size: 14px !important;
    }

    .reg-form .ant-input:focus,
    .reg-form .ant-input-affix-wrapper-focused {
      border-color: rgba(212, 175, 100, 0.6) !important;
      box-shadow: 0 0 0 2px rgba(212,175,100,0.1) !important;
      background: rgba(255,255,255,0.09) !important;
    }

    .reg-form .ant-input-suffix .anticon {
      color: rgba(212, 175, 100, 0.5) !important;
    }

    .reg-form .ant-select .ant-select-selector,
    .reg-form .ant-select-single:not(.ant-select-customize-input) .ant-select-selector,
    .reg-form .ant-select-show-arrow .ant-select-selector {
      background: rgba(255,255,255,0.14) !important;
      background-color: rgba(255,255,255,0.14) !important;
      border: 1px solid rgba(212, 175, 100, 0.3) !important;
      border-radius: 2px !important;
      color: #f5e6c8 !important;
      font-family: 'Noto Serif SC', serif !important;
      font-size: 14px !important;
      height: 44px !important;
      display: flex !important;
      align-items: center !important;
      padding: 0 16px !important;
      transition: all 0.3s ease !important;
      box-shadow: none !important;
    }

    .reg-form .ant-select .ant-select-selection-item {
      color: #f5e6c8 !important;
      font-family: 'Noto Serif SC', serif !important;
      font-size: 14px !important;
      line-height: 44px !important;
    }

    .reg-form .ant-select .ant-select-selection-placeholder {
      color: rgba(255, 245, 220, 0.5) !important;
      line-height: 44px !important;
    }

    .reg-form .ant-select-focused .ant-select-selector,
    .reg-form .ant-select-open .ant-select-selector {
      border-color: rgba(212, 175, 100, 0.6) !important;
      box-shadow: 0 0 0 2px rgba(212,175,100,0.1) !important;
      background-color: rgba(255,255,255,0.18) !important;
    }

    .reg-form .ant-select-arrow {
      color: rgba(212, 175, 100, 0.8) !important;
    }

    /* Dropdown popup */
    .reg-select-dropdown {
      background: rgba(28, 32, 46, 0.92) !important;
      border: 1px solid rgba(212, 175, 100, 0.3) !important;
      border-radius: 2px !important;
      backdrop-filter: blur(20px) !important;
      -webkit-backdrop-filter: blur(20px) !important;
      box-shadow: 0 8px 32px rgba(0,0,0,0.45) !important;
      padding: 4px 0 !important;
    }

    .reg-select-dropdown .ant-select-item {
      color: rgba(245, 230, 200, 0.85) !important;
      font-family: 'Noto Serif SC', serif !important;
      font-size: 14px !important;
      padding: 10px 16px !important;
      transition: all 0.2s !important;
      border-radius: 0 !important;
    }

    .reg-select-dropdown .ant-select-item:hover,
    .reg-select-dropdown .ant-select-item-option-active {
      background: rgba(212, 175, 100, 0.15) !important;
      color: #f0d080 !important;
    }

    .reg-select-dropdown .ant-select-item-option-selected {
      background: rgba(212, 175, 100, 0.2) !important;
      color: #f0d080 !important;
      font-weight: 400 !important;
    }

    .reg-select-dropdown .ant-select-item-option-selected::after {
      color: #d4af64 !important;
    }

    .reg-form .ant-form-item-explain-error {
      color: #e8907a !important;
      font-size: 12px !important;
      font-family: 'Noto Serif SC', serif !important;
    }

    .reg-btn {
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
      margin-top: 8px !important;
    }

    .reg-btn:hover {
      box-shadow: 0 4px 20px rgba(212,175,100,0.4) !important;
      transform: translateY(-1px) !important;
      opacity: 0.95 !important;
    }

    .reg-btn:active {
      transform: translateY(0) !important;
    }

    .reg-link-wrap {
      text-align: center;
      padding-top: 4px;
    }

    .reg-link {
      color: rgba(212, 175, 100, 0.95) !important;
      font-size: 13px !important;
      letter-spacing: 0.05em !important;
      text-decoration: none !important;
      transition: color 0.2s !important;
      font-family: 'Noto Serif SC', serif !important;
      font-weight: 300 !important;
      border-bottom: 1px solid transparent;
    }

    .reg-link:hover {
      color: #e8c87a !important;
      border-bottom-color: rgba(212,175,100,0.4);
    }

    .reg-form .ant-form-item:last-child {
      margin-bottom: 0;
    }

    /* Success page */
    .reg-success-icon {
      width: 64px;
      height: 64px;
      border: 2px solid #d4af64;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      animation: scaleIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
    }

    @keyframes scaleIn {
      from { transform: scale(0); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }

    .reg-success-title {
      font-family: 'Playfair Display', 'Noto Serif SC', serif;
      font-size: 22px;
      color: #f5e6c8;
      letter-spacing: 0.08em;
      margin: 0 0 12px;
    }

    .reg-success-text {
      color: rgba(245,230,200,0.6);
      font-size: 13px;
      letter-spacing: 0.05em;
      margin: 0 0 28px;
    }

    .reg-countdown {
      width: 60px;
      height: 60px;
      border: 1.5px solid rgba(212,175,100,0.4);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
      font-family: 'Playfair Display', serif;
      font-size: 28px;
      color: #d4af64;
    }
  `;

  if (showSuccess) {
    return (
      <>
        <style>{sharedStyles}</style>
        <div className="reg-root">
          <div className="reg-panel">
            <div
              className="reg-card"
              style={{ textAlign: "center", padding: "56px 44px" }}
            >
              <div className="reg-success-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <polyline
                    points="20 6 9 17 4 12"
                    stroke="#d4af64"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h2 className="reg-success-title">注册成功</h2>
              <p className="reg-success-text">即将返回登录页面</p>
              <div className="reg-countdown">{countdown}</div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{sharedStyles}</style>
      <div className="reg-root">
        <div className="reg-panel">
          <div className="reg-card">
            <div className="reg-brand">
              <div className="reg-brand-ornament">
                <div className="reg-brand-line"></div>
                <div className="reg-brand-diamond"></div>
                <div className="reg-brand-line right"></div>
              </div>
              <h1 className="reg-title">易宿酒店管理系统</h1>
              <p className="reg-subtitle">注册新账号</p>
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              className="reg-form"
            >
              <Form.Item
                name="phone"
                label="手机号"
                rules={[{ required: true, message: "请输入手机号" }]}
              >
                <Input placeholder="请输入手机号" />
              </Form.Item>

              <Form.Item
                name="email"
                label="邮箱"
                rules={[{ required: true, message: "请输入邮箱" }]}
              >
                <Input placeholder="请输入邮箱" />
              </Form.Item>

              <Form.Item
                name="name"
                label="用户名"
                rules={[{ required: true, message: "请输入用户名" }]}
              >
                <Input placeholder="请输入用户名" />
              </Form.Item>

              <Form.Item
                name="password"
                label="密码"
                rules={[{ required: true, message: "请输入密码" }]}
              >
                <Input.Password placeholder="请输入密码" />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="确认密码"
                rules={[{ required: true, message: "请确认密码" }]}
              >
                <Input.Password placeholder="请再次输入密码" />
              </Form.Item>

              <Form.Item
                name="role"
                label="角色"
                rules={[{ required: true, message: "请选择角色" }]}
                initialValue="merchant"
              >
                <select
                  defaultValue="merchant"
                  onChange={(e) => form.setFieldValue("role", e.target.value)}
                  style={{
                    width: "100%",
                    height: "44px",
                    background: "rgba(255,255,255,0.14)",
                    border: "1px solid rgba(212,175,100,0.3)",
                    borderRadius: "2px",
                    color: "#f5e6c8",
                    fontFamily: "'Noto Serif SC', serif",
                    fontSize: "14px",
                    padding: "0 16px",
                    outline: "none",
                    cursor: "pointer",
                    appearance: "none",
                    WebkitAppearance: "none",
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23d4af64' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 14px center",
                    transition: "all 0.3s ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(212,175,100,0.6)";
                    e.target.style.boxShadow =
                      "0 0 0 2px rgba(212,175,100,0.1)";
                    e.target.style.background = "rgba(255,255,255,0.18)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(212,175,100,0.3)";
                    e.target.style.boxShadow = "none";
                    e.target.style.background = "rgba(255,255,255,0.14)";
                  }}
                >
                  <option
                    value="merchant"
                    style={{ background: "rgb(28,32,46)", color: "#f5e6c8" }}
                  >
                    商户
                  </option>
                  <option
                    value="admin"
                    style={{ background: "rgb(28,32,46)", color: "#f5e6c8" }}
                  >
                    管理员
                  </option>
                </select>
              </Form.Item>

              <Form.Item style={{ marginTop: 24 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="reg-btn"
                >
                  注　册
                </Button>
              </Form.Item>

              <Form.Item>
                <div className="reg-link-wrap">
                  <a href="/login" className="reg-link">
                    已有账号？立即登录
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

export default Register;
