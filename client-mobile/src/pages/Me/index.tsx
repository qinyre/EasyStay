import React from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, List, NavBar, Button, Toast } from 'antd-mobile';
import { Settings, Globe, HelpCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Me: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // Mock user state
  const user = {
    name: 'Guest User',
    avatar: '',
    isLoggedIn: false
  };

  const handleLanguageSwitch = () => {
    const newLang = i18n.language === 'en' ? 'zh' : 'en';
    i18n.changeLanguage(newLang);
    Toast.show({
      content: newLang === 'en' ? 'Switched to English' : '已切换至中文',
      icon: 'success',
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <NavBar backArrow={false}>{t('me.title')}</NavBar>
      
      {/* User Info Card */}
      <div className="bg-white p-6 flex flex-col items-center justify-center mb-4">
        <Avatar src={user.avatar} style={{ '--size': '80px', '--border-radius': '50%' }} />
        <h2 className="mt-4 text-xl font-bold text-gray-900">{user.name}</h2>
        {!user.isLoggedIn && (
            <Button 
                color='primary' 
                fill='outline' 
                size='small' 
                className="mt-2"
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
        <List.Item 
            prefix={<Settings size={20} className="text-gray-500" />} 
            onClick={() => {}}
        >
            {t('me.settings')}
        </List.Item>
      </List>

      <List header={t('me.about')}>
        <List.Item 
            prefix={<HelpCircle size={20} className="text-gray-500" />} 
            onClick={() => {}}
        >
            {t('me.about')}
        </List.Item>
        <List.Item extra="v1.0.0">
            {t('me.version')}
        </List.Item>
      </List>

      {user.isLoggedIn && (
          <div className="p-4 mt-4">
            <Button block color='danger' onClick={() => {}}>
                <LogOut size={18} className="mr-2 inline" />
                {t('me.logout')}
            </Button>
          </div>
      )}
    </div>
  );
};

export default Me;
