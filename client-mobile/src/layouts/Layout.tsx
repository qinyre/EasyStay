import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { TabBar } from 'antd-mobile';
import { Home, Calendar, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;
  const { t } = useTranslation();

  // Hide bottom nav on detail pages
  const showBottomNav = !pathname.startsWith('/hotel/');

  const tabs = [
    {
      key: '/',
      title: t('tab.home'),
      icon: <Home size={20} />,
    },
    {
      key: '/bookings',
      title: t('tab.bookings'),
      icon: <Calendar size={20} />,
    },
    {
      key: '/profile',
      title: t('tab.me'),
      icon: <User size={20} />,
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-900 font-sans">
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
      
      {showBottomNav && (
        <div className="border-t border-gray-200 bg-white safe-area-bottom">
          <TabBar activeKey={pathname} onChange={value => navigate(value)}>
            {tabs.map(item => (
              <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
            ))}
          </TabBar>
        </div>
      )}
    </div>
  );
};
