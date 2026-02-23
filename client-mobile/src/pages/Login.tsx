import React, { useState } from 'react';
import { NavBar, Form, Input, Button, Toast, PasscodeInput } from 'antd-mobile';
import { Eye, EyeOff, Phone } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // 验证输入
    if (!phone) {
      Toast.show({ content: '请输入手机号', icon: 'fail' });
      return;
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      Toast.show({ content: '请输入正确的手机号', icon: 'fail' });
      return;
    }
    if (!password) {
      Toast.show({ content: '请输入密码', icon: 'fail' });
      return;
    }
    if (password.length < 6) {
      Toast.show({ content: '密码长度不能少于6位', icon: 'fail' });
      return;
    }

    setLoading(true);
    try {
      await login(phone, password);
      Toast.show({
        content: '登录成功',
        icon: 'success',
        duration: 1000,
      });
      // 延迟跳转，让用户看到成功提示
      setTimeout(() => {
        navigate('/profile', { replace: true });
      }, 500);
    } catch (error: any) {
      Toast.show({
        content: error.message || '登录失败，请稍后重试',
        icon: 'fail',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar onBack={() => navigate(-1)}>{t('login.title')}</NavBar>

      <div className="p-6">
        {/* Logo / Welcome */}
        <div className="text-center mb-8 mt-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t('login.welcome')}
          </h1>
          <p className="text-gray-500 text-sm">{t('login.subtitle')}</p>
        </div>

        {/* Login Form */}
        <Form
          layout="vertical"
          footer={
            <Button
              block
              color="primary"
              size="large"
              onClick={handleLogin}
              loading={loading}
              disabled={!phone || !password}
              className="mt-4"
            >
              {t('login.submit')}
            </Button>
          }
        >
          <Form.Item label={t('login.phone_label')}>
            <div className="relative">
              <Input
                placeholder={t('login.phone_placeholder')}
                value={phone}
                onChange={setPhone}
                maxLength={11}
                type="tel"
                clearable
                className="pl-10"
              />
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </Form.Item>

          <Form.Item label={t('login.password_label')}>
            <div className="relative">
              <Input
                placeholder={t('login.password_placeholder')}
                value={password}
                onChange={setPassword}
                type={showPassword ? 'text' : 'password'}
                clearable
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </Form.Item>
        </Form>

        {/* Additional Links */}
        <div className="flex justify-between items-center mt-4 text-sm">
          <Link to="/forgot-password" className="text-gray-500 hover:text-blue-600">
            {t('login.forgot_password')}
          </Link>
          <Link to="/register" className="text-blue-600 font-medium">
            {t('login.register_link')}
          </Link>
        </div>

        {/* Terms Notice */}
        <div className="mt-8 text-center text-xs text-gray-400">
          登录即表示同意
          <Link to="/terms" className="text-blue-500">
            《用户协议》
          </Link>
          和
          <Link to="/privacy" className="text-blue-500">
            《隐私政策》
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
