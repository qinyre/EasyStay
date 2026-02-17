export const mockHotels = [
  {
    id: "1",
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
