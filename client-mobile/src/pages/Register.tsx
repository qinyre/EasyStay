import React, { useState } from 'react';
import { NavBar, Form, Input, Button, Toast } from 'antd-mobile';
import { Eye, EyeOff, Phone, User, Mail } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const Register: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register } = useAuth();

  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // 验证输入
    if (!phone) {
      Toast.show({ content: '请输入手机号', icon: 'fail' });
      return;
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      Toast.show({ content: '请输入正确的手机号', icon: 'fail' });
      return;
    }
    if (!email) {
      Toast.show({ content: '请输入邮箱', icon: 'fail' });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Toast.show({ content: '请输入正确的邮箱格式', icon: 'fail' });
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
    if (password !== confirmPassword) {
      Toast.show({ content: '两次输入的密码不一致', icon: 'fail' });
      return;
    }

    setLoading(true);
    try {
      // 默认注册为普通用户
      await register(phone, email, password, name || undefined, 'user');
      Toast.show({
        content: '注册成功！欢迎加入易宿',
        icon: 'success',
        duration: 1500,
      });
      // 延迟跳转，让用户看到成功提示
      setTimeout(() => {
        navigate('/profile', { replace: true });
      }, 500);
    } catch (error) {
      Toast.show({
        content: error instanceof Error ? error.message : '注册失败，请稍后重试',
        icon: 'fail',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar onBack={() => navigate(-1)}>{t('register.title')}</NavBar>

      <div className="p-6">
        {/* Logo / Welcome */}
        <div className="text-center mb-8 mt-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t('register.welcome')}
          </h1>
          <p className="text-gray-500 text-sm">{t('register.subtitle')}</p>
        </div>

        {/* Register Form */}
        <Form
          layout="vertical"
          footer={
            <Button
              block
              color="primary"
              size="large"
              onClick={handleRegister}
              loading={loading}
              disabled={!phone || !email || !password || !confirmPassword}
              className="mt-4"
            >
              {t('register.submit')}
            </Button>
          }
        >
          <Form.Item label={t('register.phone_label')}>
            <div className="relative">
              <Input
                placeholder={t('register.phone_placeholder')}
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

          <Form.Item label={t('register.email_label')} extra="必填，用于找回密码">
            <div className="relative">
              <Input
                placeholder={t('register.email_placeholder')}
                value={email}
                onChange={setEmail}
                type="email"
                clearable
                className="pl-10"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </Form.Item>

          <Form.Item label={t('register.name_label')} extra="选填">
            <div className="relative">
              <Input
                placeholder={t('register.name_placeholder')}
                value={name}
                onChange={setName}
                clearable
                className="pl-10"
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </Form.Item>

          <Form.Item label={t('register.password_label')}>
            <div className="relative">
              <Input
                placeholder={t('register.password_placeholder')}
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

          <Form.Item label={t('register.confirm_password_label')}>
            <div className="relative">
              <Input
                placeholder={t('register.confirm_password_placeholder')}
                value={confirmPassword}
                onChange={setConfirmPassword}
                type={showConfirmPassword ? 'text' : 'password'}
                clearable
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </Form.Item>
        </Form>

        {/* Login Link */}
        <div className="text-center mt-4 text-sm">
          已有账号？
          <Link to="/login" className="text-blue-600 font-medium ml-1">
            立即登录
          </Link>
        </div>

        {/* Terms Notice */}
        <div className="mt-8 text-center text-xs text-gray-400">
          注册即表示同意
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

export default Register;
