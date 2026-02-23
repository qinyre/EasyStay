import React, { useState, useEffect } from "react";
import { getHotels } from "../../services/hotel";
import {
  Table,
  Button,
  message,
  Typography,
  Empty,
  Tag,
  Modal,
  Descriptions,
  Card,
} from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/Layout";

const { Title } = Typography;

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
      if (result.code === 200 && result.data) {
        setHotels(result.data);
      }
    } catch (error) {
      message.error("获取酒店列表失败");
    } finally {
      setLoading(false);
    }
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
      title: "状态",
      key: "status",
      render: (_: any, record: any) => {
        return (
          <div className="flex flex-col gap-1">
            {/* 审核状态 */}
            <Tag
              color={
                record.audit_status === "pending" ||
                record.audit_status === "Pending"
                  ? "blue"
                  : record.audit_status === "approved" ||
                      record.audit_status === "Approved"
                    ? "green"
                    : record.audit_status === "rejected" ||
                        record.audit_status === "Rejected"
                      ? "red"
                      : "gray"
              }
            >
              {record.audit_status === "pending" ||
              record.audit_status === "Pending"
                ? "待审核"
                : record.audit_status === "approved" ||
                    record.audit_status === "Approved"
                  ? "已通过"
                  : record.audit_status === "rejected" ||
                      record.audit_status === "Rejected"
                    ? "已拒绝"
                    : "未知"}
            </Tag>
            {/* 上下线状态 */}
            {(record.audit_status === "approved" ||
              record.audit_status === "Approved") && (
              <Tag color={record.is_offline ? "red" : "green"}>
                {record.is_offline ? "已下线" : "已上线"}
              </Tag>
            )}
            {/* 拒绝原因 */}
            {(record.audit_status === "rejected" ||
              record.audit_status === "Rejected") &&
              (record.reject_reason || record.fail_reason) && (
                <div className="mt-1">
                  <Tag color="orange">拒绝原因</Tag>
                  <div className="text-sm text-gray-600 mt-1">
                    {record.reject_reason || record.fail_reason}
                  </div>
                </div>
              )}
          </div>
        );
      },
    },
    {
      title: "操作",
      key: "action",
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              // 将酒店数据转换为JSON字符串并编码
              const hotelData = encodeURIComponent(JSON.stringify(record));
              navigate(`/merchant/edit/${record.id}?data=${hotelData}`);
            }}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            查看
          </Button>
        </div>
      ),
    },
  ];

  const handleDelete = (id: string) => {
    setHotelToDelete(id);
    setDeleteVisible(true);
  };

  const confirmDelete = async () => {
    if (hotelToDelete) {
      try {
        // 这里应该调用删除酒店的API
        // 由于我们使用本地存储，直接从本地存储中删除
        const hotels = JSON.parse(localStorage.getItem("hotels") || "[]");
        const updatedHotels = hotels.filter(
          (hotel: any) => hotel.id !== hotelToDelete,
        );
        localStorage.setItem("hotels", JSON.stringify(updatedHotels));
        message.success("酒店删除成功");
        // 刷新酒店列表
        fetchHotels();
      } catch (error) {
        console.error("删除酒店失败:", error);
        message.error("删除酒店失败");
      } finally {
        setDeleteVisible(false);
        setHotelToDelete(null);
      }
    }
  };

  const handleViewDetail = (hotel: any) => {
    setSelectedHotel(hotel);
    setDetailVisible(true);
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <Title level={4}>我的酒店</Title>
          <Button type="primary" onClick={() => navigate("/merchant/add")}>
            添加酒店
          </Button>
        </div>

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
            emptyText: <Empty description="暂无酒店数据" />,
          }}
        />

        {/* 酒店详情模态框 */}
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
                <Descriptions.Item label="上下线状态">
                  {selectedHotel.is_offline !== undefined && (
                    <Tag color={selectedHotel.is_offline ? "red" : "green"}>
                      {selectedHotel.is_offline ? "已下线" : "已上线"}
                    </Tag>
                  )}
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

        {/* 删除确认模态框 */}
        <Modal
          title="确认删除"
          open={deleteVisible}
          onCancel={() => setDeleteVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setDeleteVisible(false)}>
              取消
            </Button>,
            <Button key="confirm" danger onClick={confirmDelete}>
              确认删除
            </Button>,
          ]}
        >
          <p>您确定要删除该酒店吗？此操作不可撤销。</p>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default HotelList;
