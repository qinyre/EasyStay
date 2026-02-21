import React from 'react';
import { NavBar } from 'antd-mobile';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen">
      <NavBar
        onBack={() => navigate(-1)}
        backArrow={<ChevronLeft size={24} />}
        className="sticky top-0 z-20 bg-white"
      >
        隐私政策
      </NavBar>

      <div className="p-5 space-y-5">
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800 leading-relaxed">
            易宿（EasyStay）非常重视您的隐私保护。本隐私政策将帮助您了解我们收集、使用、存储和保护个人信息的方式。
            使用我们的服务即表示您同意本政策的全部内容。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">1. 信息收集</h2>
          <div className="text-sm text-gray-600 leading-relaxed space-y-2">
            <p className="font-bold text-gray-800">我们可能收集以下信息：</p>
            <p><span className="text-blue-600">•</span> <strong>账户信息：</strong>手机号、用户名等注册信息</p>
            <p><span className="text-blue-600">•</span> <strong>预订信息：</strong>入住人姓名、联系电话、行程安排</p>
            <p><span className="text-blue-600">•</span> <strong>支付信息：</strong>支付记录（但不存储完整银行卡号）</p>
            <p><span className="text-blue-600">•</span> <strong>设备信息：</strong>设备型号、IP地址、操作系统版本</p>
            <p><span className="text-blue-600">•</span> <strong>位置信息：</strong>经您授权后的地理位置（用于推荐附近酒店）</p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">2. 信息使用</h2>
          <div className="text-sm text-gray-600 leading-relaxed space-y-2">
            <p className="font-bold text-gray-800">我们使用您的信息用于：</p>
            <p><span className="text-green-600">✓</span> 处理您的订单并提供预订服务</p>
            <p><span className="text-green-600">✓</span> 发送订单确认短信和服务通知</p>
            <p><span className="text-green-600">✓</span> 向合作酒店传递必要的入住信息</p>
            <p><span className="text-green-600">✓</span> 改善产品功能和用户体验</p>
            <p><span className="text-green-600">✓</span> 防范欺诈和确保交易安全</p>
            <p><span className="text-green-600">✓</span> 符合法律法规要求</p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">3. 信息共享</h2>
          <div className="text-sm text-gray-600 leading-relaxed space-y-2">
            <p className="font-bold text-gray-800">我们承诺：</p>
            <p>3.1 <strong>不会出售</strong>您的个人信息给第三方</p>
            <p>3.2 仅在以下情况下共享信息：</p>
            <p className="ml-4">• 向预订酒店提供必要的入住信息（姓名、电话、行程）</p>
            <p className="ml-4">• 向支付服务商提供必要的支付信息</p>
            <p className="ml-4">• 经您明确同意的其他情况</p>
            <p>3.3 与合作伙伴共享时，我们会要求其保护您的信息安全</p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">4. 信息存储与安全</h2>
          <div className="text-sm text-gray-600 leading-relaxed space-y-2">
            <p>4.1 我们采用<strong>加密技术</strong>保护您的数据传输和存储</p>
            <p>4.2 敏感信息（如密码）经过<strong>单向加密</strong>存储</p>
            <p>4.3 我们定期进行安全审计，防范数据泄露风险</p>
            <p>4.4 但请注意：任何安全措施都无法做到绝对安全</p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">5. 您的权利</h2>
          <div className="text-sm text-gray-600 leading-relaxed space-y-2">
            <p className="font-bold text-gray-800">您对自己的个人信息享有以下权利：</p>
            <p><span className="text-blue-600">•</span> <strong>访问权：</strong>随时查看您的账户信息</p>
            <p><span className="text-blue-600">•</span> <strong>更正权：</strong>要求更新或修正不准确的信息</p>
            <p><span className="text-blue-600">•</span> <strong>删除权：</strong>要求删除个人信息（可能影响服务使用）</p>
            <p><span className="text-blue-600">•</span> <strong>撤回同意：</strong>随时撤回对信息处理的同意</p>
            <p className="text-xs text-gray-500 mt-2">
              如需行使以上权利，请通过客服反馈或官方邮箱联系我们
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">6. Cookie 使用</h2>
          <div className="text-sm text-gray-600 leading-relaxed space-y-2">
            <p>6.1 我们使用 Cookie 和类似技术来改善用户体验</p>
            <p>6.2 Cookie 帮助我们记住您的偏好设置和登录状态</p>
            <p>6.3 您可以通过浏览器设置管理 Cookie，但可能影响部分功能</p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">7. 未成年人保护</h2>
          <div className="text-sm text-gray-600 leading-relaxed">
            我们的服务面向成年人。如果您未满18周岁，请在监护人陪同和同意下使用我们的服务。
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">8. 政策更新</h2>
          <div className="text-sm text-gray-600 leading-relaxed space-y-2">
            <p>8.1 我们可能不时更新本隐私政策</p>
            <p>8.2 重大变更时，我们会通过应用内通知或短信告知您</p>
            <p>8.3 继续使用服务即表示您接受更新后的政策</p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">9. 联系我们</h2>
          <div className="text-sm text-gray-600 leading-relaxed space-y-2">
            <p>如果您对本隐私政策有任何疑问、意见或建议，请通过以下方式联系我们：</p>
            <p className="ml-4">• 客服热线：400-888-8888</p>
            <p className="ml-4">• 官方邮箱：privacy@easystay.com</p>
            <p className="ml-4">• 通讯地址：上海市浦东新区世纪大道100号</p>
          </div>
        </section>

        <section className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-500 text-center">
            本政策自 2026年2月21日 起生效
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPage;
