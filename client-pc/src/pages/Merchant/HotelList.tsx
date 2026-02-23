import React, { useState, useEffect } from "react";
import { getHotels } from "../../services/hotel";
import { Table, Button, message, Typography, Empty, Tag } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/Layout";

const { Title } = Typography;

const HotelList: React.FC = () => {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
          {/* <Button
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
          </Button> */}
        </div>
      ),
    },
  ];

  // const handleDelete = (id: string) => {
  //   // 实现删除逻辑
  //   message.info("删除功能开发中");
  // };

  // const handleViewDetail = (hotel: any) => {
  //   // 实现查看详情逻辑
  //   message.info("查看详情功能开发中");
  // };

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
      </div>
    </AdminLayout>
  );
};

export default HotelList;
