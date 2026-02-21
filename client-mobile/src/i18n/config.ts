import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

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
      "hotelList": {
        "all_cities": "All Cities",
        "any_dates": "Any Dates",
        "sort": "Sort",
        "recommended": "Recommended",
        "price_low_high": "Price: Low to High",
        "price_high_low": "Price: High to Low",
        "rating": "Rating",
        "price": "Price",
        "price_placeholder": "Price Range Slider Placeholder",
        "more": "More",
        "more_placeholder": "More Filters Placeholder"
      },
      "booking": {
        "title": "Bookings",
        "empty": "No Bookings",
        "empty_desc": "You haven't made any bookings yet.",
        "detail_title": "Booking Detail",
        "guest_info": "Guest Information",
        "order_info": "Order Information",
        "order_no": "Order No.",
        "create_time": "Created Time",
        "total_price": "Total Price",
        "cancel_confirm": "Are you sure you want to cancel this booking?",
        "cancel_success": "Booking cancelled successfully",
        "nights": "Nights",
        "tabs": {
            "all": "All",
            "pending": "Pending",
            "confirmed": "Confirmed",
            "cancelled": "Cancelled"
        },
        "status": {
            "pending": "Pending Payment",
            "confirmed": "Confirmed",
            "completed": "Completed",
            "cancelled": "Cancelled"
        },
        "status_desc": {
            "pending": "Please complete payment within 30 minutes",
            "confirmed": "Your booking is confirmed, have a nice trip!",
            "completed": "Thank you for staying with us",
            "cancelled": "This booking has been cancelled"
        },
        "actions": {
            "cancel": "Cancel Booking",
            "pay": "Pay Now"
        }
      },
      "hotelDetail": {
        "reviews": "Reviews",
        "location": "Location",
        "facilities": "Facilities",
        "about": "About Hotel",
        "select_room": "Select Room",
        "photos": "Photos"
      },
      "common": {
        "loading": "Loading...",
        "switch_lang": "Switch Language",
        "copied": "Copied to clipboard"
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
      "hotelList": {
        "all_cities": "所有城市",
        "any_dates": "任意日期",
        "sort": "排序",
        "recommended": "推荐排序",
        "price_low_high": "价格：从低到高",
        "price_high_low": "价格：从高到低",
        "rating": "评分",
        "price": "价格",
        "price_placeholder": "价格范围筛选占位符",
        "more": "更多",
        "more_placeholder": "更多筛选条件占位符"
      },
      "booking": {
        "title": "我的订单",
        "empty": "暂无订单",
        "empty_desc": "您还没有预订任何酒店",
        "detail_title": "订单详情",
        "guest_info": "入住人信息",
        "order_info": "订单信息",
        "order_no": "订单编号",
        "create_time": "下单时间",
        "total_price": "订单总价",
        "cancel_confirm": "确定要取消该订单吗？",
        "cancel_success": "订单取消成功",
        "nights": "晚",
        "tabs": {
            "all": "全部",
            "pending": "待支付",
            "confirmed": "已确认",
            "cancelled": "已取消"
        },
        "status": {
            "pending": "待支付",
            "confirmed": "预订成功",
            "completed": "已完成",
            "cancelled": "已取消"
        },
        "status_desc": {
            "pending": "请在30分钟内完成支付，否则订单将自动取消",
            "confirmed": "您的预订已确认，祝您旅途愉快！",
            "completed": "感谢您的入住，期待再次光临",
            "cancelled": "该订单已取消"
        },
        "actions": {
            "cancel": "取消订单",
            "pay": "立即支付"
        }
      },
      "hotelDetail": {
        "reviews": "条点评",
        "location": "酒店位置",
        "facilities": "酒店设施",
        "about": "关于酒店",
        "select_room": "选择房间",
        "photos": "张照片"
      },
      "common": {
        "loading": "加载中...",
        "switch_lang": "切换语言",
        "copied": "已复制到剪贴板"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "zh", // 默认语言，后续可从 localStorage 读取
    fallbackLng: "zh",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
