import React from "react";
import { Layout, Menu, Button } from "antd";
import {
  LogoutOutlined,
  HomeOutlined,
  TableOutlined,
  FileAddOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  const menuItems =
    role === "admin"
      ? [
          {
            key: "/admin/audit",
            icon: <TableOutlined />,
            label: "审核管理",
          },
          {
            key: "/admin/publish",
            icon: <HomeOutlined />,
            label: "上下线管理",
          },
        ]
      : [
          {
            key: "/merchant/hotels",
            icon: <HomeOutlined />,
            label: "我的酒店",
          },
          {
            key: "/merchant/add",
            icon: <FileAddOutlined />,
            label: "添加酒店",
          },
        ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider theme="light">
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <h1 style={{ fontSize: 18, margin: 0, color: "#1890ff" }}>
            易宿管理
          </h1>
        </div>
        <Menu
          theme="light"
          mode="inline"
          items={menuItems}
          onClick={(e) => navigate(e.key)}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#fff",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <div style={{ fontSize: 16, fontWeight: "bold" }}>
            {role === "admin" ? "管理员中心" : "商户中心"}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span>{username}</span>
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              退出登录
            </Button>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px",
            padding: 24,
            background: "white",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.09)",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
