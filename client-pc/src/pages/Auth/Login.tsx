import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/auth";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const result = await login({ username, password });
      console.log("登录结果:", result); // 添加调试信息

      if (result.code === 200 && result.data) {
        // 保存token和角色
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("role", result.data.role);
        console.log("保存到localStorage成功"); // 添加调试信息

        // 强制刷新页面
        setTimeout(() => {
          window.location.href = "/"; // 直接跳转到根路径
        }, 1000);
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error("登录出错:", error);
      setError("登录失败，请重试");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: "2rem" }}>
      <h2>登录</h2>
      {error && (
        <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label>用户名：</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>密码：</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>
        <button type="submit" style={{ padding: "0.5rem 1rem" }}>
          登录
        </button>
        <p style={{ marginTop: "1rem" }}>
          还没有账号？<a href="/register">立即注册</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
