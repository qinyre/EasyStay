import React from 'react';
import { NavBar } from 'antd-mobile';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen">
      <NavBar
        onBack={() => navigate(-1)}
        backArrow={<ChevronLeft size={24} />}
        className="sticky top-0 z-20 bg-white"
      >
        预订条款
      </NavBar>

      <div className="p-5 space-y-5">
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">1. 服务说明</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            易宿（EasyStay）为您提供酒店预订服务平台。我们整合多家酒店资源，为您便捷的预订体验。
            通过本平台预订，即表示您同意遵守以下条款。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">2. 预订与确认</h2>
          <div className="text-sm text-gray-600 leading-relaxed space-y-2">
            <p>2.1 提交订单后，系统将即时确认预订，并发送确认短信至您的预留手机号。</p>
            <p>2.2 请确保填写的入住人信息真实准确，错误信息可能导致无法入住。</p>
            <p>2.3 酒店入住时间为当日 14:00 后，退房时间为次日 12:00 前。</p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">3. 价格与支付</h2>
          <div className="text-sm text-gray-600 leading-relaxed space-y-2">
            <p>3.1 显示价格包含房费及税费，如有其他费用以酒店实际收取为准。</p>
            <p>3.2 支持在线支付，支付成功后预订立即生效。</p>
            <p>3.3 特殊节假日价格可能有所调整，以预订时显示价格为准。</p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">4. 取消与修改政策</h2>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-sm text-orange-800 leading-relaxed space-y-2">
            <p className="font-bold">⚠️ 重要提示：</p>
            <p>4.1 预订成功后，<strong>不可取消、不可修改</strong>。</p>
            <p>4.2 如未能按时入住，已支付费用不予退还。</p>
            <p>4.3 如需变更，请重新预订并取消原订单（可能产生费用）。</p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">5. 入住须知</h2>
          <div className="text-sm text-gray-600 leading-relaxed space-y-2">
            <p>5.1 办理入住时需出示有效身份证件。</p>
            <p>5.2 部分酒店需押金，具体以酒店规定为准。</p>
            <p>5.3 请遵守酒店各项管理制度，文明入住。</p>
            <p>5.4 超出预订人数或提前入住需联系酒店确认。</p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">6. 免责声明</h2>
          <div className="text-sm text-gray-600 leading-relaxed space-y-2">
            <p>6.1 因不可抗力（如自然灾害、政府行为等）导致无法入住的，我们将协助您与酒店协商处理。</p>
            <p>6.2 对于酒店服务质量、设施问题等，我们将协助沟通，但不承担连带责任。</p>
            <p>6.3 用户因个人原因（如行程变更）未能入住的，责任自负。</p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">7. 争议解决</h2>
          <div className="text-sm text-gray-600 leading-relaxed space-y-2">
            <p>7.1 本条款解释权归易宿平台所有。</p>
            <p>7.2 如有争议，双方应友好协商解决；协商不成的，可向平台所在地人民法院提起诉讼。</p>
          </div>
        </section>

        <section className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-500 text-center">
            最后更新时间：2026年2月
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;
