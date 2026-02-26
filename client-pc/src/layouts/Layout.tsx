import React, { useState } from "react";
import { Layout, Menu } from "antd";
import {
  LogoutOutlined,
  HomeOutlined,
  TableOutlined,
  FileAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400;600&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');

  :root {
    --gold: #c9a84c;
    --gold-light: #e8c87a;
    --gold-dim: rgba(201,168,76,0.15);
    --sider-bg: #14181f;
    --sider-border: rgba(201,168,76,0.12);
    --header-bg: #ffffff;
    --content-bg: #faf8f4;
    --text-primary: #1a1c24;
    --text-secondary: #6b6f7e;
    --border-light: rgba(201,168,76,0.15);
  }

  /* ── 整体布局 ── */
  .aml-layout {
    min-height: 100vh;
    font-family: 'Noto Serif SC', serif;
    background: var(--content-bg);
  }

  /* ── 侧边栏 ── */
  .aml-sider {
    background: var(--sider-bg) !important;
    border-right: 1px solid var(--sider-border) !important;
    position: fixed !important;
    left: 0; top: 0; bottom: 0;
    z-index: 100;
    display: flex;
    flex-direction: column;
  }

  /* Logo 区 */
  .aml-logo {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    border-bottom: 1px solid var(--sider-border);
    padding: 0 20px;
    flex-shrink: 0;
    text-decoration: none;
  }
  .aml-logo-icon {
    width: 32px; height: 32px;
    background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%);
    border-radius: 3px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; flex-shrink: 0;
  }
  .aml-logo-text {
    font-family: 'Playfair Display', 'Noto Serif SC', serif;
    font-size: 17px; font-weight: 600;
    color: #f5e6c8;
    letter-spacing: 0.04em;
    margin: 0;
    white-space: nowrap;
  }
  .aml-logo-dot {
    font-size: 11px; color: var(--gold);
    letter-spacing: 0.15em;
    margin: 0;
    white-space: nowrap;
  }

  /* 角色徽章 */
  .aml-role-badge {
    margin: 16px 16px 8px;
    padding: 10px 14px;
    background: rgba(201,168,76,0.07);
    border: 1px solid var(--sider-border);
    border-radius: 3px;
    display: flex; align-items: center; gap: 10px;
    flex-shrink: 0;
  }
  .aml-role-avatar {
    width: 30px; height: 30px; border-radius: 50%;
    background: linear-gradient(135deg, rgba(201,168,76,0.3) 0%, rgba(232,200,122,0.2) 100%);
    border: 1px solid rgba(201,168,76,0.3);
    display: flex; align-items: center; justify-content: center;
    color: var(--gold); font-size: 13px; flex-shrink: 0;
  }
  .aml-role-name {
    font-size: 13px; color: #f5e6c8; font-weight: 400;
    letter-spacing: 0.04em; white-space: nowrap; overflow: hidden;
    text-overflow: ellipsis; line-height: 1.3;
  }
  .aml-role-label {
    font-size: 11px; color: rgba(201,168,76,0.7);
    letter-spacing: 0.08em; margin-top: 2px;
  }

  /* 菜单分组标题 */
  .aml-menu-section {
    padding: 16px 18px 6px;
    font-size: 10px; letter-spacing: 0.18em;
    color: rgba(245,230,200,0.3);
    font-family: 'Noto Serif SC', serif;
    font-weight: 300;
    flex-shrink: 0;
  }

  /* 菜单覆盖 */
  .aml-menu {
    background: transparent !important;
    border: none !important;
    padding: 0 10px;
    flex: 1;
  }
  .aml-menu .ant-menu-item {
    border-radius: 3px !important;
    margin: 3px 0 !important;
    height: 44px !important;
    line-height: 44px !important;
    color: rgba(245,230,200,0.65) !important;
    font-family: 'Noto Serif SC', serif !important;
    font-size: 14px !important;
    letter-spacing: 0.04em !important;
    transition: all 0.2s !important;
    padding-left: 16px !important;
  }
  .aml-menu .ant-menu-item:hover {
    background: rgba(201,168,76,0.1) !important;
    color: #f0d080 !important;
  }
  .aml-menu .ant-menu-item-selected {
    background: rgba(201,168,76,0.15) !important;
    color: #f0d080 !important;
    border-left: none !important;
  }
  .aml-menu .ant-menu-item-selected::after {
    display: none !important;
  }
  .aml-menu .ant-menu-item-selected::before {
    content: '';
    position: absolute;
    left: 0; top: 8px; bottom: 8px;
    width: 3px;
    background: linear-gradient(180deg, var(--gold) 0%, var(--gold-light) 100%);
    border-radius: 0 2px 2px 0;
  }
  .aml-menu .ant-menu-item .anticon {
    font-size: 15px !important;
    color: inherit !important;
  }

  /* 退出登录按钮 */
  .aml-logout {
    margin: 12px 10px 20px;
    padding: 10px 16px;
    display: flex; align-items: center; gap: 10px;
    border-radius: 3px; cursor: pointer;
    border: 1px solid rgba(192,57,43,0.2);
    color: rgba(220,120,100,0.8);
    font-family: 'Noto Serif SC', serif;
    font-size: 13px; letter-spacing: 0.06em;
    transition: all 0.2s; background: transparent;
    flex-shrink: 0;
  }
  .aml-logout:hover {
    background: rgba(192,57,43,0.08);
    border-color: rgba(192,57,43,0.4);
    color: #e07060;
  }

  /* 侧边栏底部装饰 */
  .aml-sider-foot {
    padding: 12px 18px;
    border-top: 1px solid var(--sider-border);
    flex-shrink: 0;
  }
  .aml-sider-foot-text {
    font-size: 10px; color: rgba(245,230,200,0.2);
    letter-spacing: 0.1em; text-align: center;
    font-family: 'Noto Serif SC', serif;
  }

  /* ── 顶栏 ── */
  .aml-header {
    height: 64px;
    background: var(--header-bg);
    border-bottom: 1px solid rgba(201,168,76,0.15);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 28px 0 32px;
    position: fixed;
    top: 0; right: 0;
    left: 200px;
    z-index: 99;
    box-shadow: 0 1px 12px rgba(0,0,0,0.05);
  }

  /* 面包屑区 */
  .aml-header-left { display: flex; align-items: center; gap: 12px; }
  .aml-breadcrumb-sep { color: rgba(201,168,76,0.4); font-size: 14px; }
  .aml-page-name {
    font-family: 'Playfair Display', 'Noto Serif SC', serif;
    font-size: 15px; font-weight: 600;
    color: var(--text-primary); letter-spacing: 0.04em;
  }
  .aml-center-name {
    font-size: 13px; color: var(--text-secondary);
    letter-spacing: 0.06em;
  }

  /* ── 内容区 ── */
  .aml-content-wrap {
    margin-left: 200px;
    padding-top: 64px;
    min-height: 100vh;
    background: var(--content-bg);
  }
  .aml-content {
    margin: 24px;
    padding: 28px;
    background: var(--content-bg);
    min-height: calc(100vh - 64px - 48px);
  }
`;

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  const menuItems =
    role === "admin"
      ? [
          { key: "/admin/audit", icon: <TableOutlined />, label: "审核管理" },
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

  // 当前页面名称
  const currentMenu = menuItems.find((item) =>
    location.pathname.startsWith(item.key),
  );
  const currentPageName = currentMenu?.label || "";

  const centerName = role === "admin" ? "管理员中心" : "商户中心";
  const roleLabel = role === "admin" ? "管理员" : "商户";

  return (
    <Layout className="aml-layout">
      <style>{STYLES}</style>

      {/* ── 侧边栏 ── */}
      <div className="aml-sider" style={{ width: 200 }}>
        {/* Logo */}
        <div className="aml-logo">
          <div className="aml-logo-icon">🏨</div>
          <div>
            <div className="aml-logo-text">易宿管理</div>
            <div className="aml-logo-dot">YISU · HMS</div>
          </div>
        </div>

        {/* 用户信息 */}
        <div className="aml-role-badge">
          <div className="aml-role-avatar">
            <UserOutlined />
          </div>
          <div style={{ overflow: "hidden" }}>
            <div className="aml-role-name">{username || "用户"}</div>
            <div className="aml-role-label">{roleLabel}账号</div>
          </div>
        </div>

        {/* 菜单标题 */}
        <div className="aml-menu-section">功能导航</div>

        {/* 菜单 */}
        <Menu
          className="aml-menu"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={(e) => navigate(e.key)}
        />

        {/* 弹性空间 */}
        <div style={{ flex: 1 }} />

        {/* 退出登录 */}
        <button className="aml-logout" onClick={handleLogout}>
          <LogoutOutlined style={{ fontSize: 13 }} />
          退出登录
        </button>

        {/* 底部版权 */}
        <div className="aml-sider-foot">
          <div className="aml-sider-foot-text">© 2025 YISU HOTEL MGT</div>
        </div>
      </div>

      {/* ── 主区域 ── */}
      <Layout style={{ marginLeft: 200 }}>
        {/* 顶栏 */}
        <div className="aml-header">
          <div className="aml-header-left">
            <span className="aml-center-name">{centerName}</span>
            {currentPageName && (
              <>
                <span className="aml-breadcrumb-sep">›</span>
                <span className="aml-page-name">{currentPageName}</span>
              </>
            )}
          </div>

          <div />
        </div>

        {/* 内容 */}
        <div style={{ paddingTop: 64 }}>
          <div className="aml-content">{children}</div>
        </div>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
