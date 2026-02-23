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
} from "antd";
import { CheckOutlined, CloseOutlined, EyeOutlined } from "@ant-design/icons";
import AdminLayout from "../../layouts/Layout";

const { Title } = Typography;
const { TextArea } = Input;

const AuditList: React.FC = () => {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
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
    // 实现查看详情逻辑
    message.info("查看详情功能开发中");
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
      </div>
    </AdminLayout>
  );
};

export default AuditList;
