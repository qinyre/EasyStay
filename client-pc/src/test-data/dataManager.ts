// 存储键名
const USERS_KEY = "easy-stay-users";
const HOTELS_KEY = "easy-stay-hotels";

// 初始用户数据
const initialUsers = [
  { username: "merchant1", password: "123456", role: "merchant" },
  { username: "admin1", password: "123456", role: "admin" },
];

// 初始酒店数据
const initialHotels = [
  {
    id: "1",
    merchant_id: "merchant1",
    name_cn: "上海陆家嘴禧酒店",
    name_en: "Joy Hotel Lujiazui",
    address: "上海市浦东新区陆家嘴环路1000号",
    star_level: 5,
    rooms: [
      { type: "经典双床房", price: 936, stock: 10 },
      { type: "豪华大床房", price: 1288, stock: 5 },
    ],
    is_offline: false,
    audit_status: "approved",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "2",
    merchant_id: "merchant1",
    name_cn: "北京王府井大酒店",
    name_en: "Wangfujing Hotel Beijing",
    address: "北京市东城区王府井大街50号",
    star_level: 4,
    rooms: [
      { type: "标准间", price: 688, stock: 15 },
      { type: "商务间", price: 888, stock: 8 },
    ],
    is_offline: false,
    audit_status: "pending",
    created_at: "2026-01-02T00:00:00Z",
  },
];

// 初始化数据
const initializeData = () => {
  // 初始化用户数据
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
  }

  // 初始化酒店数据
  if (!localStorage.getItem(HOTELS_KEY)) {
    localStorage.setItem(HOTELS_KEY, JSON.stringify(initialHotels));
  }
};

// 读取用户数据
export const readUsers = () => {
  initializeData(); // 确保数据已初始化
  try {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("读取用户数据失败:", error);
    return [];
  }
};

// 写入用户数据
export const writeUsers = (users: any[]) => {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return true;
  } catch (error) {
    console.error("写入用户数据失败:", error);
    return false;
  }
};

// 读取酒店数据
export const readHotels = () => {
  initializeData(); // 确保数据已初始化
  try {
    const data = localStorage.getItem(HOTELS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("读取酒店数据失败:", error);
    return [];
  }
};

// 写入酒店数据
export const writeHotels = (hotels: any[]) => {
  try {
    localStorage.setItem(HOTELS_KEY, JSON.stringify(hotels));
    return true;
  } catch (error) {
    console.error("写入酒店数据失败:", error);
    return false;
  }
};
