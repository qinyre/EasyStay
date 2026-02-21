import api from "./api";
import { mockHotels } from "../mock/hotel";

// 商户端：新增酒店
export const createHotel = async (data: any) => {
  // 模拟API调用
  return new Promise<{ code: number; data?: any; message: string }>(
    (resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          data: { id: "new-id", ...data },
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
  // 模拟API调用
  return new Promise<{ code: number; data?: any; message: string }>(
    (resolve) => {
      setTimeout(() => {
        resolve({ code: 200, data: { id, ...data }, message: "success" });
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
  // 模拟API调用
  return new Promise<{ code: number; data?: any[]; message: string }>(
    (resolve) => {
      setTimeout(() => {
        resolve({ code: 200, data: mockHotels, message: "success" });
      }, 500);
    },
  );
};
