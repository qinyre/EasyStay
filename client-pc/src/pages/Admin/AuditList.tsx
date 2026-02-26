import React, { useState, useEffect } from "react";
import { getHotels, auditHotel } from "../../services/hotel";
import {
  Table,
  Button,
  message,
  Typography,
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

const { Title } = Typography;
const { TextArea } = Input;

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
      console.log("获取酒店列表结果:", result);
      if (result.code === 200 && result.data) {
        // 过滤出待审核的酒店，同时处理大小写问题
        const pendingHotels = result.data.filter(
          (hotel: any) =>
            hotel.audit_status === "pending" ||
            hotel.audit_status === "Pending",
        );
        console.log("待审核酒店:", pendingHotels);
        setHotels(pendingHotels);
      }
    } catch (error) {
      console.error("获取酒店列表失败:", error);
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
    } catch (error) {
      message.error("审核操作失败");
    }
  };

  const showRejectModal = (hotel: any) => {
    setSelectedHotel(hotel);
    setReason("");
    setVisible(true);
  };

  const columns = [
    {
      title: "酒店名称",
      dataIndex: "name_cn",
      key: "name_cn",
    },
    {
      title: "地址",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "星级",
      dataIndex: "star_level",
      key: "star_level",
      render: (starLevel: number) => "★".repeat(starLevel),
    },
    {
      title: "标签",
      dataIndex: "tags",
      key: "tags",
      render: (tags: string[]) => (
        <div>
          {tags && tags.map((tag, index) => <Tag key={index}>{tag}</Tag>)}
        </div>
      ),
    },
    {
      title: "操作",
      key: "action",
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => handleAudit(record, "approved")}
          >
            通过
          </Button>
          <Button
            danger
            icon={<CloseOutlined />}
            onClick={() => showRejectModal(record)}
          >
            拒绝
          </Button>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            查看
          </Button>
        </div>
      ),
    },
  ];

  const handleViewDetail = (hotel: any) => {
    setSelectedHotel(hotel);
    setDetailVisible(true);
  };

  return (
    <AdminLayout>
      <div>
        <Title level={4}>审核管理</Title>

        <Table
          columns={columns}
          dataSource={hotels}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
          }}
          locale={{
            emptyText: <Empty description="暂无待审核酒店" />,
          }}
        />

        <Modal
          title="拒绝原因"
          open={visible}
          onCancel={() => setVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setVisible(false)}>
              取消
            </Button>,
            <Button
              key="submit"
              danger
              onClick={() =>
                selectedHotel && handleAudit(selectedHotel, "rejected")
              }
            >
              确认拒绝
            </Button>,
          ]}
        >
          <TextArea
            rows={4}
            placeholder="请输入拒绝原因"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </Modal>
        <Modal
          title="酒店详情"
          open={detailVisible}
          onCancel={() => setDetailVisible(false)}
          footer={[
            <Button key="close" onClick={() => setDetailVisible(false)}>
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
                  {"★".repeat(selectedHotel.star_level)}
                </Descriptions.Item>
                <Descriptions.Item label="酒店介绍" span={2}>
                  {selectedHotel.description || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="酒店设施" span={2}>
                  {selectedHotel.facilities &&
                    Array.isArray(selectedHotel.facilities) &&
                    selectedHotel.facilities.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedHotel.facilities.map(
                        (
                          facility:
                            | string
                            | number
                            | bigint
                            | boolean
                            | React.ReactElement<
                              unknown,
                              string | React.JSXElementConstructor<any>
                            >
                            | Iterable<React.ReactNode>
                            | React.ReactPortal
                            | Promise<
                              | string
                              | number
                              | bigint
                              | boolean
                              | React.ReactPortal
                              | React.ReactElement<
                                unknown,
                                string | React.JSXElementConstructor<any>
                              >
                              | Iterable<React.ReactNode>
                              | null
                              | undefined
                            >
                            | null
                            | undefined,
                          index: React.Key | null | undefined,
                        ) => (
                          <Tag key={index}>{facility}</Tag>
                        ),
                      )}
                    </div>
                  ) : (
                    "-"
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="开业时间">
                  {selectedHotel.open_date || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="审核状态">
                  <Tag
                    color={
                      selectedHotel.audit_status === "pending" ||
                        selectedHotel.audit_status === "Pending"
                        ? "blue"
                        : selectedHotel.audit_status === "approved" ||
                          selectedHotel.audit_status === "Approved"
                          ? "green"
                          : selectedHotel.audit_status === "rejected" ||
                            selectedHotel.audit_status === "Rejected"
                            ? "red"
                            : "gray"
                    }
                  >
                    {selectedHotel.audit_status === "pending" ||
                      selectedHotel.audit_status === "Pending"
                      ? "待审核"
                      : selectedHotel.audit_status === "approved" ||
                        selectedHotel.audit_status === "Approved"
                        ? "已通过"
                        : selectedHotel.audit_status === "rejected" ||
                          selectedHotel.audit_status === "Rejected"
                          ? "已拒绝"
                          : "未知"}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="酒店标签" span={2}>
                  {selectedHotel.tags && selectedHotel.tags.length > 0
                    ? selectedHotel.tags.map((tag: string, index: number) => (
                      <Tag key={index}>{tag}</Tag>
                    ))
                    : "-"}
                </Descriptions.Item>
              </Descriptions>

              <Card title="房型信息" className="mt-4">
                {selectedHotel.rooms && selectedHotel.rooms.length > 0 ? (
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
                            src={room.image_url.startsWith("http") ? room.image_url : `${API_ORIGIN}${room.image_url}`}
                            alt={room.type_name}
                            style={{ maxWidth: "100%", maxHeight: 80, objectFit: "cover", borderRadius: 4 }}
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
