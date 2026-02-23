import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../services/auth";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("merchant");
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const navigate = useNavigate();

  // 倒计时效果
  useEffect(() => {
    if (showSuccess && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showSuccess && countdown === 0) {
      window.location.href = "/login";
      // // 倒计时结束，根据角色跳转到对应页面
      // if (role === "admin") {
      //   window.location.href = "/admin/audit";
      // } else {
      //   window.location.href = "/merchant/hotels";
      // }
    }
  }, [showSuccess, countdown, role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const result = await register({ username, password, role });
      console.log("注册结果:", result); // 添加调试信息
      if (result.code === 200) {
        // 保存用户信息到localStorage
        localStorage.setItem("username", username);
        localStorage.setItem("role", role);
        // 如果有token，也保存下来
        if (result.data && result.data.token) {
          localStorage.setItem("token", result.data.token);
        }
        // 显示成功页面
        setShowSuccess(true);
        console.log("设置showSuccess为true"); // 添加调试信息
      } else {
        setError(result.message || "注册失败");
        console.log("注册失败:", result.message); // 添加调试信息
      }
    } catch (error) {
      console.error("注册过程出错:", error); // 添加调试信息
      setError("注册过程中出现错误");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: "2rem" }}>
      {showSuccess ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h2>注册成功</h2>
          <p style={{ fontSize: "1.2rem", marginTop: "1rem" }}>
            即将返回登录页面
          </p>
          <p
            style={{ fontSize: "1.5rem", marginTop: "2rem", color: "#007bff" }}
          >
            {countdown}
          </p>
        </div>
      ) : (
        <>
          <h2>注册</h2>
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
            <div style={{ marginBottom: "1rem" }}>
              <label>角色：</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{ width: "100%", padding: "0.5rem" }}
              >
                <option value="merchant">商户</option>
                <option value="admin">管理员</option>
              </select>
            </div>
            <button type="submit" style={{ padding: "0.5rem 1rem" }}>
              注册
            </button>
            <p style={{ marginTop: "1rem" }}>
              已有账号？<a href="/login">立即登录</a>
            </p>
          </form>
        </>
      )}
    </div>
  );
};

export default Register;
