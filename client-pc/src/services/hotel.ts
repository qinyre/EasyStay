import api from "./api";
import { DATA_SOURCE } from "./config";
import { readHotels, writeHotels } from "../test-data/dataManager";

// 定义响应类型
interface HotelResponse {
  code: number;
  data?: any | any[];
  message: string;
}

// 商户端：新增酒店
export const createHotel = async (data: any): Promise<HotelResponse> => {
  // 根据配置选择数据源
  if (DATA_SOURCE === "local") {
    // 获取当前登录的商户ID
    const merchantId =
      localStorage.getItem("username") || localStorage.getItem("token");

    // 本地存储逻辑
    return new Promise<{ code: number; data?: any; message: string }>(
      (resolve) => {
        setTimeout(() => {
          // 读取酒店数据
          const hotels = readHotels();

          // 添加商户ID到酒店数据，并设置默认状态
          const hotelData = {
            id: "new-id-" + Date.now(),
            merchant_id: merchantId,
            //audit_status: "pending", // 默认为待审核状态
            is_offline: true, // 默认为下线状态，等待审核
            ...data,
            // 确保不会被data中的值覆盖
            audit_status: "pending",
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
  } else {
    // 后端API调用
    try {
      // 深度验证和清理数据
      const validatedData = {
        ...data,
        // 确保star_level是数字
        star_level:
          typeof data.star_level === "number" && !isNaN(data.star_level)
            ? data.star_level
            : 3,
        // 确保open_date是字符串
        open_date: typeof data.open_date === "string" ? data.open_date : "",
        // 确保banner_url是字符串
        banner_url:
          typeof data.banner_url === "string"
            ? data.banner_url
            : "https://via.placeholder.com/600x400",
        // 确保tags是数组
        tags: Array.isArray(data.tags) ? data.tags : [],
        // 确保rooms是数组且至少有一个元素
        rooms:
          Array.isArray(data.rooms) && data.rooms.length > 0
            ? data.rooms.map((room: any) => ({
                type_name:
                  typeof room.type_name === "string"
                    ? room.type_name
                    : typeof room.type === "string"
                      ? room.type
                      : "",
                price:
                  typeof room.price === "number" && !isNaN(room.price)
                    ? room.price
                    : 0,
                stock:
                  typeof room.stock === "number" && !isNaN(room.stock)
                    ? room.stock
                    : 0,
              }))
            : [{ type_name: "", price: 0, stock: 0 }],
      };

      // 添加默认状态到请求数据
      const hotelData = {
        ...validatedData,
        audit_status: "pending", // 默认为待审核状态
        is_offline: true, // 默认为下线状态，等待审核
      };

      console.log("发送到后端的数据:", hotelData);

      const result = (await api.post(
        "/merchant/hotels",
        hotelData,
      )) as unknown as HotelResponse;
      return result;
    } catch (error: any) {
      console.error("API调用错误:", error);
      return {
        code: error.code || 500,
        message: error.message || "服务器错误",
      };
    }
  }
};

// 商户端：编辑酒店
export const updateHotel = async (
  id: string,
  data: any,
): Promise<HotelResponse> => {
  // 根据配置选择数据源
  if (DATA_SOURCE === "local") {
    // 获取当前登录的商户ID
    const merchantId =
      localStorage.getItem("username") || localStorage.getItem("token");

    // 本地存储逻辑
    return new Promise<{ code: number; data?: any; message: string }>(
      (resolve) => {
        setTimeout(() => {
          // 读取酒店数据
          const hotels = readHotels();

          // 查找酒店
          const hotelIndex = hotels.findIndex(
            (h: { id: string }) => h.id === id,
          );
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
  } else {
    // 后端API调用
    try {
      const result = (await api.put(
        `/merchant/hotels/${id}`,
        data,
      )) as unknown as HotelResponse;
      return result;
    } catch (error: any) {
      return {
        code: error.code || 500,
        message: error.message || "服务器错误",
      };
    }
  }
};

// 管理员端：审核酒店
export const auditHotel = async (
  id: string,
  status: string,
  reason = "",
): Promise<HotelResponse> => {
  // 根据配置选择数据源
  if (DATA_SOURCE === "local") {
    // 本地存储逻辑
    return new Promise<{ code: number; data?: any; message: string }>(
      (resolve) => {
        setTimeout(() => {
          // 读取酒店数据
          const hotels = readHotels();

          // 查找酒店并更新审核状态
          const hotelIndex = hotels.findIndex(
            (h: { id: string }) => h.id === id,
          );
          if (hotelIndex !== -1) {
            hotels[hotelIndex].audit_status = status;
            // 保存拒绝理由
            if (status === "rejected") {
              hotels[hotelIndex].reject_reason = reason;
            } else {
              // 审核通过或其他状态时清除拒绝理由
              delete hotels[hotelIndex].reject_reason;
            }
            // 审核通过时自动上线
            if (status === "approved") {
              hotels[hotelIndex].is_offline = false;
            }
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
  } else {
    // 后端API调用
    try {
      // 转换状态格式以匹配后端API要求
      let action;
      switch (status) {
        case "approved":
          action = "approve";
          break;
        case "rejected":
          action = "reject";
          break;
        default:
          action = "approve";
      }

      // 审核通过时，需要同时设置上线状态
      const auditData = {
        action: action,
        reason: status === "rejected" ? reason : "",
        // 审核通过时自动上线
        is_offline: status !== "approved",
        // 保存拒绝理由（使用后端期望的字段名）
        fail_reason: status === "rejected" ? reason : null,
        // 同时保留 reject_reason 以兼容前端
        reject_reason: status === "rejected" ? reason : null,
      };

      console.log("发送到后端的审核数据:", auditData);

      console.log("发送到后端的审核数据:", auditData);
      console.log("审核状态:", status);
      console.log("拒绝理由:", reason);
      console.log("API路径:", `/admin/audit/${id}`);

      const result = (await api.patch(
        `/admin/audit/${id}`,
        auditData,
      )) as unknown as HotelResponse;

      console.log("后端返回的审核结果:", result);
      console.log("后端返回的完整响应:", JSON.stringify(result, null, 2));

      return result;
    } catch (error: any) {
      console.error("审核API调用失败:", error);
      console.error("错误消息:", error.message);
      console.error("错误响应:", error.response);

      return {
        code: error.response?.status || 500,
        message: error.response?.data?.message || "服务器错误",
        data: null,
      };
    }
  }
};

// 管理员端：上下线酒店
export const publishHotel = async (
  id: string,
  isOnline: boolean,
): Promise<HotelResponse> => {
  // 根据配置选择数据源
  if (DATA_SOURCE === "local") {
    // 本地存储逻辑
    return new Promise<{ code: number; data?: any; message: string }>(
      (resolve) => {
        setTimeout(() => {
          // 读取酒店数据
          const hotels = readHotels();

          // 查找酒店并更新上下线状态
          const hotelIndex = hotels.findIndex(
            (h: { id: string }) => h.id === id,
          );
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
  } else {
    // 后端API调用
    try {
      const publishData = {
        action: isOnline ? "publish" : "unpublish",
      };

      console.log("发送到后端的上下线数据:", publishData);

      const result = (await api.patch(
        `/admin/publish/${id}`,
        publishData,
      )) as unknown as HotelResponse;
      return result;
    } catch (error: any) {
      console.error("上下线API调用错误:", error);
      return {
        code: error.code || 500,
        message: error.message || "服务器错误",
      };
    }
  }
};

// 获取酒店列表
export const getHotels = async (): Promise<HotelResponse> => {
  // 根据配置选择数据源
  if (DATA_SOURCE === "local") {
    // 获取当前登录的用户角色和ID
    const role = localStorage.getItem("role");
    const merchantId =
      localStorage.getItem("username") || localStorage.getItem("token");

    // 本地存储逻辑
    return new Promise<{ code: number; data?: any[]; message: string }>(
      (resolve) => {
        setTimeout(() => {
          // 读取酒店数据
          const hotels = readHotels();
          console.log("读取到的酒店数据:", hotels);
          console.log("当前用户角色:", role);

          let filteredHotels = hotels;

          // 如果是商户，只返回自己的酒店
          if (role === "merchant" && merchantId) {
            filteredHotels = hotels.filter(
              (h: { merchant_id: string }) => h.merchant_id === merchantId,
            );
            console.log("商户ID:", merchantId);
            console.log("过滤后的酒店数据:", filteredHotels);
          } else {
            // 管理员或其他角色，返回所有酒店
            filteredHotels = hotels;
            console.log("管理员模式，返回所有酒店:", filteredHotels);
          }

          resolve({ code: 200, data: filteredHotels, message: "success" });
        }, 500);
      },
    );
  } else {
    // 后端API调用
    try {
      const role = localStorage.getItem("role");
      let result;

      if (role === "merchant") {
        // 商户获取自己的酒店
        result = (await api.get(
          "/merchant/hotels",
        )) as unknown as HotelResponse;
      } else {
        // 管理员获取所有酒店 - 先尝试管理员API，如果失败则回退到本地存储
        try {
          result = (await api.get("/admin/hotels")) as unknown as HotelResponse;
        } catch (adminError) {
          console.error("管理员API调用失败，回退到本地存储:", adminError);
          // 回退到本地存储
          const hotels = readHotels();
          result = { code: 200, data: hotels, message: "success" };
        }
      }

      // 确保返回的数据格式正确
      if (result && result.data && !Array.isArray(result.data)) {
        // 如果data不是数组，包装成数组
        result.data = [result.data];
      }
      // 确保酒店状态正确
      if (result && result.data && Array.isArray(result.data)) {
        result.data = result.data.map((hotel: any) => {
          // 确保拒绝理由字段名正确
          if (!hotel.reject_reason && hotel.reason) {
            hotel.reject_reason = hotel.reason;
          }
          // 映射后端的fail_reason字段到前端的reject_reason
          if (!hotel.reject_reason && hotel.fail_reason) {
            hotel.reject_reason = hotel.fail_reason;
          }

          // 如果酒店处于待审核状态，强制设置为下线
          if (
            hotel.audit_status === "pending" ||
            hotel.audit_status === "Pending"
          ) {
            return { ...hotel, is_offline: true };
          }
          // 如果酒店处于拒绝状态，强制设置为下线
          if (
            hotel.audit_status === "rejected" ||
            hotel.audit_status === "Rejected"
          ) {
            return { ...hotel, is_offline: true };
          }
          return hotel;
        });
      }

      console.log("获取酒店列表结果:", result);

      return result;
    } catch (error: any) {
      return {
        code: error.code || 500,
        message: error.message || "服务器错误",
        data: [],
      };
    }
  }
};

// 根据ID获取酒店详情
export const getHotelById = async (id: string): Promise<HotelResponse> => {
  // 根据配置选择数据源
  if (DATA_SOURCE === "local") {
    // 本地存储逻辑
    return new Promise<{ code: number; data?: any; message: string }>(
      (resolve) => {
        setTimeout(() => {
          // 读取酒店数据
          const hotels = readHotels();

          // 查找酒店
          const hotel = hotels.find((h: { id: string }) => h.id === id);
          if (hotel) {
            resolve({ code: 200, data: hotel, message: "success" });
          } else {
            resolve({ code: 404, message: "酒店不存在" });
          }
        }, 500);
      },
    );
  } else {
    // 后端API调用
    try {
      const role = localStorage.getItem("role");
      let result;

      if (role === "merchant") {
        // 商户获取自己的酒店详情
        result = (await api.get(
          `/merchant/hotels/${id}`,
        )) as unknown as HotelResponse;
      } else {
        // 管理员获取酒店详情
        result = (await api.get(
          `/admin/hotels/${id}`,
        )) as unknown as HotelResponse;
      }

      console.log("获取酒店详情结果:", result);

      return result;
    } catch (error: any) {
      return {
        code: error.code || 500,
        message: error.message || "服务器错误",
      };
    }
  }
};

// 删除酒店
export const deleteHotel = async (id: string): Promise<HotelResponse> => {
  // 根据配置选择数据源
  if (DATA_SOURCE === "local") {
    // 获取当前登录的商户ID
    const merchantId =
      localStorage.getItem("username") || localStorage.getItem("token");

    // 本地存储逻辑
    return new Promise<{ code: number; data?: any; message: string }>(
      (resolve) => {
        setTimeout(() => {
          // 读取酒店数据
          const hotels = readHotels();

          // 查找酒店
          const hotelIndex = hotels.findIndex(
            (h: { id: string }) => h.id === id,
          );
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

          // 删除酒店
          hotels.splice(hotelIndex, 1);

          // 写入数据
          writeHotels(hotels);

          resolve({ code: 200, message: "success" });
        }, 500);
      },
    );
  } else {
    // 后端API调用
    try {
      const result = (await api.delete(
        `/merchant/hotels/${id}`,
      )) as unknown as HotelResponse;
      return result;
    } catch (error: any) {
      console.error("删除酒店API调用错误:", error);
      return {
        code: error.code || 500,
        message: error.message || "服务器错误",
      };
    }
  }
};
