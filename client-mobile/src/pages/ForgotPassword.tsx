import React, { useState } from 'react';
import { NavBar, Form, Input, Button, Toast, Result } from 'antd-mobile';
import { Mail, Shield, CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { sendResetCode, resetPasswordWithCode } from '../services/auth';
import { useTranslation } from 'react-i18next';

type Step = 'email' | 'verify' | 'success';

const ForgotPassword: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [mockCode, setMockCode] = useState(''); // 用于显示验证码

  // 发送验证码
  const handleSendCode = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Toast.show({ content: '请输入正确的邮箱格式', icon: 'fail' });
      return;
    }

    setLoading(true);
    try {
      await sendResetCode({ email });

      // 获取 Mock 验证码并显示
      const storedCode = localStorage.getItem(`reset_code_${email}`);
      if (storedCode) {
        setMockCode(storedCode);
      }

      setStep('verify');
      Toast.show({
        content: '验证码已生成',
        icon: 'success',
      });
      // 开始倒计时
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      Toast.show({
        content: error.message || '发送失败，请稍后重试',
        icon: 'fail',
      });
    } finally {
      setLoading(false);
    }
  };

  // 重置密码
  const handleResetPassword = async () => {
    // 验证
    if (!code || code.length !== 6) {
      Toast.show({ content: '请输入6位验证码', icon: 'fail' });
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      Toast.show({ content: '密码长度不能少于6位', icon: 'fail' });
      return;
    }
    if (newPassword !== confirmPassword) {
      Toast.show({ content: '两次输入的密码不一致', icon: 'fail' });
      return;
    }

    setLoading(true);
    try {
      await resetPasswordWithCode({ email, code, newPassword });
      setStep('success');
    } catch (error: any) {
      Toast.show({
        content: error.message || '重置失败，请检查验证码',
        icon: 'fail',
      });
    } finally {
      setLoading(false);
    }
  };

  // 重新发送验证码
  const handleResendCode = async () => {
    if (countdown > 0) return;

    setLoading(true);
    try {
      await sendResetCode({ email });

      // 获取新的 Mock 验证码
      const storedCode = localStorage.getItem(`reset_code_${email}`);
      if (storedCode) {
        setMockCode(storedCode);
      }

      Toast.show({
        content: '验证码已重新发送',
        icon: 'success',
      });
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      Toast.show({
        content: error.message || '发送失败，请稍后重试',
        icon: 'fail',
      });
    } finally {
      setLoading(false);
    }
  };

  // 成功页面
  if (step === 'success') {
    return (
      <div className="bg-gray-50 min-h-screen">
        <NavBar backArrow={false}>找回密码</NavBar>

        <div className="p-6">
          <Result
            status="success"
            title={<span className="text-gray-900">密码重置成功</span>}
            description={
              <div className="text-gray-500 mt-2">
                <p>您的密码已成功重置</p>
                <p className="mt-2 text-sm">现在可以使用新密码登录</p>
              </div>
            }
            icon={<CheckCircle className="text-green-500" size={64} />}
          />

          <div className="mt-8">
            <Button
              block
              color="primary"
              size="large"
              onClick={() => navigate('/login')}
            >
              返回登录
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar onBack={() => navigate(-1)}>找回密码</NavBar>

      <div className="p-6">
        {/* 步骤指示 */}
        <div className="flex items-center justify-center mb-8 mt-4">
          <div className={`flex items-center ${step === 'email' ? 'text-blue-600' : 'text-green-500'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === 'email' ? 'bg-blue-600' : 'bg-green-500'
            } text-white`}>
              {step === 'email' ? '1' : <CheckCircle size={18} />}
            </div>
            <span className="ml-2 text-sm font-medium">验证邮箱</span>
          </div>

          <div className={`w-12 h-0.5 mx-2 ${step === 'email' ? 'bg-gray-200' : 'bg-green-500'}`} />

          <div className={`flex items-center ${step === 'verify' ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === 'verify' ? 'bg-blue-600' : 'bg-gray-200'
            } text-white`}>
              2
            </div>
            <span className="ml-2 text-sm font-medium">重置密码</span>
          </div>
        </div>

        {/* 步骤 1: 输入邮箱 */}
        {step === 'email' && (
          <>
            <div className="text-center mb-6">
              <h1 className="text-xl font-bold text-gray-900 mb-2">忘记密码？</h1>
              <p className="text-gray-500 text-sm">输入注册时的邮箱，我们将发送验证码</p>
            </div>

            <Form layout="vertical">
              <Form.Item label="邮箱地址">
                <div className="relative">
                  <Input
                    placeholder="请输入注册时的邮箱"
                    value={email}
                    onChange={setEmail}
                    type="email"
                    clearable
                    className="pl-10"
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </Form.Item>

              <Button
                block
                color="primary"
                size="large"
                onClick={handleSendCode}
                loading={loading}
                disabled={!email}
                className="mt-4"
              >
                发送验证码
              </Button>
            </Form>

            <div className="text-center mt-6 text-sm">
              想起密码了？
              <Link to="/login" className="text-blue-600 font-medium ml-1">
                立即登录
              </Link>
            </div>
          </>
        )}

        {/* 步骤 2: 输入验证码和新密码 */}
        {step === 'verify' && (
          <>
            <div className="text-center mb-6">
              <h1 className="text-xl font-bold text-gray-900 mb-2">输入验证码</h1>
              <p className="text-gray-500 text-sm">
                验证码已发送至 <span className="text-blue-600">{email}</span>
              </p>
            </div>

            {/* 开发模式：显示验证码 */}
            {mockCode && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800 font-medium mb-1">开发测试模式 - 验证码：</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600 tracking-widest">{mockCode}</span>
                  <button
                    type="button"
                    onClick={() => {
                      // 点击复制
                      navigator.clipboard.writeText(mockCode);
                      Toast.show({ content: '已复制', icon: 'success' });
                    }}
                    className="text-xs bg-yellow-200 hover:bg-yellow-300 text-yellow-800 px-2 py-1 rounded"
                  >
                    复制
                  </button>
                </div>
                <p className="text-xs text-yellow-600 mt-1">（生产环境将发送至邮箱）</p>
              </div>
            )}

            <Form layout="vertical">
              <Form.Item label="验证码" extra={
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={countdown > 0}
                  className="text-blue-600 text-sm disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  {countdown > 0 ? `${countdown}秒后重新发送` : '重新发送'}
                </button>
              }>
                <div className="relative">
                  <Input
                    placeholder="请输入6位验证码"
                    value={code}
                    onChange={setCode}
                    maxLength={6}
                    clearable
                    className="pl-10 text-center tracking-widest"
                  />
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </Form.Item>

              <Form.Item label="新密码">
                <div className="relative">
                  <Input
                    placeholder="请输入新密码（至少6位）"
                    value={newPassword}
                    onChange={setNewPassword}
                    type={showPassword ? 'text' : 'password'}
                    clearable
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </Form.Item>

              <Form.Item label="确认密码">
                <div className="relative">
                  <Input
                    placeholder="请再次输入新密码"
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
                    {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </Form.Item>

              <Button
                block
                color="primary"
                size="large"
                onClick={handleResetPassword}
                loading={loading}
                disabled={!code || !newPassword || !confirmPassword}
                className="mt-4"
              >
                重置密码
              </Button>

              <Button
                block
                fill="outline"
                onClick={() => setStep('email')}
                className="mt-3"
              >
                返回上一步
              </Button>
            </Form>
          </>
        )}

        {/* 提示信息 */}
        {step === 'email' && (
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-medium">提示</p>
            <ul className="text-sm text-blue-600 mt-2 space-y-1">
              <li>• 请确保输入注册时绑定的邮箱</li>
              <li>• 验证码有效期为 5 分钟</li>
              <li>• 如未收到邮件，请检查垃圾邮件文件夹</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

// 导入 Eye 和 EyeOff 图标
import { Eye, EyeOff } from 'lucide-react';

export default ForgotPassword;
