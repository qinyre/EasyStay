import React, { useState, useEffect } from "react";
import { getHotels, publishHotel } from "../../services/hotel";
import { Table, Button, message, Typography, Tag, Empty } from "antd";
import {
  UpCircleOutlined,
  DownCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import AdminLayout from "../../layouts/Layout";

const { Title } = Typography;

const PublishList: React.FC = () => {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const result = await getHotels();
      console.log("获取酒店列表结果:", result);
      if (result.code === 200 && result.data) {
        // 过滤出已通过审核的酒店，同时处理大小写问题
        const approvedHotels = result.data.filter(
          (hotel: any) =>
            hotel.audit_status === "approved" ||
            hotel.audit_status === "Approved",
        );
        console.log("已通过审核酒店:", approvedHotels);
        setHotels(approvedHotels);
      }
    } catch (error) {
      console.error("获取酒店列表失败:", error);
      message.error("获取酒店列表失败");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (hotel: any, isOffline: boolean) => {
    try {
      const result = await publishHotel(hotel.id, isOffline);
      if (result.code === 200) {
        message.success(isOffline ? "酒店已下线" : "酒店已上线");
        fetchHotels();
      } else {
        message.error("操作失败");
      }
    } catch (error) {
      message.error("操作失败");
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
      dataIndex: "is_offline",
      key: "is_offline",
      render: (isOffline: boolean) => (
        <Tag color={isOffline ? "red" : "green"}>
          {isOffline ? "已下线" : "已上线"}
        </Tag>
      ),
    },
    {
      title: "操作",
      key: "action",
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          {record.is_offline ? (
            <Button
              type="primary"
              icon={<UpCircleOutlined />}
              onClick={() => handleStatusChange(record, false)}
            >
              上线
            </Button>
          ) : (
            <Button
              danger
              icon={<DownCircleOutlined />}
              onClick={() => handleStatusChange(record, true)}
            >
              下线
            </Button>
          )}
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
        <Title level={4}>上下线管理</Title>

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
      </div>
    </AdminLayout>
  );
};

export default PublishList;
