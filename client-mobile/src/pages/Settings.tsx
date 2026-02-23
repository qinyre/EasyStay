import React, { useState } from 'react';
import { NavBar, List, Toast, Switch, Modal } from 'antd-mobile';
import {
  Bell,
  Lock,
  Eye,
  Trash2,
  ChevronRight,
  Moon,
  MessageCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const Settings: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // 状态设置
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handlePushChange = (value: boolean) => {
    setPushEnabled(value);
    Toast.show({
      content: value ? '推送通知已开启' : '推送通知已关闭',
      icon: 'success',
    });
  };

  const handleEmailChange = (value: boolean) => {
    setEmailEnabled(value);
    Toast.show({
      content: value ? '邮件通知已开启' : '邮件通知已关闭',
      icon: 'success',
    });
  };

  const handleDarkModeChange = (value: boolean) => {
    setDarkMode(value);
    Toast.show({
      content: value ? '深色模式已开启' : '深色模式已关闭',
      icon: 'success',
    });
  };

  const handleClearCache = () => {
    Modal.confirm({
      content: '确定要清除缓存吗？这将删除所有离线数据。',
      onConfirm: async () => {
        // 清除 localStorage 中的缓存数据
        const keysToKeep = ['token', 'user'];
        const allKeys = Object.keys(localStorage);
        allKeys.forEach(key => {
          if (!keysToKeep.includes(key)) {
            localStorage.removeItem(key);
          }
        });

        Toast.show({
          content: '缓存已清除',
          icon: 'success',
        });
      },
    });
  };

  const handleDeleteAccount = () => {
    Modal.confirm({
      content: '确定要删除账号吗？此操作不可恢复，所有数据将被永久删除。',
      onConfirm: async () => {
        try {
          await logout();
          Toast.show({
            content: '账号已删除',
            icon: 'success',
          });
          navigate('/');
        } catch {
          Toast.show({
            content: '删除失败，请稍后重试',
            icon: 'fail',
          });
        }
      },
    });
  };

  const handleLogout = async () => {
    Modal.confirm({
      content: '确定要退出登录吗？',
      onConfirm: async () => {
        try {
          await logout();
          Toast.show({
            content: '已退出登录',
            icon: 'success',
          });
          navigate('/');
        } catch {
          Toast.show({
            content: '退出失败，请稍后重试',
            icon: 'fail',
          });
        }
      },
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar onBack={() => navigate(-1)}>{t('settings.title')}</NavBar>

      {/* 通知设置 */}
      <List header="通知设置">
        <List.Item
          prefix={<Bell size={20} className="text-blue-500" />}
          extra={
            <Switch
              checked={pushEnabled}
              onChange={handlePushChange}
            />
          }
        >
          推送通知
        </List.Item>
        <List.Item
          prefix={<MessageCircle size={20} className="text-green-500" />}
          extra={
            <Switch
              checked={emailEnabled}
              onChange={handleEmailChange}
            />
          }
        >
          邮件通知
        </List.Item>
      </List>

      {/* 显示设置 */}
      <List header="显示设置">
        <List.Item
          prefix={<Moon size={20} className="text-purple-500" />}
          extra={
            <Switch
              checked={darkMode}
              onChange={handleDarkModeChange}
            />
          }
        >
          深色模式
        </List.Item>
      </List>

      {/* 账号安全 */}
      <List header="账号安全">
        <List.Item
          prefix={<Lock size={20} className="text-orange-500" />}
          onClick={() => navigate('/forgot-password')}
          extra={<ChevronRight size={18} className="text-gray-400" />}
        >
          修改密码
        </List.Item>
        <List.Item
          prefix={<Eye size={20} className="text-cyan-500" />}
          onClick={() => {
            Toast.show({ content: '隐私设置功能开发中', icon: 'fail' });
          }}
          extra={<ChevronRight size={18} className="text-gray-400" />}
        >
          隐私设置
        </List.Item>
      </List>

      {/* 数据管理 */}
      <List header="数据管理">
        <List.Item
          prefix={<Trash2 size={20} className="text-red-500" />}
          onClick={handleClearCache}
        >
          清除缓存
        </List.Item>
      </List>

      {/* 危险操作 */}
      <List header="危险操作" className="mb-6">
        <List.Item
          onClick={handleDeleteAccount}
          className="text-red-500"
        >
          删除账号
        </List.Item>
      </List>

      {/* 退出登录按钮 */}
      {user && (
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full py-3 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium active:bg-gray-50"
          >
            退出登录
          </button>
        </div>
      )}

      {/* 版本信息 */}
      <div className="text-center text-xs text-gray-400 py-4">
        EasyStay v1.0.0
      </div>
    </div>
  );
};

export default Settings;
