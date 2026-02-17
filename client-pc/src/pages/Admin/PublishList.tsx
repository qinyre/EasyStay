import React, { useState, useEffect } from "react";
import { getHotels, publishHotel } from "../../services/hotel";

const PublishList: React.FC = () => {
  const [hotels, setHotels] = useState<any[]>([]);
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

  // 处理上下线
  const handlePublish = async (hotel: any, isOnline: boolean) => {
    const result = await publishHotel(hotel.id, isOnline);
    if (result.code === 200) {
      setMessage(isOnline ? "酒店已上线" : "酒店已下线");
      // 刷新列表
      const hotelsResult = await getHotels();
      if (hotelsResult.code === 200 && hotelsResult.data) {
        setHotels(hotelsResult.data);
      }
    } else {
      setMessage("操作失败：" + result.message);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>酒店上下线管理</h2>
      {message && (
        <div style={{ color: "green", marginBottom: "1rem" }}>{message}</div>
      )}

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #ccc" }}>
            <th style={{ padding: "0.5rem" }}>酒店名称</th>
            <th style={{ padding: "0.5rem" }}>星级</th>
            <th style={{ padding: "0.5rem" }}>地址</th>
            <th style={{ padding: "0.5rem" }}>状态</th>
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
                {hotel.is_offline ? "已下线" : "已上线"}
              </td>
              <td style={{ padding: "0.5rem" }}>
                {hotel.is_offline ? (
                  <button onClick={() => handlePublish(hotel, true)}>
                    上线
                  </button>
                ) : (
                  <button onClick={() => handlePublish(hotel, false)}>
                    下线
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PublishList;
