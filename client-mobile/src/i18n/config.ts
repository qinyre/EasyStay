import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 语言持久化存储 key
const LANGUAGE_STORAGE_KEY = 'easystay_language';

// 从 localStorage 读取已保存的语言，或检测浏览器语言
const getInitialLanguage = (): string => {
  const savedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (savedLang) {
    return savedLang;
  }
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('zh')) {
    return 'zh';
  }
  return 'zh'; // 默认中文
};

// 翻译资源
const resources = {
  en: {
    translation: {
      "home": {
        "title": "Find Your Perfect Stay",
        "search_placeholder": "Where are you going?",
        "check_in": "Check-in",
        "check_out": "Check-out",
        "search_btn": "Search Hotels",
        "popular_destinations": "Popular Destinations",
        "why_choose_us": "Why Choose EasyStay?",
        "best_price": "Best Price Guarantee",
        "best_price_desc": "Find a lower price? We'll match it.",
        "support": "24/7 Support",
        "support_desc": "We are always here to help you."
      },
      "tab": {
        "home": "Home",
        "bookings": "Bookings",
        "me": "Me"
      },
      "me": {
        "title": "My Profile",
        "login_btn": "Login / Register",
        "settings": "Settings",
        "general": "General",
        "language": "Language",
        "about": "About Us",
        "version": "Version",
        "logout": "Log Out"
      },
      "common": {
        "loading": "Loading...",
        "switch_lang": "Switch Language"
      }
    }
  },
  zh: {
    translation: {
      "home": {
        "title": "寻找您的完美住宿",
        "search_placeholder": "您想去哪里？",
        "check_in": "入住",
        "check_out": "离店",
        "search_btn": "搜索酒店",
        "popular_destinations": "热门目的地",
        "why_choose_us": "为什么选择 EasyStay？",
        "best_price": "最优价格保证",
        "best_price_desc": "发现更低价？我们赔付差价。",
        "support": "24/7 客服支持",
        "support_desc": "我们随时为您服务。"
      },
      "tab": {
        "home": "首页",
        "bookings": "订单",
        "me": "我的"
      },
      "me": {
        "title": "个人中心",
        "login_btn": "登录 / 注册",
        "settings": "设置",
        "general": "通用设置",
        "language": "多语言",
        "about": "关于我们",
        "version": "版本",
        "logout": "退出登录"
      },
      "common": {
        "loading": "加载中...",
        "switch_lang": "切换语言"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: 'zh',
    interpolation: {
      escapeValue: false
    }
  });

// 监听语言变化，持久化到 localStorage
i18n.on('languageChanged', (lng) => {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
});

export default i18n;
