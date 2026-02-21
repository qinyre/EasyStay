import React, { useState } from 'react';
import { Modal, Radio, Button } from 'antd-mobile';
import { useTranslation } from 'react-i18next';

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'wechat',
    name: '微信支付',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="11" fill="#07C160"/>
        <path d="M9 9c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2 2zm4 4c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5z" fill="white"/>
        <path d="M8 13h3c0 1.66-1.34 3-3 3s-3-1.34-3-3h3z" fill="white" opacity="0.7"/>
      </svg>
    ),
    color: 'green',
  },
  {
    id: 'alipay',
    name: '支付宝',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="11" fill="#1677FF"/>
        <path d="M7 7h10v2H7V7zm0 4h10v2H7v-2z" fill="white"/>
      </svg>
    ),
    color: 'blue',
  },
  {
    id: 'card',
    name: '银行卡支付',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF9500" strokeWidth="2">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" x2="22" y1="10" y2="10" />
      </svg>
    ),
    color: 'orange',
  },
];

interface PaymentModalProps {
  visible: boolean;
  amount: number;
  onClose: () => void;
  onConfirm: (method: string) => Promise<void>;
  loading?: boolean;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  visible,
  amount,
  onClose,
  onConfirm,
  loading = false,
}) => {
  const { t } = useTranslation();
  const [selectedMethod, setSelectedMethod] = useState('wechat');
  const [paying, setPaying] = useState(false);

  const handleConfirm = async () => {
    setPaying(true);
    try {
      await onConfirm(selectedMethod);
      onClose();
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setPaying(false);
    }
  };

  const colorClasses = {
    green: 'bg-green-50',
    blue: 'bg-blue-50',
    orange: 'bg-orange-50',
  };

  return (
    <Modal
      visible={visible}
      content={
        <div className="py-4">
          <div className="text-center mb-6">
            <div className="text-sm text-gray-500 mb-1">支付金额</div>
            <div className="text-3xl font-bold text-blue-600">¥{amount}</div>
          </div>

          <div className="space-y-3">
            <div className="text-sm text-gray-600 font-medium mb-2">选择支付方式</div>
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  selectedMethod === method.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                onClick={() => setSelectedMethod(method.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${colorClasses[method.color as keyof typeof colorClasses]}`}>
                    {method.icon}
                  </div>
                  <span className="font-medium">{method.name}</span>
                </div>
                <Radio
                  checked={selectedMethod === method.id}
                  onChange={() => setSelectedMethod(method.id)}
                />
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-amber-50 rounded-lg">
            <div className="text-xs text-amber-800">
              <span className="font-bold">温馨提示：</span>
              请在15分钟内完成支付，超时订单将自动取消
            </div>
          </div>

          {/* 按钮放在 content 内 */}
          <div className="mt-6 space-y-3">
            <Button
              block
              color="primary"
              size="large"
              onClick={handleConfirm}
              loading={paying || loading}
              disabled={paying || loading}
            >
              {paying ? '支付中...' : `确认支付 ¥${amount}`}
            </Button>
            <Button
              block
              size="large"
              onClick={onClose}
              disabled={paying || loading}
            >
              取消
            </Button>
          </div>
        </div>
      }
      closeOnMaskClick={!paying}
      onClose={onClose}
    />
  );
};

export default PaymentModal;
