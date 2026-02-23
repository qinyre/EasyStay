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
      "login": {
        "title": "Login",
        "welcome": "Welcome Back",
        "subtitle": "Login to access your bookings",
        "phone_label": "Phone Number",
        "phone_placeholder": "Please enter phone number",
        "password_label": "Password",
        "password_placeholder": "Please enter password (at least 6 characters)",
        "submit": "Login",
        "forgot_password": "Forgot password?",
        "register_link": "Register now"
      },
      "register": {
        "title": "Register",
        "welcome": "Create Account",
        "subtitle": "Join EasyStay for better experience",
        "phone_label": "Phone Number",
        "phone_placeholder": "Please enter phone number",
        "email_label": "Email Address",
        "email_placeholder": "Please enter email address",
        "name_label": "Nickname",
        "name_placeholder": "Please enter nickname (optional)",
        "password_label": "Password",
        "password_placeholder": "Please enter password (at least 6 characters)",
        "confirm_password_label": "Confirm Password",
        "confirm_password_placeholder": "Please enter password again",
        "submit": "Register"
      },
      "forgotPassword": {
        "title": "Forgot Password",
        "phone_label": "Phone Number",
        "phone_placeholder": "Please enter registered phone number",
        "email_label": "Email Address",
        "email_placeholder": "Please enter registered email address",
        "submit": "Send Reset Link",
        "success_title": "Email Sent",
        "success_desc": "We have sent a password reset link to your email",
        "back_to_login": "Back to Login",
        "resend": "Resend",
        "tips_title": "Didn't receive the email?",
        "tips": [
          "Check if the email address is correct",
          "Check your spam folder",
          "Try again later"
        ],
        "remember_password": "Remember your password?",
        "login_now": "Login Now"
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
        "star": "Star Rating",
        "price_placeholder": "Price Range Slider Placeholder",
        "more": "More",
        "more_placeholder": "More Filters Placeholder",
        "filter": "Filter",
        "clear_filters": "Clear All",
        "no_results": "No hotels found",
        "selected_filters": "Selected:",
        "all_stars": "All Stars"
      },
      "booking": {
        "title": "Bookings",
        "empty": "No Bookings",
        "empty_desc": "You haven't made any bookings yet.",
        "confirm_title": "Confirm Booking",
        "detail_title": "Booking Detail",
        "success_title": "Booking Successful!",
        "guest_info": "Guest Information",
        "order_info": "Order Information",
        "order_no": "Order No.",
        "create_time": "Created Time",
        "total_price": "Total Price",
        "cancel_confirm": "Are you sure you want to cancel this booking?",
        "cancel_success": "Booking cancelled successfully",
        "cancel_failed": "Failed to cancel booking",
        "pay_coming_soon": "Payment feature coming soon",
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
            "pay": "Pay Now",
            "paying": "Paying...",
            "save": "Save",
            "saving": "Saving..."
        },
        "messages": {
            "save_success": "Saved to bookings, please proceed to payment",
            "save_failed": "Save failed, please try again",
            "pay_select_method": "Select payment method to continue",
            "pay_success": "Payment successful!",
            "pay_failed": "Payment failed, please try again"
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
        "copied": "Copied to clipboard",
        "confirm": "Confirm",
        "cancel": "Cancel"
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
      "login": {
        "title": "登录",
        "welcome": "欢迎回来",
        "subtitle": "登录以查看您的订单",
        "phone_label": "手机号",
        "phone_placeholder": "请输入手机号",
        "password_label": "密码",
        "password_placeholder": "请输入密码（至少6位）",
        "submit": "登录",
        "forgot_password": "忘记密码？",
        "register_link": "立即注册"
      },
      "register": {
        "title": "注册",
        "welcome": "创建账号",
        "subtitle": "加入易宿，享受更好的体验",
        "phone_label": "手机号",
        "phone_placeholder": "请输入手机号",
        "email_label": "邮箱地址",
        "email_placeholder": "请输入邮箱地址",
        "name_label": "昵称",
        "name_placeholder": "请输入昵称（选填）",
        "password_label": "密码",
        "password_placeholder": "请输入密码（至少6位）",
        "confirm_password_label": "确认密码",
        "confirm_password_placeholder": "请再次输入密码",
        "submit": "注册"
      },
      "forgotPassword": {
        "title": "忘记密码",
        "phone_label": "手机号",
        "phone_placeholder": "请输入注册时的手机号",
        "email_label": "邮箱地址",
        "email_placeholder": "请输入注册时的邮箱",
        "submit": "发送重置链接",
        "success_title": "邮件已发送",
        "success_desc": "我们已向您的邮箱发送了密码重置链接",
        "back_to_login": "返回登录",
        "resend": "重新发送",
        "tips_title": "未收到邮件？",
        "tips": [
          "检查邮箱地址是否正确",
          "查看垃圾邮件文件夹",
          "稍后重试"
        ],
        "remember_password": "想起密码了？",
        "login_now": "立即登录"
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
        "star": "星级",
        "price_placeholder": "价格范围筛选占位符",
        "more": "更多",
        "more_placeholder": "更多筛选条件占位符",
        "filter": "筛选",
        "clear_filters": "清除全部",
        "no_results": "暂无符合条件的酒店",
        "selected_filters": "已选:",
        "all_stars": "全部星级"
      },
      "booking": {
        "title": "我的订单",
        "empty": "暂无订单",
        "empty_desc": "您还没有预订任何酒店",
        "confirm_title": "确认预订",
        "detail_title": "订单详情",
        "success_title": "预订成功！",
        "guest_info": "入住人信息",
        "order_info": "订单信息",
        "order_no": "订单编号",
        "create_time": "下单时间",
        "total_price": "订单总价",
        "cancel_confirm": "确定要取消该订单吗？",
        "cancel_success": "订单取消成功",
        "cancel_failed": "订单取消失败",
        "pay_coming_soon": "支付功能即将上线",
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
            "pending": "请在15分钟内完成支付，否则订单将自动取消",
            "confirmed": "您的预订已确认，祝您旅途愉快！",
            "completed": "感谢您的入住，期待再次光临",
            "cancelled": "该订单已取消"
        },
        "actions": {
            "cancel": "取消订单",
            "pay": "立即支付",
            "save": "暂存",
            "saving": "暂存中..."
        },
        "messages": {
            "save_success": "已暂存到订单，请前往支付",
            "save_failed": "暂存失败，请重试",
            "pay_select_method": "请选择支付方式继续",
            "pay_success": "支付成功！",
            "pay_failed": "支付失败，请重试"
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
        "copied": "已复制到剪贴板",
        "confirm": "确认",
        "cancel": "取消"
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
