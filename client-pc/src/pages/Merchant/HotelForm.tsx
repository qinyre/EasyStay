import React, { useState, useEffect } from "react";
import { createHotel, updateHotel, getHotels } from "../../services/hotel";

const HotelForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name_cn: "",
    name_en: "",
    address: "",
    star_level: 3,
    rooms: [{ type: "", price: 0, stock: 0 }],
    open_date: "",
  });
  const [hotels, setHotels] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  // 获取酒店列表
  useEffect(() => {
    const fetchHotels = async () => {
      const result = await getHotels();
      if (result.code === 200 && result.data) {
        setHotels(result.data);
      }
    };
    fetchHotels();
  }, []);

  // 处理表单输入变化
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 处理房型变化
  const handleRoomChange = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    const newRooms = [...formData.rooms];
    (newRooms[index] as any)[field] = value;
    setFormData((prev) => ({ ...prev, rooms: newRooms }));
  };

  // 添加房型
  const addRoom = () => {
    setFormData((prev) => ({
      ...prev,
      rooms: [...prev.rooms, { type: "", price: 0, stock: 0 }],
    }));
  };

  // 删除房型
  const removeRoom = (index: number) => {
    if (formData.rooms.length > 1) {
      const newRooms = formData.rooms.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, rooms: newRooms }));
    }
  };

  // 处理编辑
  const handleEdit = (hotel: any) => {
    setEditingId(hotel.id);
    setFormData({
      name_cn: hotel.name_cn,
      name_en: hotel.name_en,
      address: hotel.address,
      star_level: hotel.star_level,
      rooms: hotel.rooms,
      open_date: hotel.open_date || "",
    });
  };

  // 处理提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      let result;
      if (editingId) {
        result = await updateHotel(editingId, formData);
      } else {
        result = await createHotel(formData);
      }

      if (result.code === 200) {
        setMessage(editingId ? "酒店信息更新成功" : "酒店信息添加成功");
        // 重置表单
        setFormData({
          name_cn: "",
          name_en: "",
          address: "",
          star_level: 3,
          rooms: [{ type: "", price: 0, stock: 0 }],
          open_date: "",
        });
        setEditingId(null);

        // 重新获取酒店列表
        const hotelsResult = await getHotels();
        if (hotelsResult.code === 200 && hotelsResult.data) {
          setHotels(hotelsResult.data);
        }
      } else {
        setMessage("操作失败：" + result.message);
      }
    } catch (error) {
      setMessage("操作失败：" + error);
    }
  };

  // 登出功能
  const handleLogout = () => {
    // 清除localStorage中的用户信息
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    // 跳转到登录页面
    window.location.href = "/login";
  };

  return (
    <div style={{ padding: "2rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h2>酒店信息管理</h2>
        <button onClick={handleLogout} style={{ padding: "0.5rem 1rem" }}>
          登出
        </button>
      </div>

      {/* 表单区域 */}
      <div
        style={{
          maxWidth: 800,
          marginBottom: "2rem",
          padding: "1rem",
          border: "1px solid #ccc",
        }}
      >
        <h3>{editingId ? "编辑酒店" : "添加酒店"}</h3>
        {message && (
          <div style={{ color: "green", marginBottom: "1rem" }}>{message}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label>酒店中文名：</label>
            <input
              type="text"
              name="name_cn"
              value={formData.name_cn}
              onChange={handleChange}
              style={{ width: "100%", padding: "0.5rem" }}
              required
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label>酒店英文名：</label>
            <input
              type="text"
              name="name_en"
              value={formData.name_en}
              onChange={handleChange}
              style={{ width: "100%", padding: "0.5rem" }}
              required
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label>地址：</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              style={{ width: "100%", padding: "0.5rem" }}
              required
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label>星级：</label>
            <select
              name="star_level"
              value={formData.star_level}
              onChange={handleChange}
              style={{ width: "100%", padding: "0.5rem" }}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <option key={star} value={star}>
                  {star}星
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label>开业时间：</label>
            <input
              type="date"
              name="open_date"
              value={formData.open_date}
              onChange={handleChange}
              style={{ width: "100%", padding: "0.5rem" }}
              required
            />
          </div>

          <h4>房型信息</h4>
          {formData.rooms.map((room, index) => (
            <div
              key={index}
              style={{
                marginBottom: "1rem",
                padding: "1rem",
                border: "1px solid #eee",
              }}
            >
              <div style={{ marginBottom: "0.5rem" }}>
                <label>房型：</label>
                <input
                  type="text"
                  value={room.type}
                  onChange={(e) =>
                    handleRoomChange(index, "type", e.target.value)
                  }
                  style={{ width: "100%", padding: "0.5rem" }}
                  required
                />
              </div>
              <div style={{ marginBottom: "0.5rem" }}>
                <label>价格：</label>
                <input
                  type="number"
                  value={room.price}
                  onChange={(e) =>
                    handleRoomChange(index, "price", parseFloat(e.target.value))
                  }
                  style={{ width: "100%", padding: "0.5rem" }}
                  required
                />
              </div>
              <div style={{ marginBottom: "0.5rem" }}>
                <label>库存：</label>
                <input
                  type="number"
                  value={room.stock}
                  onChange={(e) =>
                    handleRoomChange(index, "stock", parseInt(e.target.value))
                  }
                  style={{ width: "100%", padding: "0.5rem" }}
                  required
                />
              </div>
              {formData.rooms.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRoom(index)}
                  style={{ marginRight: "1rem" }}
                >
                  删除房型
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addRoom}
            style={{ marginBottom: "1rem" }}
          >
            添加房型
          </button>

          <button type="submit" style={{ padding: "0.5rem 1rem" }}>
            {editingId ? "更新酒店" : "添加酒店"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setFormData({
                  name_cn: "",
                  name_en: "",
                  address: "",
                  star_level: 3,
                  rooms: [{ type: "", price: 0, stock: 0 }],
                  open_date: "",
                });
              }}
              style={{ marginLeft: "1rem", padding: "0.5rem 1rem" }}
            >
              取消编辑
            </button>
          )}
        </form>
      </div>

      {/* 酒店列表 */}
      <div>
        <h3>酒店列表</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #ccc" }}>
              <th style={{ padding: "0.5rem" }}>酒店名称</th>
              <th style={{ padding: "0.5rem" }}>星级</th>
              <th style={{ padding: "0.5rem" }}>地址</th>
              <th style={{ padding: "0.5rem" }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {hotels.map((hotel) => (
              <tr key={hotel.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "0.5rem" }}>{hotel.name_cn}</td>
                <td style={{ padding: "0.5rem" }}>{hotel.star_level}星</td>
                <td style={{ padding: "0.5rem" }}>{hotel.address}</td>
                <td style={{ padding: "0.5rem" }}>
                  <button
                    onClick={() => handleEdit(hotel)}
                    style={{ marginRight: "0.5rem" }}
                  >
                    编辑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HotelForm;
