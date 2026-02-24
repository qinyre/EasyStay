import React, { useState } from 'react';
import { Modal, Radio, Button } from 'antd-mobile';
import { useTranslation } from 'react-i18next';
import { WechatFilled, AlipayCircleFilled } from '@ant-design/icons';
import { CreditCard } from 'lucide-react';

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
    icon: <WechatFilled className="text-2xl text-[#07C160]" />,
    color: 'green',
  },
  {
    id: 'alipay',
    name: '支付宝',
    icon: <AlipayCircleFilled className="text-2xl text-[#1677FF]" />,
    color: 'blue',
  },
  {
    id: 'card',
    name: '银行卡支付',
    icon: <CreditCard className="text-[#FF9500]" size={24} />,
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
      bodyClassName="!h-auto !max-h-[90vh]"
      content={
        <div className="py-2">
          {/* 标题与金额区域 */}
          <div className="text-center mb-6">
            <div className="text-sm text-gray-500 mb-1">支付金额</div>
            <div className="text-3xl font-bold text-blue-600">¥{amount}</div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="text-sm text-gray-600 font-medium mb-2">选择支付方式</div>
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all cursor-pointer ${selectedMethod === method.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                onClick={() => setSelectedMethod(method.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${colorClasses[method.color as keyof typeof colorClasses]}`}>
                    {method.icon}
                  </div>
                  <span className="font-medium text-sm">{method.name}</span>
                </div>
                <Radio
                  checked={selectedMethod === method.id}
                  onChange={() => setSelectedMethod(method.id)}
                />
              </div>
            ))}

            <div className="mt-3 p-2 bg-amber-50 rounded-lg">
              <div className="text-xs text-amber-800 leading-tight">
                <span className="font-bold">温馨提示：</span>请在15分钟内完成支付
              </div>
            </div>
          </div>

          {/* 按钮区域 */}
          <div className="space-y-3">
            <Button
              block
              color="primary"
              size="large"
              className="rounded-xl font-bold tracking-wider"
              onClick={handleConfirm}
              loading={paying || loading}
              disabled={paying || loading}
            >
              {paying ? '支付中...' : `确认支付 ¥${amount}`}
            </Button>
            <Button
              block
              size="large"
              className="rounded-xl border-none bg-gray-50 text-gray-500"
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
