import api from "./api";
import { readHotels, writeHotels } from "../test-data/dataManager";

// 商户端：新增酒店
export const createHotel = async (data: any) => {
  // 获取当前登录的商户ID
  const merchantId =
    localStorage.getItem("username") || localStorage.getItem("token");

  // 模拟API调用
  return new Promise<{ code: number; data?: any; message: string }>(
    (resolve) => {
      setTimeout(() => {
        // 读取酒店数据
        const hotels = readHotels();

        // 添加商户ID到酒店数据
        const hotelData = {
          id: "new-id-" + Date.now(),
          merchant_id: merchantId,
          ...data,
        };

        // 添加到数组
        hotels.push(hotelData);

        // 写入数据
        writeHotels(hotels);

        resolve({
          code: 200,
          data: hotelData,
          message: "success",
        });
      }, 500);
    },
  );
  // 实际API调用
  // return api.post('/merchant/hotels', data);
};

// 商户端：编辑酒店
export const updateHotel = async (id: string, data: any) => {
  // 获取当前登录的商户ID
  const merchantId =
    localStorage.getItem("username") || localStorage.getItem("token");

  // 模拟API调用
  return new Promise<{ code: number; data?: any; message: string }>(
    (resolve) => {
      setTimeout(() => {
        // 读取酒店数据
        const hotels = readHotels();

        // 查找酒店
        const hotelIndex = hotels.findIndex((h: { id: string }) => h.id === id);
        if (hotelIndex === -1) {
          resolve({ code: 404, message: "酒店不存在" });
          return;
        }

        // 检查是否是当前商户的酒店
        const hotel = hotels[hotelIndex];
        if (hotel.merchant_id !== merchantId) {
          resolve({ code: 403, message: "无权操作此酒店" });
          return;
        }

        // 更新酒店数据
        const updatedHotel = { ...hotel, ...data };
        hotels[hotelIndex] = updatedHotel;

        // 写入数据
        writeHotels(hotels);

        resolve({ code: 200, data: updatedHotel, message: "success" });
      }, 500);
    },
  );
  // 实际API调用
  // return api.put(`/merchant/hotels/${id}`, data);
};

// 管理员端：审核酒店
export const auditHotel = async (id: string, status: string, reason = "") => {
  // 模拟API调用
  return new Promise<{ code: number; data?: any; message: string }>(
    (resolve) => {
      setTimeout(() => {
        // 读取酒店数据
        const hotels = readHotels();

        // 查找酒店并更新审核状态
        const hotelIndex = hotels.findIndex((h: { id: string }) => h.id === id);
        if (hotelIndex !== -1) {
          hotels[hotelIndex].audit_status = status;
          // 写入数据
          writeHotels(hotels);
        }

        resolve({
          code: 200,
          data: { id, audit_status: status },
          message: "success",
        });
      }, 500);
    },
  );
  // 实际API调用
  // return api.patch(`/admin/audit/${id}`, { status, reason });
};

// 管理员端：上下线酒店
export const publishHotel = async (id: string, isOnline: boolean) => {
  // 模拟API调用
  return new Promise<{ code: number; data?: any; message: string }>(
    (resolve) => {
      setTimeout(() => {
        // 读取酒店数据
        const hotels = readHotels();

        // 查找酒店并更新上下线状态
        const hotelIndex = hotels.findIndex((h: { id: string }) => h.id === id);
        if (hotelIndex !== -1) {
          hotels[hotelIndex].is_offline = !isOnline;
          // 写入数据
          writeHotels(hotels);
        }

        resolve({
          code: 200,
          data: { id, is_offline: !isOnline },
          message: "success",
        });
      }, 500);
    },
  );
  // 实际API调用
  // return api.patch(`/admin/publish/${id}`, { is_online: isOnline });
};

// 获取酒店列表
export const getHotels = async () => {
  // 获取当前登录的用户角色和ID
  const role = localStorage.getItem("role");
  const merchantId =
    localStorage.getItem("username") || localStorage.getItem("token");

  // 模拟API调用
  return new Promise<{ code: number; data?: any[]; message: string }>(
    (resolve) => {
      setTimeout(() => {
        // 读取酒店数据
        const hotels = readHotels();

        let filteredHotels = hotels;

        // 如果是商户，只返回自己的酒店
        if (role === "merchant" && merchantId) {
          filteredHotels = hotels.filter(
            (h: { merchant_id: string }) => h.merchant_id === merchantId,
          );
        }

        resolve({ code: 200, data: filteredHotels, message: "success" });
      }, 500);
    },
  );
};

// 实际API调用
// return api.post('/merchant/hotels', data);

// 实际API调用
// return api.put(`/merchant/hotels/${id}`, data);

// 实际API调用
// return api.patch(`/admin/audit/${id}`, { status, reason });

// 实际API调用
// return api.patch(`/admin/publish/${id}`, { is_online: isOnline });
