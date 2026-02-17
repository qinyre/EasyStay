import React, { useState, useEffect } from "react";
import { getHotels, auditHotel } from "../../services/hotel";

const AuditList: React.FC = () => {
  const [hotels, setHotels] = useState<any[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<any | null>(null);
  const [reason, setReason] = useState("");
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

  // 处理审核
  const handleAudit = async (hotel: any, status: string) => {
    if (status === "rejected" && !reason) {
      setSelectedHotel(hotel);
      return;
    }

    const result = await auditHotel(
      hotel.id,
      status,
      status === "rejected" ? reason : "",
    );
    if (result.code === 200) {
      setMessage("审核操作成功");
      // 刷新列表
      const hotelsResult = await getHotels();
      if (hotelsResult.code === 200 && hotelsResult.data) {
        setHotels(hotelsResult.data);
      }
      // 重置状态
      setSelectedHotel(null);
      setReason("");
    } else {
      setMessage("审核操作失败：" + result.message);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>酒店审核管理</h2>
      {message && (
        <div style={{ color: "green", marginBottom: "1rem" }}>{message}</div>
      )}

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #ccc" }}>
            <th style={{ padding: "0.5rem" }}>酒店名称</th>
            <th style={{ padding: "0.5rem" }}>星级</th>
            <th style={{ padding: "0.5rem" }}>地址</th>
            <th style={{ padding: "0.5rem" }}>审核状态</th>
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
                {hotel.audit_status === "pending" && "待审核"}
                {hotel.audit_status === "approved" && "已通过"}
                {hotel.audit_status === "rejected" && "已拒绝"}
              </td>
              <td style={{ padding: "0.5rem" }}>
                {hotel.audit_status === "pending" && (
                  <>
                    <button
                      onClick={() => handleAudit(hotel, "approved")}
                      style={{ marginRight: "0.5rem" }}
                    >
                      通过
                    </button>
                    <button
                      onClick={() => handleAudit(hotel, "rejected")}
                      style={{ marginRight: "0.5rem" }}
                    >
                      拒绝
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 拒绝原因弹窗 */}
      {selectedHotel && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "2rem",
              borderRadius: "4px",
              width: "400px",
            }}
          >
            <h3>填写拒绝原因</h3>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="请输入拒绝原因"
              style={{ width: "100%", height: "100px", marginBottom: "1rem" }}
            />
            <button
              onClick={() => handleAudit(selectedHotel, "rejected")}
              style={{ marginRight: "1rem" }}
            >
              确认拒绝
            </button>
            <button
              onClick={() => {
                setSelectedHotel(null);
                setReason("");
              }}
            >
              取消
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditList;
