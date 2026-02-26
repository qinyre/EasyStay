import React, { useState, useEffect } from "react";
import { getHotels, auditHotel } from "../../services/hotel";
import {
  Table,
  Button,
  message,
  Modal,
  Input,
  Tag,
  Empty,
  Descriptions,
  Card,
} from "antd";
import { CheckOutlined, CloseOutlined, EyeOutlined } from "@ant-design/icons";
import AdminLayout from "../../layouts/Layout";
import { API_ORIGIN } from "../../services/config";

const { TextArea } = Input;

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400;600&family=Playfair+Display:wght@400;600&display=swap');

  :root {
    --gold: #c9a84c;
    --gold-light: #e8c87a;
    --ink: #1a1c24;
    --surface: #faf8f4;
    --surface-card: #ffffff;
    --text-primary: #1a1c24;
    --text-secondary: #6b6f7e;
    --border: rgba(201,168,76,0.2);
    --danger: #c0392b;
    --success: #2e7d52;
    --pending: #1a5fa8;
  }

  .al-page { font-family: 'Noto Serif SC', serif; background: var(--surface); min-height: 100vh; }

  .al-header {
    display: flex; align-items: center; gap: 14px;
    margin-bottom: 28px; padding-bottom: 20px;
    border-bottom: 1px solid var(--border);
  }
  .al-header-ornament {
    width: 4px; height: 28px;
    background: linear-gradient(180deg, var(--gold) 0%, var(--gold-light) 100%);
    border-radius: 2px; flex-shrink: 0;
  }
  .al-title { font-family: 'Playfair Display', 'Noto Serif SC', serif; font-size: 22px; font-weight: 600; color: var(--text-primary); margin: 0; letter-spacing: 0.03em; }
  .al-subtitle { font-size: 13px; color: var(--text-secondary); margin: 3px 0 0; letter-spacing: 0.05em; }

  /* 待审核提示条 */
  .al-notice {
    display: flex; align-items: center; gap: 10px;
    background: rgba(201,168,76,0.08); border: 1px solid rgba(201,168,76,0.25);
    border-radius: 3px; padding: 12px 18px; margin-bottom: 20px;
    font-size: 13px; color: #8a6f2a; letter-spacing: 0.04em;
    font-family: 'Noto Serif SC', serif;
  }
  .al-notice-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--gold); flex-shrink: 0; }

  .al-table-wrap { background: var(--surface-card); border: 1px solid var(--border); border-radius: 4px; overflow: hidden; }

  .al-table .ant-table { font-family: 'Noto Serif SC', serif !important; background: transparent !important; }
  .al-table .ant-table-thead > tr > th {
    background: #f5f0e8 !important; color: var(--text-secondary) !important;
    font-size: 12px !important; font-weight: 400 !important; letter-spacing: 0.1em !important;
    border-bottom: 1px solid var(--border) !important; padding: 14px 20px !important;
    font-family: 'Noto Serif SC', serif !important;
  }
  .al-table .ant-table-thead > tr > th::before { display: none !important; }
  .al-table .ant-table-tbody > tr > td {
    padding: 16px 20px !important; border-bottom: 1px solid rgba(201,168,76,0.08) !important;
    font-size: 14px !important; color: var(--text-primary) !important;
    transition: all 0.2s !important; font-family: 'Noto Serif SC', serif !important;
  }
  .al-table .ant-table-tbody > tr:hover > td { background: #fdf9f0 !important; }
  .al-table .ant-table-tbody > tr:hover > td:first-child { box-shadow: inset 3px 0 0 var(--gold) !important; }
  .al-table .ant-table-tbody > tr:last-child > td { border-bottom: none !important; }
  .al-table .ant-pagination { padding: 16px 20px !important; margin: 0 !important; }

  .al-stars { color: var(--gold); letter-spacing: 2px; font-size: 13px; }

  .al-hotel-name { font-weight: 600; color: var(--text-primary); font-size: 14px; }
  .al-hotel-addr { font-size: 12px; color: var(--text-secondary); margin-top: 2px; }

  .al-badge { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 2px; font-size: 11px; letter-spacing: 0.06em; font-family: 'Noto Serif SC', serif; }
  .al-badge.approved { background: rgba(46,125,82,0.1); color: var(--success); border: 1px solid rgba(46,125,82,0.2); }
  .al-badge.pending  { background: rgba(26,95,168,0.1);  color: var(--pending); border: 1px solid rgba(26,95,168,0.2); }
  .al-badge.rejected { background: rgba(192,57,43,0.1);  color: var(--danger);  border: 1px solid rgba(192,57,43,0.2); }
  .al-badge-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; flex-shrink: 0; }

  .al-action-group { display: flex; align-items: center; gap: 6px; }

  /* 通过按钮 - 金色 */
  .al-btn-approve {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 6px 14px; border-radius: 3px; font-size: 12px; letter-spacing: 0.06em;
    cursor: pointer; font-family: 'Noto Serif SC', serif;
    background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%);
    border: none; color: #1a1208; transition: all 0.2s;
    box-shadow: 0 1px 4px rgba(201,168,76,0.25);
  }
  .al-btn-approve:hover { box-shadow: 0 2px 10px rgba(201,168,76,0.4); transform: translateY(-1px); }

  /* 拒绝按钮 */
  .al-btn-reject {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 6px 14px; border-radius: 3px; font-size: 12px; letter-spacing: 0.06em;
    cursor: pointer; font-family: 'Noto Serif SC', serif;
    background: transparent; border: 1px solid rgba(192,57,43,0.35);
    color: var(--danger); transition: all 0.2s;
  }
  .al-btn-reject:hover { background: rgba(192,57,43,0.06); border-color: var(--danger); }

  /* 查看按钮 */
  .al-btn-view {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 6px 14px; border-radius: 3px; font-size: 12px; letter-spacing: 0.06em;
    cursor: pointer; font-family: 'Noto Serif SC', serif;
    background: transparent; border: 1px solid rgba(107,111,126,0.3);
    color: var(--text-secondary); transition: all 0.2s;
  }
  .al-btn-view:hover { background: rgba(107,111,126,0.06); color: var(--text-primary); border-color: rgba(107,111,126,0.5); }

  /* Modal */
  .al-modal .ant-modal-content { border-radius: 4px; overflow: hidden; }
  .al-modal .ant-modal-header { background: #f5f0e8; padding: 18px 24px; border-bottom: 1px solid var(--border); }
  .al-modal .ant-modal-title { font-family: 'Playfair Display', 'Noto Serif SC', serif; font-size: 16px; color: var(--text-primary); letter-spacing: 0.05em; }
  .al-modal .ant-descriptions-item-label { background: #f5f0e8 !important; font-family: 'Noto Serif SC', serif !important; font-size: 13px !important; color: var(--text-secondary) !important; }
  .al-modal .ant-descriptions-item-content { font-family: 'Noto Serif SC', serif !important; font-size: 14px !important; }
  .al-modal .ant-card-head { background: #f5f0e8 !important; border-bottom: 1px solid var(--border) !important; }
  .al-modal .ant-card-head-title { font-family: 'Noto Serif SC', serif !important; font-size: 14px !important; }
  .al-modal .ant-input, .al-modal .ant-input-affix-wrapper { font-family: 'Noto Serif SC', serif !important; border-radius: 3px !important; }
  .al-modal-footer-btn { height: 36px !important; padding: 0 20px !important; border-radius: 3px !important; font-family: 'Noto Serif SC', serif !important; font-size: 13px !important; letter-spacing: 0.05em !important; }
  .al-modal-footer-btn.gold { background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%) !important; border: none !important; color: #1a1208 !important; }
  .al-modal-footer-btn.danger { background: var(--danger) !important; border: none !important; color: #fff !important; }

  .al-reject-label { font-family: 'Noto Serif SC', serif; font-size: 13px; color: var(--text-secondary); margin-bottom: 8px; letter-spacing: 0.05em; }
`;

const AuditList: React.FC = () => {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const [reason, setReason] = useState("");

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const result = await getHotels();
      if (result.code === 200 && result.data) {
        const pendingHotels = result.data.filter(
          (hotel: any) =>
            hotel.audit_status === "pending" ||
            hotel.audit_status === "Pending",
        );
        setHotels(pendingHotels);
      }
    } catch {
      message.error("获取酒店列表失败");
    } finally {
      setLoading(false);
    }
  };

  const handleAudit = async (hotel: any, status: string) => {
    try {
      const result = await auditHotel(
        hotel.id,
        status,
        status === "rejected" ? reason : "",
      );
      if (result.code === 200) {
        message.success(status === "approved" ? "审核通过" : "审核拒绝");
        setVisible(false);
        fetchHotels();
      } else {
        message.error("审核操作失败");
      }
    } catch {
      message.error("审核操作失败");
    }
  };

  const showRejectModal = (hotel: any) => {
    setSelectedHotel(hotel);
    setReason("");
    setVisible(true);
  };
  const handleViewDetail = (hotel: any) => {
    setSelectedHotel(hotel);
    setDetailVisible(true);
  };

  const auditText = (s: string) =>
    s === "pending" || s === "Pending"
      ? "待审核"
      : s === "approved" || s === "Approved"
        ? "已通过"
        : s === "rejected" || s === "Rejected"
          ? "已拒绝"
          : "未知";

  const auditCls = (s: string) =>
    s === "pending" || s === "Pending"
      ? "pending"
      : s === "approved" || s === "Approved"
        ? "approved"
        : s === "rejected" || s === "Rejected"
          ? "rejected"
          : "pending";

  const columns = [
    {
      title: "酒店信息",
      key: "info",
      render: (_: any, record: any) => (
        <div>
          <div className="al-hotel-name">{record.name_cn}</div>
          <div className="al-hotel-addr">{record.address}</div>
        </div>
      ),
    },
    {
      title: "星级",
      dataIndex: "star_level",
      key: "star_level",
      width: 120,
      render: (starLevel: number) => (
        <span className="al-stars">{"★".repeat(starLevel)}</span>
      ),
    },
    {
      title: "标签",
      dataIndex: "tags",
      key: "tags",
      render: (tags: string[]) => (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {tags?.map((tag, i) => (
            <Tag key={i}>{tag}</Tag>
          ))}
        </div>
      ),
    },
    {
      title: "操作",
      key: "action",
      width: 220,
      render: (_: any, record: any) => (
        <div className="al-action-group">
          <button
            className="al-btn-approve"
            onClick={() => handleAudit(record, "approved")}
          >
            <CheckOutlined style={{ fontSize: 11 }} />
            通过
          </button>
          <button
            className="al-btn-reject"
            onClick={() => showRejectModal(record)}
          >
            <CloseOutlined style={{ fontSize: 11 }} />
            拒绝
          </button>
          <button
            className="al-btn-view"
            onClick={() => handleViewDetail(record)}
          >
            <EyeOutlined style={{ fontSize: 11 }} />
            查看
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <style>{STYLES}</style>
      <div className="al-page">
        <div className="al-header">
          <div className="al-header-ornament" />
          <div>
            <h1 className="al-title">审核管理</h1>
            <p className="al-subtitle">审核商户提交的酒店入驻申请</p>
          </div>
        </div>

        {hotels.length > 0 && (
          <div className="al-notice">
            <div className="al-notice-dot" />
            当前共有{" "}
            <strong style={{ margin: "0 4px", color: "#8a6f2a" }}>
              {hotels.length}
            </strong>{" "}
            家酒店等待审核
          </div>
        )}

        <div className="al-table-wrap">
          <Table
            className="al-table"
            columns={columns}
            dataSource={hotels}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50"],
            }}
            locale={{ emptyText: <Empty description="暂无待审核酒店" /> }}
          />
        </div>

        {/* 拒绝原因 Modal */}
        <Modal
          className="al-modal"
          title="填写拒绝原因"
          open={visible}
          onCancel={() => setVisible(false)}
          footer={[
            <Button
              key="cancel"
              className="al-modal-footer-btn"
              onClick={() => setVisible(false)}
            >
              取消
            </Button>,
            <Button
              key="submit"
              className="al-modal-footer-btn danger"
              onClick={() =>
                selectedHotel && handleAudit(selectedHotel, "rejected")
              }
            >
              确认拒绝
            </Button>,
          ]}
        >
          <p className="al-reject-label">
            请说明拒绝该酒店申请的原因，商户将收到此反馈：
          </p>
          <TextArea
            rows={4}
            placeholder="请输入拒绝原因"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            style={{ fontFamily: "'Noto Serif SC', serif", borderRadius: 3 }}
          />
        </Modal>

        {/* 详情 Modal */}
        <Modal
          className="al-modal"
          title="酒店详情"
          open={detailVisible}
          onCancel={() => setDetailVisible(false)}
          footer={[
            <Button
              key="close"
              className="al-modal-footer-btn"
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
                  <span className="al-stars">
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
                  <span
                    className={`al-badge ${auditCls(selectedHotel.audit_status)}`}
                  >
                    <span className="al-badge-dot" />
                    {auditText(selectedHotel.audit_status)}
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
      </div>
    </AdminLayout>
  );
};

export default AuditList;
