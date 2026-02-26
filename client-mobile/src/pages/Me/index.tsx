import React from 'react';
import { useTranslation } from 'react-i18next';
import { List, NavBar, Button, Toast } from 'antd-mobile';
import { Settings, Globe, HelpCircle, LogOut, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Me: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  const handleLanguageSwitch = () => {
    const newLang = i18n.language === 'en' ? 'zh' : 'en';
    i18n.changeLanguage(newLang);
    Toast.show({
      content: newLang === 'en' ? 'Switched to English' : '已切换至中文',
      icon: 'success',
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
      Toast.show({
        content: '已退出登录',
        icon: 'success',
      });
    } catch (error) {
      Toast.show({
        content: '退出失败，请稍后重试',
        icon: 'fail',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen pb-20 flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <NavBar backArrow={false}>{t('me.title')}</NavBar>

      {/* User Info Card */}
      <div className="bg-white p-6 flex flex-col items-center justify-center mb-4">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
          {user?.avatar ? (
            <img src={user.avatar} alt="avatar" className="w-20 h-20 rounded-full object-cover" />
          ) : (
            <UserIcon size={40} className="text-blue-500" />
          )}
        </div>
        <h2 className="mt-4 text-xl font-bold text-gray-900">
          {user?.name || '未登录'}
        </h2>
        {user?.phone && (
          <p className="text-gray-500 text-sm mt-1">{user.phone}</p>
        )}
        {!isAuthenticated && (
          <Button
            color='primary'
            fill='outline'
            size='small'
            className="mt-3"
            onClick={() => navigate('/login')}
          >
            {t('me.login_btn')}
          </Button>
        )}
      </div>

      {/* Settings List */}
      <List header={t('me.general')} className="mb-4">
        <List.Item
          prefix={<Globe size={20} className="text-blue-500" />}
          onClick={handleLanguageSwitch}
          extra={i18n.language === 'en' ? 'English' : '中文'}
        >
          {t('me.language')}
        </List.Item>
      </List>

      <List header={t('me.about')}>
        <List.Item
          prefix={<HelpCircle size={20} className="text-gray-500" />}
          onClick={() => navigate('/about')}
        >
          {t('me.about')}
        </List.Item>
        <List.Item extra="v1.0.0">
          {t('me.version')}
        </List.Item>
      </List>

      {isAuthenticated && (
        <div className="p-4 mt-4">
          <Button block color='danger' onClick={handleLogout}>
            <LogOut size={18} className="mr-2 inline" />
            {t('me.logout')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Me;
