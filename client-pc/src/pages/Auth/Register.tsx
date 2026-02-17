import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../services/auth";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("merchant");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await register({ username, password, role });
    if (result.code === 200 && result.data) {
      // 保存token和角色
      localStorage.setItem("token", result.data.token);
      localStorage.setItem("role", result.data.role);

      // 根据角色跳转
      if (result.data.role === "merchant") {
        navigate("/merchant");
      } else {
        navigate("/admin/audit");
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: "2rem" }}>
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
    </div>
  );
};

export default Register;
