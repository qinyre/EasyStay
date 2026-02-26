import React, { useState, useEffect } from "react";
import { getHotels, publishHotel } from "../../services/hotel";
import {
  Table,
  Button,
  message,
  Tag,
  Empty,
  Descriptions,
  Card,
  Modal,
} from "antd";
import {
  UpCircleOutlined,
  DownCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import AdminLayout from "../../layouts/Layout";
import { API_ORIGIN } from "../../services/config";
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400;600&family=Playfair+Display:wght@400;600&display=swap');

  :root {
    --gold: #c9a84c;
    --gold-light: #e8c87a;
    --surface: #faf8f4;
    --surface-card: #ffffff;
    --text-primary: #1a1c24;
    --text-secondary: #6b6f7e;
    --border: rgba(201,168,76,0.2);
    --danger: #c0392b;
    --success: #2e7d52;
  }

  .pl-page { font-family: 'Noto Serif SC', serif; background: var(--surface); min-height: 100vh; }

  .pl-header {
    display: flex; align-items: center; gap: 14px;
    margin-bottom: 28px; padding-bottom: 20px;
    border-bottom: 1px solid var(--border);
  }
  .pl-header-ornament { width: 4px; height: 28px; background: linear-gradient(180deg, var(--gold) 0%, var(--gold-light) 100%); border-radius: 2px; flex-shrink: 0; }
  .pl-title { font-family: 'Playfair Display', 'Noto Serif SC', serif; font-size: 22px; font-weight: 600; color: var(--text-primary); margin: 0; letter-spacing: 0.03em; }
  .pl-subtitle { font-size: 13px; color: var(--text-secondary); margin: 3px 0 0; letter-spacing: 0.05em; }

  /* 统计条 */
  .pl-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 24px; }
  .pl-stat-card { background: var(--surface-card); border: 1px solid var(--border); border-radius: 4px; padding: 18px 22px; display: flex; align-items: center; gap: 14px; transition: box-shadow 0.2s; }
  .pl-stat-card:hover { box-shadow: 0 4px 16px rgba(201,168,76,0.12); }
  .pl-stat-icon { width: 44px; height: 44px; border-radius: 3px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
  .pl-stat-icon.green { background: rgba(46,125,82,0.1); }
  .pl-stat-icon.red { background: rgba(192,57,43,0.1); }
  .pl-stat-num { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 600; color: var(--text-primary); line-height: 1; }
  .pl-stat-label { font-size: 12px; color: var(--text-secondary); margin-top: 4px; letter-spacing: 0.05em; }

  .pl-table-wrap { background: var(--surface-card); border: 1px solid var(--border); border-radius: 4px; overflow: hidden; }

  .pl-table .ant-table { font-family: 'Noto Serif SC', serif !important; background: transparent !important; }
  .pl-table .ant-table-thead > tr > th { background: #f5f0e8 !important; color: var(--text-secondary) !important; font-size: 12px !important; font-weight: 400 !important; letter-spacing: 0.1em !important; border-bottom: 1px solid var(--border) !important; padding: 14px 20px !important; font-family: 'Noto Serif SC', serif !important; }
  .pl-table .ant-table-thead > tr > th::before { display: none !important; }
  .pl-table .ant-table-tbody > tr > td { padding: 16px 20px !important; border-bottom: 1px solid rgba(201,168,76,0.08) !important; font-size: 14px !important; color: var(--text-primary) !important; transition: all 0.2s !important; font-family: 'Noto Serif SC', serif !important; }
  .pl-table .ant-table-tbody > tr:hover > td { background: #fdf9f0 !important; }
  .pl-table .ant-table-tbody > tr:hover > td:first-child { box-shadow: inset 3px 0 0 var(--gold) !important; }
  .pl-table .ant-table-tbody > tr:last-child > td { border-bottom: none !important; }
  .pl-table .ant-pagination { padding: 16px 20px !important; margin: 0 !important; }

  .pl-stars { color: var(--gold); letter-spacing: 2px; font-size: 13px; }
  .pl-hotel-name { font-weight: 600; color: var(--text-primary); font-size: 14px; }
  .pl-hotel-addr { font-size: 12px; color: var(--text-secondary); margin-top: 2px; }

  .pl-badge { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 2px; font-size: 11px; letter-spacing: 0.06em; font-family: 'Noto Serif SC', serif; }
  .pl-badge.online  { background: rgba(46,125,82,0.1); color: var(--success); border: 1px solid rgba(46,125,82,0.2); }
  .pl-badge.offline { background: rgba(192,57,43,0.1); color: var(--danger);  border: 1px solid rgba(192,57,43,0.2); }
  .pl-badge-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; flex-shrink: 0; }

  .pl-action-group { display: flex; align-items: center; gap: 6px; }

  .pl-btn-online {
    display: inline-flex; align-items: center; gap: 5px; padding: 6px 14px;
    border-radius: 3px; font-size: 12px; letter-spacing: 0.06em; cursor: pointer;
    font-family: 'Noto Serif SC', serif;
    background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%);
    border: none; color: #1a1208; transition: all 0.2s;
    box-shadow: 0 1px 4px rgba(201,168,76,0.25);
  }
  .pl-btn-online:hover { box-shadow: 0 2px 10px rgba(201,168,76,0.4); transform: translateY(-1px); }

  .pl-btn-offline {
    display: inline-flex; align-items: center; gap: 5px; padding: 6px 14px;
    border-radius: 3px; font-size: 12px; letter-spacing: 0.06em; cursor: pointer;
    font-family: 'Noto Serif SC', serif;
    background: transparent; border: 1px solid rgba(192,57,43,0.35); color: var(--danger); transition: all 0.2s;
  }
  .pl-btn-offline:hover { background: rgba(192,57,43,0.06); border-color: var(--danger); }

  .pl-btn-view {
    display: inline-flex; align-items: center; gap: 5px; padding: 6px 14px;
    border-radius: 3px; font-size: 12px; letter-spacing: 0.06em; cursor: pointer;
    font-family: 'Noto Serif SC', serif;
    background: transparent; border: 1px solid rgba(107,111,126,0.3); color: var(--text-secondary); transition: all 0.2s;
  }
  .pl-btn-view:hover { background: rgba(107,111,126,0.06); color: var(--text-primary); border-color: rgba(107,111,126,0.5); }

  .pl-modal .ant-modal-content { border-radius: 4px; overflow: hidden; }
  .pl-modal .ant-modal-header { background: #f5f0e8; padding: 18px 24px; border-bottom: 1px solid var(--border); }
  .pl-modal .ant-modal-title { font-family: 'Playfair Display', 'Noto Serif SC', serif; font-size: 16px; color: var(--text-primary); letter-spacing: 0.05em; }
  .pl-modal .ant-descriptions-item-label { background: #f5f0e8 !important; font-family: 'Noto Serif SC', serif !important; font-size: 13px !important; color: var(--text-secondary) !important; }
  .pl-modal .ant-descriptions-item-content { font-family: 'Noto Serif SC', serif !important; font-size: 14px !important; }
  .pl-modal .ant-card-head { background: #f5f0e8 !important; border-bottom: 1px solid var(--border) !important; }
  .pl-modal .ant-card-head-title { font-family: 'Noto Serif SC', serif !important; font-size: 14px !important; }
  .pl-modal-footer-btn { height: 36px !important; padding: 0 20px !important; border-radius: 3px !important; font-family: 'Noto Serif SC', serif !important; font-size: 13px !important; letter-spacing: 0.05em !important; }
`;

const PublishList: React.FC = () => {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const result = await getHotels();
      if (result.code === 200 && result.data) {
        const approvedHotels = result.data.filter(
          (hotel: any) =>
            hotel.audit_status === "approved" ||
            hotel.audit_status === "Approved",
        );
        setHotels(approvedHotels);
      }
    } catch {
      message.error("获取酒店列表失败");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (hotel: any, isOffline: boolean) => {
    try {
      const result = await publishHotel(hotel.id, !isOffline);
      if (result.code === 200) {
        message.success(isOffline ? "酒店已下线" : "酒店已上线");
        fetchHotels();
      } else message.error("操作失败");
    } catch {
      message.error("操作失败");
    }
  };

  const handleViewDetail = (hotel: any) => {
    setSelectedHotel(hotel);
    setDetailVisible(true);
  };

  const onlineCount = hotels.filter((h) => !h.is_offline).length;
  const offlineCount = hotels.filter((h) => h.is_offline).length;

  const auditText = (s: string) =>
    s === "pending" || s === "Pending"
      ? "待审核"
      : s === "approved" || s === "Approved"
        ? "已通过"
        : s === "rejected" || s === "Rejected"
          ? "已拒绝"
          : "未知";

  const columns = [
    {
      title: "酒店信息",
      key: "info",
      render: (_: any, record: any) => (
        <div>
          <div className="pl-hotel-name">{record.name_cn}</div>
          <div className="pl-hotel-addr">{record.address}</div>
        </div>
      ),
    },
    {
      title: "星级",
      dataIndex: "star_level",
      key: "star_level",
      width: 120,
      render: (starLevel: number) => (
        <span className="pl-stars">{"★".repeat(starLevel)}</span>
      ),
    },
    {
      title: "上下线状态",
      dataIndex: "is_offline",
      key: "is_offline",
      width: 140,
      render: (isOffline: boolean) => (
        <span className={`pl-badge ${isOffline ? "offline" : "online"}`}>
          <span className="pl-badge-dot" />
          {isOffline ? "已下线" : "已上线"}
        </span>
      ),
    },
    {
      title: "操作",
      key: "action",
      width: 200,
      render: (_: any, record: any) => (
        <div className="pl-action-group">
          {record.is_offline ? (
            <button
              className="pl-btn-online"
              onClick={() => handleStatusChange(record, false)}
            >
              <UpCircleOutlined style={{ fontSize: 12 }} />
              上线
            </button>
          ) : (
            <button
              className="pl-btn-offline"
              onClick={() => handleStatusChange(record, true)}
            >
              <DownCircleOutlined style={{ fontSize: 12 }} />
              下线
            </button>
          )}
          <button
            className="pl-btn-view"
            onClick={() => handleViewDetail(record)}
          >
            <EyeOutlined style={{ fontSize: 12 }} />
            查看
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <style>{STYLES}</style>
      <div className="pl-page">
        <div className="pl-header">
          <div className="pl-header-ornament" />
          <div>
            <h1 className="pl-title">上下线管理</h1>
            <p className="pl-subtitle">管理已通过审核的酒店上下线状态</p>
          </div>
        </div>

        <div className="pl-stats">
          <div className="pl-stat-card">
            <div className="pl-stat-icon green">🟢</div>
            <div>
              <div className="pl-stat-num">{onlineCount}</div>
              <div className="pl-stat-label">当前上线</div>
            </div>
          </div>
          <div className="pl-stat-card">
            <div className="pl-stat-icon red">🔴</div>
            <div>
              <div className="pl-stat-num">{offlineCount}</div>
              <div className="pl-stat-label">当前下线</div>
            </div>
          </div>
        </div>

        <div className="pl-table-wrap">
          <Table
            className="pl-table"
            columns={columns}
            dataSource={hotels}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50"],
            }}
            locale={{ emptyText: <Empty description="暂无酒店数据" /> }}
          />
        </div>

        <Modal
          className="pl-modal"
          title="酒店详情"
          open={detailVisible}
          onCancel={() => setDetailVisible(false)}
          footer={[
            <Button
              key="close"
              className="pl-modal-footer-btn"
              onClick={() => setDetailVisible(false)}
            >
              关闭
            </Button>,
          ]}
          width={800}
        >
          {selectedHotel && (
            <div>
              <Descriptions bordered column={2}>
                <Descriptions.Item label="酒店名称">
                  {selectedHotel.name_cn}
                </Descriptions.Item>
                <Descriptions.Item label="英文名称">
                  {selectedHotel.name_en || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="地址">
                  {selectedHotel.address}
                </Descriptions.Item>
                <Descriptions.Item label="星级">
                  <span className="pl-stars">
                    {"★".repeat(selectedHotel.star_level)}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="酒店介绍" span={2}>
                  {selectedHotel.description || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="酒店设施" span={2}>
                  {selectedHotel.facilities?.length > 0 ? (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {selectedHotel.facilities.map((f: any, i: number) => (
                        <Tag key={i}>{f}</Tag>
                      ))}
                    </div>
                  ) : (
                    "-"
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="开业时间">
                  {selectedHotel.open_date || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="审核状态">
                  <Tag color="green">
                    {auditText(selectedHotel.audit_status)}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="上下线状态">
                  <span
                    className={`pl-badge ${selectedHotel.is_offline ? "offline" : "online"}`}
                  >
                    <span className="pl-badge-dot" />
                    {selectedHotel.is_offline ? "已下线" : "已上线"}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="酒店标签" span={2}>
                  {selectedHotel.tags?.length > 0
                    ? selectedHotel.tags.map((tag: string, i: number) => (
                        <Tag key={i}>{tag}</Tag>
                      ))
                    : "-"}
                </Descriptions.Item>
              </Descriptions>
              <Card title="房型信息" className="mt-4">
                {selectedHotel.rooms?.length > 0 ? (
                  selectedHotel.rooms.map((room: any, index: number) => (
                    <Descriptions
                      key={index}
                      bordered
                      column={3}
                      className="mb-4"
                    >
                      <Descriptions.Item label="房型名称">
                        {room.type_name}
                      </Descriptions.Item>
                      <Descriptions.Item label="价格">
                        ¥{room.price}
                      </Descriptions.Item>
                      <Descriptions.Item label="库存">
                        {room.stock}间
                      </Descriptions.Item>
                      <Descriptions.Item label="房型图片">
                        {room.image_url ? (
                          <img
                            src={
                              room.image_url.startsWith("http")
                                ? room.image_url
                                : `${API_ORIGIN}${room.image_url}`
                            }
                            alt={room.type_name}
                            style={{
                              width: "120px",
                              height: "120px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              border: "1px solid #f0f0f0",
                              maxWidth: "100%",
                            }}
                          />
                        ) : (
                          "-"
                        )}
                      </Descriptions.Item>
                    </Descriptions>
                  ))
                ) : (
                  <Empty description="暂无房型信息" />
                )}
              </Card>
            </div>
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default PublishList;
