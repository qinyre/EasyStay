import React, { useState, useEffect } from "react";
import { createHotel, updateHotel, getHotelById } from "../../services/hotel";
import {
  Form,
  Input,
  Select,
  Button,
  message,
  Typography,
  Card,
  Table,
  Upload,
} from "antd";
import { PlusOutlined, MinusOutlined, UploadOutlined } from "@ant-design/icons";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import AdminLayout from "../../layouts/Layout";

const { Title } = Typography;
const { Option } = Select;

const HotelForm: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState([{ type_name: "", price: 0, stock: 0 }]);
  const [initLoading, setInitLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  const isEditMode = !!id;

  // 从URL参数中获取酒店数据
  useEffect(() => {
    if (isEditMode) {
      try {
        const searchParams = new URLSearchParams(location.search);
        const hotelDataStr = searchParams.get("data");
        if (hotelDataStr) {
          const hotel = JSON.parse(decodeURIComponent(hotelDataStr));
          // 填充表单数据
          form.setFieldsValue({
            name_cn: hotel.name_cn,
            name_en: hotel.name_en,
            address: hotel.address,
            star_level: hotel.star_level,
            open_date: hotel.open_date,
            banner_url: hotel.banner_url,
            tags: hotel.tags ? hotel.tags.join(", ") : "",
          });
          // 填充房型数据
          if (hotel.rooms && hotel.rooms.length > 0) {
            setRooms(hotel.rooms);
          }
        }
      } catch (error) {
        console.error("解析酒店数据失败:", error);
      }
    }
  }, [isEditMode, location.search, form]);

  const handleAddRoom = () => {
    setRooms([...rooms, { type_name: "", price: 0, stock: 0 }]);
  };

  const handleRemoveRoom = (index: number) => {
    const newRooms = [...rooms];
    newRooms.splice(index, 1);
    setRooms(newRooms);
  };

  const handleRoomChange = (index: number, field: string, value: any) => {
    const newRooms = [...rooms];
    newRooms[index] = { ...newRooms[index], [field]: value };
    setRooms(newRooms);
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // 处理标签数据，将字符串转换为数组
      const tagsArray = values.tags
        ? values.tags
            .split(",")
            .map((tag: string) => tag.trim())
            .filter((tag: string) => tag)
        : [];

      // 确保 rooms 是数组
      const hotelRooms = Array.isArray(rooms) ? rooms : [];

      // 获取当前登录的商户用户名
      const merchantUsername = localStorage.getItem("username");

      const hotelData = {
        ...values,
        tags: tagsArray,
        rooms: hotelRooms,
        audit_status: "pending",
        is_offline: false,
        merchant_username: merchantUsername,
      };

      let result;
      if (isEditMode) {
        result = await updateHotel(id!, hotelData);
      } else {
        result = await createHotel(hotelData);
      }

      if (result.code === 200) {
        message.success(isEditMode ? "酒店更新成功" : "酒店添加成功");
        navigate("/merchant/hotels");
      } else {
        message.error(
          result.message || (isEditMode ? "酒店更新失败" : "酒店添加失败"),
        );
      }
    } catch (error) {
      message.error("操作失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div>
        <Title level={4}>{isEditMode ? "编辑酒店" : "添加酒店"}</Title>

        <Card className="mt-4" loading={initLoading}>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <div className="grid grid-cols-2 gap-6">
              <Form.Item
                name="name_cn"
                label="酒店中文名"
                rules={[{ required: true, message: "请输入酒店中文名" }]}
              >
                <Input placeholder="请输入酒店中文名" />
              </Form.Item>

              <Form.Item
                name="name_en"
                label="酒店英文名"
                rules={[{ required: true, message: "请输入酒店英文名" }]}
              >
                <Input placeholder="请输入酒店英文名" />
              </Form.Item>

              <Form.Item
                name="address"
                label="酒店地址"
                rules={[{ required: true, message: "请输入酒店地址" }]}
              >
                <Input placeholder="请输入酒店地址" />
              </Form.Item>

              <Form.Item
                name="star_level"
                label="酒店星级"
                rules={[{ required: true, message: "请选择酒店星级" }]}
              >
                <Select placeholder="请选择酒店星级">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Option key={star} value={star}>
                      {"★".repeat(star)}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="open_date"
                label="开业时间"
                rules={[{ required: true, message: "请输入开业时间" }]}
              >
                <Input type="date" />
              </Form.Item>

              <Form.Item
                name="banner_url"
                label="酒店图片"
                rules={[{ required: true, message: "请上传酒店图片" }]}
              >
                <Upload
                  name="file"
                  listType="picture"
                  maxCount={1}
                  action="/merchant/upload"
                  onChange={(info) => {
                    if (info.file.status === "done") {
                      // 上传成功后，将返回的URL设置到表单字段
                      if (info.file.response && info.file.response.data) {
                        form.setFieldsValue({
                          banner_url: info.file.response.data.url,
                        });
                      }
                    }
                  }}
                >
                  <Button icon={<UploadOutlined />}>上传图片</Button>
                </Upload>
              </Form.Item>
            </div>

            <Form.Item name="tags" label="酒店标签">
              <Input placeholder="请输入酒店标签，用逗号分隔" />
            </Form.Item>

            <div className="mt-8">
              <Title level={5}>房型信息</Title>

              <div className="mt-4">
                {rooms.map((room, index) => (
                  <Card key={index} className="mb-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4>房型 {index + 1}</h4>
                      <Button
                        danger
                        icon={<MinusOutlined />}
                        onClick={() => handleRemoveRoom(index)}
                      >
                        删除房型
                      </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <Form.Item
                        label="房型名称"
                        rules={[{ required: true, message: "请输入房型名称" }]}
                      >
                        <Input
                          placeholder="请输入房型名称"
                          value={room.type_name}
                          onChange={(e) =>
                            handleRoomChange(index, "type_name", e.target.value)
                          }
                        />
                      </Form.Item>

                      <Form.Item
                        label="价格"
                        rules={[{ required: true, message: "请输入价格" }]}
                      >
                        <Input
                          type="number"
                          placeholder="请输入价格"
                          value={room.price}
                          onChange={(e) =>
                            handleRoomChange(
                              index,
                              "price",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                        />
                      </Form.Item>

                      <Form.Item
                        label="库存"
                        rules={[{ required: true, message: "请输入库存" }]}
                      >
                        <Input
                          type="number"
                          placeholder="请输入库存"
                          value={room.stock}
                          onChange={(e) =>
                            handleRoomChange(
                              index,
                              "stock",
                              parseInt(e.target.value) || 0,
                            )
                          }
                        />
                      </Form.Item>
                    </div>
                  </Card>
                ))}

                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={handleAddRoom}
                  className="w-full"
                >
                  添加房型
                </Button>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <Button onClick={() => navigate("/merchant/hotels")}>取消</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {isEditMode ? "更新酒店" : "添加酒店"}
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default HotelForm;
