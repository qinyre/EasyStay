import React from 'react';
import { NavBar, List, Toast, SafeArea } from 'antd-mobile';
import {
  Heart,
  Mail,
  Phone,
  Globe,
  Github,
  MessageCircle,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const About: React.FC = () => {
  const navigate = useNavigate();

  const handleContact = (type: string) => {
    switch (type) {
      case 'email':
        Toast.show({ content: '客服邮箱: support@easystay.com', icon: 'success' });
        break;
      case 'phone':
        Toast.show({ content: '客服热线: 400-888-8888', icon: 'success' });
        break;
      case 'feedback':
        Toast.show({ content: '反馈功能开发中', icon: 'fail' });
        break;
      default:
        break;
    }
  };

  const handleLinkClick = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar onBack={() => navigate(-1)}>关于我们</NavBar>

      {/* Logo & 标语 */}
      <div className="bg-white p-8 flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
          <Heart size={40} className="text-white" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">EasyStay 易宿</h1>
        <p className="text-gray-500 text-sm mt-2">让旅途更美好</p>
        <div className="mt-4 px-4 py-2 bg-blue-50 rounded-full">
          <span className="text-blue-600 text-sm font-medium">版本 1.0.0</span>
        </div>
      </div>

      {/* 产品介绍 */}
      <div className="bg-white mt-3 p-5">
        <h2 className="text-lg font-bold text-gray-900 mb-3">产品介绍</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          EasyStay 易宿是一款专注于为用户提供便捷、舒适酒店预订体验的应用。
          我们致力于连接用户与优质酒店，让每一次旅行都成为美好回忆。
        </p>
      </div>

      {/* 核心功能 */}
      <div className="bg-white mt-3 p-5">
        <h2 className="text-lg font-bold text-gray-900 mb-3">核心功能</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Globe size={24} className="text-blue-500" />
            </div>
            <span className="text-xs text-gray-600 mt-2">海量酒店</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Star size={24} className="text-green-500" />
            </div>
            <span className="text-xs text-gray-600 mt-2">品质保障</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Heart size={24} className="text-orange-500" />
            </div>
            <span className="text-xs text-gray-600 mt-2">贴心服务</span>
          </div>
        </div>
      </div>

      {/* 联系我们 */}
      <List header="联系我们" className="mt-3">
        <List.Item
          prefix={<Mail size={20} className="text-blue-500" />}
          onClick={() => handleContact('email')}
          extra="support@easystay.com"
        >
          客服邮箱
        </List.Item>
        <List.Item
          prefix={<Phone size={20} className="text-green-500" />}
          onClick={() => handleContact('phone')}
          extra="400-888-8888"
        >
          客服热线
        </List.Item>
        <List.Item
          prefix={<MessageCircle size={20} className="text-orange-500" />}
          onClick={() => handleContact('feedback')}
          extra={<span className="text-gray-400 text-sm">点击反馈</span>}
        >
          意见反馈
        </List.Item>
      </List>

      {/* 社交媒体 */}
      <List header="关注我们" className="mt-3">
        <List.Item
          prefix={<Globe size={20} className="text-purple-500" />}
          onClick={() => handleLinkClick('https://easystay.com')}
          extra={<span className="text-gray-400 text-sm">访问</span>}
        >
          官方网站
        </List.Item>
        <List.Item
          prefix={<Github size={20} className="text-gray-800" />}
          onClick={() => handleLinkClick('https://github.com/qinyre/EasyStay')}
          extra={<span className="text-gray-400 text-sm">访问</span>}
        >
          GitHub
        </List.Item>
      </List>

      {/* 法律信息 */}
      <List header="法律信息" className="mt-3">
        <List.Item
          onClick={() => navigate('/terms')}
        >
          用户协议
        </List.Item>
        <List.Item
          onClick={() => navigate('/privacy')}
        >
          隐私政策
        </List.Item>
      </List>

      {/* 底部版权 */}
      <div className="bg-white mt-3 p-6 text-center">
        <p className="text-gray-500 text-sm">
          © 2024 EasyStay. All rights reserved.
        </p>
        <p className="text-gray-400 text-xs mt-2">
          Made with <Heart size={12} className="inline text-red-500" /> by EasyStay Team
        </p>
      </div>

      <SafeArea position="bottom" />
    </div>
  );
};

export default About;
