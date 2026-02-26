import React, { useState, useEffect } from "react";
import { createHotel, updateHotel } from "../../services/hotel";
import {
  Form,
  Input,
  Select,
  Button,
  message,
  Typography,
  Card,
  Upload,
} from "antd";
import { PlusOutlined, MinusOutlined, UploadOutlined } from "@ant-design/icons";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import AdminLayout from "../../layouts/Layout";
import { API_ORIGIN } from "../../services/config";
import { HOTEL_FACILITIES } from "../../constants/facilities";
import { HOTEL_TAGS } from "../../constants/hotelTags";

const { Title } = Typography;
const { Option } = Select;

const HotelForm: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState<any[]>([
    {
      name: "",
      price: 0,
      capacity: 0,
      description: "",
      image_url: "",
      amenities: [],
      _fileList: [],
    },
  ]);
  const [fileList, setFileList] = useState<any[]>([]);
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
            tags: hotel.tags || [],
            description: hotel.description || "",
            facilities: hotel.facilities || [],
          });

          // 初始化文件列表，显示已上传的图片
          if (hotel.banner_url) {
            setFileList([
              {
                uid: "-1",
                name: "", // 为空避免显示重复的文件名
                status: "done",
                url: hotel.banner_url,
                thumbUrl: hotel.banner_url, // 添加thumbUrl确保预览图正确显示
              },
            ]);
          }
          // 填充房型数据
          if (hotel.rooms && hotel.rooms.length > 0) {
            const transformedRooms = hotel.rooms.map((room: any) => ({
              name: room.name || room.type_name || "",
              price: room.price || 0,
              capacity: room.capacity || room.stock || 0,
              description: room.description || "",
              image_url: room.image_url || "",
              amenities: room.amenities || [],
            }));
            setRooms(transformedRooms);
          }
        }
      } catch (error) {
        console.error("解析酒店数据失败:", error);
      }
    }
  }, [isEditMode, location.search, form]);

  const handleAddRoom = () => {
    setRooms([
      ...rooms,
      {
        name: "",
        price: 0,
        capacity: 0,
        description: "",
        image_url: "",
        amenities: [],
      },
    ]);
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
      // 调试：查看 Antd Form 收集到的值
      console.log("[DEBUG] Form values from Antd:", {
        description: values.description,
        facilities: values.facilities,
        tags: values.tags,
        banner_url: values.banner_url,
        allKeys: Object.keys(values),
      });
      // tags 已经是数组（来自 Select multiple）
      const tagsArray = Array.isArray(values.tags) ? values.tags : [];

      // 确保 rooms 是数组
      const hotelRooms = Array.isArray(rooms) ? rooms : [];

      // 转换房型数据结构，适配后端Room模型
      const transformedRooms = Array.isArray(hotelRooms)
        ? hotelRooms.map((room: any) => ({
            name: room.name || room.type_name || "",
            price: room.price || 0,
            capacity: room.capacity || room.stock || 0,
            description: room.description || "",
            image_url: room.image_url || "",
            amenities: room.amenities || [],
          }))
        : [];

      // 获取当前登录的商户用户名
      const merchantUsername = localStorage.getItem("username");

      const hotelData = {
        ...values,
        tags: tagsArray,
        rooms: transformedRooms,
        audit_status: "Pending",
        is_offline: 0,
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

        <Card className="mt-4">
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
                  fileList={fileList}
                  action={`${API_ORIGIN}/merchant/upload`}
                  onChange={(info) => {
                    console.log("上传文件信息:", info);

                    if (info.file.status === "done") {
                      // 上传成功后，将返回的URL设置到表单字段
                      if (
                        info.file.response &&
                        info.file.response.data &&
                        info.file.response.data.url
                      ) {
                        const imageUrl = info.file.response.data.url;
                        console.log("上传成功，图片URL:", imageUrl);

                        form.setFieldsValue({
                          banner_url: imageUrl,
                        });

                        // 确保使用完整的图片URL路径
                        const fullImageUrl = imageUrl.startsWith("http")
                          ? imageUrl
                          : `${API_ORIGIN}${imageUrl}`;
                        console.log("完整图片URL:", fullImageUrl);

                        // 上传成功后更新文件列表，确保预览图正确显示
                        const uploadedFile = {
                          uid: info.file.uid,
                          name: "",
                          status: "done",
                          url: fullImageUrl,
                          thumbUrl: fullImageUrl, // 确保thumbUrl设置正确
                        };
                        console.log("更新文件列表:", uploadedFile);
                        setFileList([uploadedFile]);

                        // 同时更新表单字段为完整URL
                        form.setFieldsValue({
                          banner_url: fullImageUrl,
                        });
                      } else {
                        console.error(
                          "上传成功但响应数据格式不正确:",
                          info.file.response,
                        );
                      }
                    } else if (info.file.status === "removed") {
                      // 文件被移除时清空文件列表
                      setFileList([]);
                    } else {
                      // 其他状态（如上传中），更新文件列表以显示上传进度
                      setFileList([info.file]);
                    }
                  }}
                  // 禁用预览功能，避免跳转到登录页面
                  onPreview={() => false}
                  style={{ width: "100%" }}
                >
                  {fileList.length < 1 && (
                    <div
                      style={{
                        width: "100%",
                        height: 200,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px dashed #d9d9d9",
                        borderRadius: 8,
                      }}
                    >
                      <Button icon={<UploadOutlined />}>上传酒店图片</Button>
                    </div>
                  )}
                </Upload>
              </Form.Item>
            </div>

            <Form.Item name="tags" label="酒店标签">
              <Select
                mode="multiple"
                placeholder="请选择酒店标签（用户可通过这些标签筛选酒店）"
                options={HOTEL_TAGS.map((t) => ({
                  label: `${t.icon} ${t.label}`,
                  value: t.id,
                }))}
                maxTagCount="responsive"
              />
            </Form.Item>

            <Form.Item name="description" label="酒店介绍">
              <Input.TextArea
                rows={4}
                placeholder="请输入酒店描述，如地理位置、周边环境、服务特色等"
                maxLength={500}
                showCount
              />
            </Form.Item>

            <Form.Item name="facilities" label="酒店设施">
              <Select
                mode="multiple"
                placeholder="请选择酒店提供的设施"
                options={HOTEL_FACILITIES.map((f) => ({
                  label: `${f.icon} ${f.label}`,
                  value: f.id,
                }))}
                maxTagCount="responsive"
              />
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
                          value={room.name}
                          onChange={(e) =>
                            handleRoomChange(index, "name", e.target.value)
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
                          value={room.capacity}
                          onChange={(e) =>
                            handleRoomChange(
                              index,
                              "capacity",
                              parseInt(e.target.value) || 0,
                            )
                          }
                        />
                      </Form.Item>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        房型图片
                      </label>
                      {room.image_url && room.image_url.trim() !== "" ? (
                        <div className="relative inline-block">
                          <img
                            src={
                              room.image_url.startsWith("http")
                                ? room.image_url
                                : `${API_ORIGIN}${room.image_url}`
                            }
                            alt="房型图片"
                            style={{
                              width: 150,
                              height: 150,
                              objectFit: "cover",
                              borderRadius: 8,
                              border: "1px solid #d9d9d9",
                            }}
                          />
                          <div
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 cursor-pointer hover:bg-red-600"
                            onClick={() =>
                              handleRoomChange(index, "image_url", "")
                            }
                            style={{
                              width: 24,
                              height: 24,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            ✕
                          </div>
                        </div>
                      ) : (
                        <Upload
                          name="file"
                          listType="picture-card"
                          maxCount={1}
                          action={`${API_ORIGIN}/merchant/upload`}
                          onChange={(info) => {
                            if (info.file.status === "done") {
                              const url = info.file.response?.data?.url;
                              if (url) {
                                handleRoomChange(index, "image_url", url);
                              }
                            }
                          }}
                        >
                          <div>
                            <UploadOutlined />
                            <div style={{ marginTop: 8 }}>上传图片</div>
                          </div>
                        </Upload>
                      )}
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
