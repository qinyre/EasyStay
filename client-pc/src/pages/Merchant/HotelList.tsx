import React, { useState, useEffect } from "react";
import { getHotels, deleteHotel } from "../../services/hotel";
import {
  Table,
  Button,
  message,
  Empty,
  Tag,
  Modal,
  Descriptions,
  Card,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/Layout";
import { API_ORIGIN } from "../../services/config";

/* ── 全局样式注入 ── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400;600&family=Playfair+Display:wght@400;600&display=swap');

  :root {
    --gold: #c9a84c;
    --gold-light: #e8c87a;
    --gold-dim: rgba(201,168,76,0.18);
    --ink: #1a1c24;
    --ink-soft: #2e3240;
    --surface: #faf8f4;
    --surface-card: #ffffff;
    --text-primary: #1a1c24;
    --text-secondary: #6b6f7e;
    --border: rgba(201,168,76,0.2);
    --danger: #c0392b;
    --success: #2e7d52;
    --pending: #1a5fa8;
  }

  .hl-page { font-family: 'Noto Serif SC', serif; background: var(--surface); min-height: 100vh; }

  /* ── 页头 ── */
  .hl-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 28px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--border);
  }
  .hl-header-left { display: flex; align-items: center; gap: 14px; }
  .hl-header-ornament {
    width: 4px; height: 28px;
    background: linear-gradient(180deg, var(--gold) 0%, var(--gold-light) 100%);
    border-radius: 2px;
  }
  .hl-title {
    font-family: 'Playfair Display', 'Noto Serif SC', serif;
    font-size: 22px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
    letter-spacing: 0.03em;
  }
  .hl-subtitle { font-size: 13px; color: var(--text-secondary); margin: 3px 0 0; letter-spacing: 0.05em; }

  /* ── 添加按钮 ── */
  .hl-add-btn {
    background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%) !important;
    border: none !important;
    color: #1a1208 !important;
    font-family: 'Noto Serif SC', serif !important;
    font-size: 13px !important;
    letter-spacing: 0.08em !important;
    height: 38px !important;
    padding: 0 20px !important;
    border-radius: 3px !important;
    box-shadow: 0 2px 8px rgba(201,168,76,0.3) !important;
    transition: all 0.25s !important;
    display: flex !important;
    align-items: center !important;
    gap: 6px !important;
  }
  .hl-add-btn:hover {
    box-shadow: 0 4px 14px rgba(201,168,76,0.45) !important;
    transform: translateY(-1px) !important;
    opacity: 0.92 !important;
  }

  /* ── 统计卡片 ── */
  .hl-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 24px;
  }
  .hl-stat-card {
    background: var(--surface-card);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 18px 22px;
    display: flex;
    align-items: center;
    gap: 14px;
    transition: box-shadow 0.2s;
  }
  .hl-stat-card:hover { box-shadow: 0 4px 16px rgba(201,168,76,0.12); }
  .hl-stat-icon {
    width: 44px; height: 44px; border-radius: 3px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; flex-shrink: 0;
  }
  .hl-stat-icon.gold { background: rgba(201,168,76,0.12); }
  .hl-stat-icon.green { background: rgba(46,125,82,0.1); }
  .hl-stat-icon.blue { background: rgba(26,95,168,0.1); }
  .hl-stat-num { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 600; color: var(--text-primary); line-height: 1; }
  .hl-stat-label { font-size: 12px; color: var(--text-secondary); margin-top: 4px; letter-spacing: 0.05em; }

  /* ── 表格容器 ── */
  .hl-table-wrap {
    background: var(--surface-card);
    border: 1px solid var(--border);
    border-radius: 4px;
    overflow: hidden;
  }

  /* ── 表格覆盖样式 ── */
  .hl-table .ant-table { font-family: 'Noto Serif SC', serif !important; background: transparent !important; }
  .hl-table .ant-table-thead > tr > th {
    background: #f5f0e8 !important;
    color: var(--text-secondary) !important;
    font-size: 12px !important;
    font-weight: 400 !important;
    letter-spacing: 0.1em !important;
    border-bottom: 1px solid var(--border) !important;
    padding: 14px 20px !important;
    font-family: 'Noto Serif SC', serif !important;
  }
  .hl-table .ant-table-thead > tr > th::before { display: none !important; }
  .hl-table .ant-table-tbody > tr > td {
    padding: 16px 20px !important;
    border-bottom: 1px solid rgba(201,168,76,0.08) !important;
    font-size: 14px !important;
    color: var(--text-primary) !important;
    transition: all 0.2s !important;
    font-family: 'Noto Serif SC', serif !important;
  }
  .hl-table .ant-table-tbody > tr:hover > td {
    background: #fdf9f0 !important;
  }
  .hl-table .ant-table-tbody > tr:hover > td:first-child {
    box-shadow: inset 3px 0 0 var(--gold) !important;
  }
  .hl-table .ant-table-tbody > tr:last-child > td { border-bottom: none !important; }
  .hl-table .ant-pagination { padding: 16px 20px !important; margin: 0 !important; }
  .hl-table .ant-table-wrapper { background: transparent !important; }

  /* ── 星级 ── */
  .hl-stars { color: var(--gold); letter-spacing: 2px; font-size: 13px; }

  /* ── 状态标签 ── */
  .hl-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 10px; border-radius: 2px;
    font-size: 11px; letter-spacing: 0.06em;
    font-family: 'Noto Serif SC', serif;
    font-weight: 400;
  }
  .hl-badge.approved { background: rgba(46,125,82,0.1); color: var(--success); border: 1px solid rgba(46,125,82,0.2); }
  .hl-badge.pending  { background: rgba(26,95,168,0.1);  color: var(--pending); border: 1px solid rgba(26,95,168,0.2); }
  .hl-badge.rejected { background: rgba(192,57,43,0.1);  color: var(--danger);  border: 1px solid rgba(192,57,43,0.2); }
  .hl-badge.online   { background: rgba(46,125,82,0.1); color: var(--success); border: 1px solid rgba(46,125,82,0.2); }
  .hl-badge.offline  { background: rgba(192,57,43,0.1);  color: var(--danger);  border: 1px solid rgba(192,57,43,0.2); }
  .hl-badge-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; flex-shrink: 0; }
  .hl-reject-tip { font-size: 12px; color: var(--text-secondary); margin-top: 6px; padding: 6px 10px; background: #fdf3f2; border-left: 2px solid rgba(192,57,43,0.4); border-radius: 0 2px 2px 0; }

  /* ── 操作按钮 ── */
  .hl-action-group { display: flex; align-items: center; gap: 4px; }
  .hl-btn-edit, .hl-btn-delete, .hl-btn-view {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 5px 12px; border-radius: 2px; font-size: 12px;
    letter-spacing: 0.05em; cursor: pointer; border: 1px solid;
    font-family: 'Noto Serif SC', serif;
    transition: all 0.2s; background: transparent;
  }
  .hl-btn-edit  { color: #1a5fa8; border-color: rgba(26,95,168,0.3); }
  .hl-btn-edit:hover  { background: rgba(26,95,168,0.06); border-color: rgba(26,95,168,0.5); }
  .hl-btn-delete{ color: var(--danger); border-color: rgba(192,57,43,0.3); }
  .hl-btn-delete:hover{ background: rgba(192,57,43,0.06); border-color: rgba(192,57,43,0.5); }
  .hl-btn-view  { color: var(--text-secondary); border-color: rgba(107,111,126,0.3); }
  .hl-btn-view:hover  { background: rgba(107,111,126,0.06); border-color: rgba(107,111,126,0.5); color: var(--text-primary); }

  /* ── Modal 覆盖 ── */
  .hl-modal .ant-modal-content { border-radius: 4px; overflow: hidden; }
  .hl-modal .ant-modal-header { background: #f5f0e8; padding: 18px 24px; border-bottom: 1px solid var(--border); }
  .hl-modal .ant-modal-title { font-family: 'Playfair Display', 'Noto Serif SC', serif; font-size: 16px; color: var(--text-primary); letter-spacing: 0.05em; }
  .hl-modal .ant-descriptions-item-label { background: #f5f0e8 !important; font-family: 'Noto Serif SC', serif !important; font-size: 13px !important; color: var(--text-secondary) !important; }
  .hl-modal .ant-descriptions-item-content { font-family: 'Noto Serif SC', serif !important; font-size: 14px !important; }
  .hl-modal .ant-card-head { background: #f5f0e8 !important; border-bottom: 1px solid var(--border) !important; }
  .hl-modal .ant-card-head-title { font-family: 'Noto Serif SC', serif !important; font-size: 14px !important; }
  .hl-modal-footer-btn {
    height: 36px !important; padding: 0 20px !important; border-radius: 3px !important;
    font-family: 'Noto Serif SC', serif !important; font-size: 13px !important;
    letter-spacing: 0.05em !important;
  }
  .hl-modal-footer-btn.primary {
    background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%) !important;
    border: none !important; color: #1a1208 !important;
  }
  .hl-modal-footer-btn.danger {
    background: var(--danger) !important; border: none !important; color: #fff !important;
  }

  /* ── 删除对话框 ── */
  .hl-delete-warn { display: flex; align-items: flex-start; gap: 14px; padding: 8px 0; }
  .hl-delete-warn-icon { font-size: 22px; color: #e67e22; flex-shrink: 0; margin-top: 1px; }
  .hl-delete-warn-text { font-family: 'Noto Serif SC', serif; font-size: 14px; color: var(--text-primary); line-height: 1.7; }
  .hl-delete-warn-sub { font-size: 12px; color: var(--text-secondary); margin-top: 4px; }

  /* ── 酒店名称 ── */
  .hl-hotel-name { font-weight: 600; color: var(--text-primary); font-size: 14px; }
  .hl-hotel-addr { font-size: 12px; color: var(--text-secondary); margin-top: 2px; }
`;

const HotelList: React.FC = () => {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailVisible, setDetailVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const [hotelToDelete, setHotelToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const result = await getHotels();
      if (result.code === 200 && result.data) setHotels(result.data);
    } catch {
      message.error("获取酒店列表失败");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    setHotelToDelete(id);
    setDeleteVisible(true);
  };
  const handleViewDetail = (hotel: any) => {
    setSelectedHotel(hotel);
    setDetailVisible(true);
  };

  const confirmDelete = async () => {
    if (hotelToDelete) {
      try {
        const result = await deleteHotel(hotelToDelete);
        if (result.code === 200) {
          message.success("酒店删除成功");
          fetchHotels();
        } else message.error(result.message || "删除酒店失败");
      } catch (error) {
        console.error("删除酒店失败:", error);
        message.error("删除酒店失败");
      } finally {
        setDeleteVisible(false);
        setHotelToDelete(null);
      }
    }
  };

  const auditLabel = (s: string) =>
    s === "pending" || s === "Pending"
      ? "pending"
      : s === "approved" || s === "Approved"
        ? "approved"
        : s === "rejected" || s === "Rejected"
          ? "rejected"
          : "pending";

  const auditText = (s: string) =>
    s === "pending" || s === "Pending"
      ? "待审核"
      : s === "approved" || s === "Approved"
        ? "已通过"
        : s === "rejected" || s === "Rejected"
          ? "已拒绝"
          : "未知";

  // 统计数据
  const totalCount = hotels.length;
  const onlineCount = hotels.filter(
    (h) =>
      (h.audit_status === "approved" || h.audit_status === "Approved") &&
      !h.is_offline,
  ).length;
  const pendingCount = hotels.filter(
    (h) => h.audit_status === "pending" || h.audit_status === "Pending",
  ).length;

  const columns = [
    {
      title: "酒店信息",
      key: "info",
      render: (_: any, record: any) => (
        <div>
          <div className="hl-hotel-name">{record.name_cn}</div>
          <div className="hl-hotel-addr">{record.address}</div>
        </div>
      ),
    },
    {
      title: "星级",
      dataIndex: "star_level",
      key: "star_level",
      width: 120,
      render: (starLevel: number) => (
        <span className="hl-stars">{"★".repeat(starLevel)}</span>
      ),
    },
    {
      title: "状态",
      key: "status",
      width: 200,
      render: (_: any, record: any) => {
        const al = auditLabel(record.audit_status);
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span className={`hl-badge ${al}`}>
              <span className="hl-badge-dot" />
              {auditText(record.audit_status)}
            </span>
            {(record.audit_status === "approved" ||
              record.audit_status === "Approved") && (
              <span
                className={`hl-badge ${record.is_offline ? "offline" : "online"}`}
              >
                <span className="hl-badge-dot" />
                {record.is_offline ? "已下线" : "已上线"}
              </span>
            )}
            {(record.audit_status === "rejected" ||
              record.audit_status === "Rejected") &&
              (record.reject_reason || record.fail_reason) && (
                <div className="hl-reject-tip">
                  {record.reject_reason || record.fail_reason}
                </div>
              )}
          </div>
        );
      },
    },
    {
      title: "操作",
      key: "action",
      width: 180,
      render: (_: any, record: any) => (
        <div className="hl-action-group">
          <button
            className="hl-btn-edit"
            onClick={() => {
              const hotelData = encodeURIComponent(JSON.stringify(record));
              navigate(`/merchant/edit/${record.id}?data=${hotelData}`);
            }}
          >
            <EditOutlined style={{ fontSize: 12 }} />
            编辑
          </button>
          <button
            className="hl-btn-delete"
            onClick={() => handleDelete(record.id)}
          >
            <DeleteOutlined style={{ fontSize: 12 }} />
            删除
          </button>
          <button
            className="hl-btn-view"
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
      <div className="hl-page">
        {/* 页头 */}
        <div className="hl-header">
          <div className="hl-header-left">
            <div className="hl-header-ornament" />
            <div>
              <h1 className="hl-title">我的酒店</h1>
              <p className="hl-subtitle">管理您旗下的所有酒店资产</p>
            </div>
          </div>
          <Button
            className="hl-add-btn"
            icon={<PlusOutlined />}
            onClick={() => navigate("/merchant/add")}
          >
            添加酒店
          </Button>
        </div>

        {/* 统计卡片 */}
        <div className="hl-stats">
          <div className="hl-stat-card">
            <div className="hl-stat-icon gold">🏨</div>
            <div>
              <div className="hl-stat-num">{totalCount}</div>
              <div className="hl-stat-label">酒店总数</div>
            </div>
          </div>
          <div className="hl-stat-card">
            <div className="hl-stat-icon green">✅</div>
            <div>
              <div className="hl-stat-num">{onlineCount}</div>
              <div className="hl-stat-label">已上线</div>
            </div>
          </div>
          <div className="hl-stat-card">
            <div className="hl-stat-icon blue">⏳</div>
            <div>
              <div className="hl-stat-num">{pendingCount}</div>
              <div className="hl-stat-label">待审核</div>
            </div>
          </div>
        </div>

        {/* 表格 */}
        <div className="hl-table-wrap">
          <Table
            className="hl-table"
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

        {/* 详情 Modal */}
        <Modal
          className="hl-modal"
          title="酒店详情"
          open={detailVisible}
          onCancel={() => setDetailVisible(false)}
          footer={[
            <Button
              key="close"
              className="hl-modal-footer-btn"
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
                  <span className="hl-stars">
                    {"★".repeat(selectedHotel.star_level)}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="开业时间">
                  {selectedHotel.open_date || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="审核状态">
                  <span
                    className={`hl-badge ${auditLabel(selectedHotel.audit_status)}`}
                  >
                    <span className="hl-badge-dot" />
                    {auditText(selectedHotel.audit_status)}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="上下线状态">
                  {selectedHotel.is_offline !== undefined && (
                    <span
                      className={`hl-badge ${selectedHotel.is_offline ? "offline" : "online"}`}
                    >
                      <span className="hl-badge-dot" />
                      {selectedHotel.is_offline ? "已下线" : "已上线"}
                    </span>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="拒绝理由">
                  {selectedHotel.reject_reason ||
                    selectedHotel.fail_reason ||
                    "-"}
                </Descriptions.Item>
                <Descriptions.Item label="酒店介绍" span={2}>
                  {selectedHotel.description || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="酒店设施" span={2}>
                  {selectedHotel.facilities?.length > 0
                    ? selectedHotel.facilities.map((f: string, i: number) => (
                        <Tag key={i}>{f}</Tag>
                      ))
                    : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="酒店标签" span={2}>
                  {selectedHotel.tags?.length > 0
                    ? selectedHotel.tags.map((t: string, i: number) => (
                        <Tag key={i}>{t}</Tag>
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
                        {room.name || room.type_name}
                      </Descriptions.Item>
                      <Descriptions.Item label="价格">
                        ¥{room.price}
                      </Descriptions.Item>
                      <Descriptions.Item label="库存">
                        {room.capacity || room.stock}间
                      </Descriptions.Item>
                      <Descriptions.Item label="房型图片">
                        {room.image_url ? (
                          <img
                            src={
                              room.image_url.startsWith("http")
                                ? room.image_url
                                : `${API_ORIGIN}${room.image_url}`
                            }
                            alt={room.name || room.type_name}
                            style={{
                              maxWidth: "100%",
                              maxHeight: 80,
                              objectFit: "cover",
                              borderRadius: 4,
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
              {(selectedHotel.audit_status === "rejected" ||
                selectedHotel.audit_status === "Rejected") &&
                (selectedHotel.reject_reason || selectedHotel.fail_reason) && (
                  <Card title="拒绝原因" className="mt-4">
                    <p>
                      {selectedHotel.reject_reason || selectedHotel.fail_reason}
                    </p>
                  </Card>
                )}
            </div>
          )}
        </Modal>

        {/* 删除确认 Modal */}
        <Modal
          className="hl-modal"
          title="确认删除"
          open={deleteVisible}
          onCancel={() => setDeleteVisible(false)}
          footer={[
            <Button
              key="cancel"
              className="hl-modal-footer-btn"
              onClick={() => setDeleteVisible(false)}
            >
              取消
            </Button>,
            <Button
              key="confirm"
              className="hl-modal-footer-btn danger"
              onClick={confirmDelete}
            >
              确认删除
            </Button>,
          ]}
        >
          <div className="hl-delete-warn">
            <ExclamationCircleOutlined className="hl-delete-warn-icon" />
            <div>
              <div className="hl-delete-warn-text">您确定要删除该酒店吗？</div>
              <div className="hl-delete-warn-sub">
                此操作不可撤销，相关房型数据也将一并删除。
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default HotelList;
