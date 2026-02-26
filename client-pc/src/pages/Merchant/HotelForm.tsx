import React, { useState, useEffect } from "react";
import { createHotel, updateHotel } from "../../services/hotel";
import { Form, Input, Select, Button, message, Upload } from "antd";
import {
  PlusOutlined,
  MinusOutlined,
  UploadOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import AdminLayout from "../../layouts/Layout";
import { API_ORIGIN } from "../../services/config";
import { HOTEL_FACILITIES } from "../../constants/facilities";
import { HOTEL_TAGS } from "../../constants/hotelTags";

const { Option } = Select;

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
    --border-input: #d9cdb8;
    --danger: #c0392b;
  }

  .hf-page { font-family: 'Noto Serif SC', serif; background: var(--surface); min-height: 100vh; }

  /* 页头 */
  .hf-header { display: flex; align-items: center; gap: 14px; margin-bottom: 28px; padding-bottom: 20px; border-bottom: 1px solid var(--border); }
  .hf-header-ornament { width: 4px; height: 28px; background: linear-gradient(180deg, var(--gold) 0%, var(--gold-light) 100%); border-radius: 2px; flex-shrink: 0; }
  .hf-title { font-family: 'Playfair Display', 'Noto Serif SC', serif; font-size: 22px; font-weight: 600; color: var(--text-primary); margin: 0; letter-spacing: 0.03em; }
  .hf-subtitle { font-size: 13px; color: var(--text-secondary); margin: 3px 0 0; letter-spacing: 0.05em; }

  /* 卡片 */
  .hf-section {
    background: var(--surface-card);
    border: 1px solid var(--border);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 20px;
  }
  .hf-section-head {
    display: flex; align-items: center; gap: 10px;
    padding: 16px 24px;
    background: #f5f0e8;
    border-bottom: 1px solid var(--border);
  }
  .hf-section-head-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--gold); flex-shrink: 0; }
  .hf-section-title { font-family: 'Playfair Display', 'Noto Serif SC', serif; font-size: 15px; font-weight: 600; color: var(--text-primary); margin: 0; letter-spacing: 0.04em; }
  .hf-section-body { padding: 24px; }

  /* 表单覆盖 */
  .hf-form .ant-form-item-label > label {
    font-family: 'Noto Serif SC', serif !important;
    font-size: 13px !important;
    color: var(--text-secondary) !important;
    letter-spacing: 0.06em !important;
    font-weight: 400 !important;
  }
  .hf-form .ant-form-item-label > label::before { color: var(--gold) !important; }
  .hf-form .ant-input, .hf-form .ant-input-affix-wrapper,
  .hf-form .ant-select .ant-select-selector, .hf-form .ant-input-number {
    border-radius: 3px !important;
    font-family: 'Noto Serif SC', serif !important;
    font-size: 14px !important;
    border-color: var(--border-input) !important;
    transition: all 0.2s !important;
  }
  .hf-form .ant-input:focus, .hf-form .ant-input-affix-wrapper:focus,
  .hf-form .ant-input-affix-wrapper-focused,
  .hf-form .ant-select-focused .ant-select-selector {
    border-color: var(--gold) !important;
    box-shadow: 0 0 0 2px rgba(201,168,76,0.12) !important;
  }
  .hf-form .ant-select-selection-item, .hf-form .ant-select-selection-placeholder {
    font-family: 'Noto Serif SC', serif !important;
    font-size: 14px !important;
  }
  .hf-form .ant-input-textarea textarea {
    border-radius: 3px !important;
    font-family: 'Noto Serif SC', serif !important;
    font-size: 14px !important;
    border-color: var(--border-input) !important;
    resize: vertical !important;
  }
  .hf-form .ant-input-textarea textarea:focus {
    border-color: var(--gold) !important;
    box-shadow: 0 0 0 2px rgba(201,168,76,0.12) !important;
  }

  /* 图片上传区 */
  .hf-upload-placeholder {
    width: 100%; height: 160px;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    border: 1.5px dashed var(--border-input); border-radius: 3px;
    color: var(--text-secondary); font-family: 'Noto Serif SC', serif;
    font-size: 13px; cursor: pointer; transition: all 0.2s;
    background: #faf8f4;
  }
  .hf-upload-placeholder:hover { border-color: var(--gold); color: #8a6f2a; background: rgba(201,168,76,0.04); }
  .hf-upload-icon { font-size: 28px; margin-bottom: 8px; color: var(--gold); }

  /* 房型卡片 */
  .hf-room-card {
    background: #faf8f4;
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 20px;
    margin-bottom: 16px;
    position: relative;
  }
  .hf-room-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
  .hf-room-index {
    display: flex; align-items: center; gap: 10px;
  }
  .hf-room-num {
    width: 28px; height: 28px; border-radius: 50%;
    background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%);
    color: #1a1208; font-size: 13px; font-weight: 600;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Playfair Display', serif;
  }
  .hf-room-label { font-size: 14px; font-weight: 600; color: var(--text-primary); letter-spacing: 0.04em; }

  .hf-btn-remove-room {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 5px 12px; border-radius: 3px; font-size: 12px; letter-spacing: 0.05em;
    cursor: pointer; font-family: 'Noto Serif SC', serif;
    background: transparent; border: 1px solid rgba(192,57,43,0.3); color: var(--danger); transition: all 0.2s;
  }
  .hf-btn-remove-room:hover { background: rgba(192,57,43,0.06); border-color: var(--danger); }

  /* 添加房型按钮 */
  .hf-add-room-btn {
    width: 100%; height: 48px;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    border: 1.5px dashed rgba(201,168,76,0.4); border-radius: 3px;
    background: transparent; color: #8a6f2a; font-family: 'Noto Serif SC', serif;
    font-size: 14px; letter-spacing: 0.06em; cursor: pointer; transition: all 0.2s;
  }
  .hf-add-room-btn:hover { border-color: var(--gold); background: rgba(201,168,76,0.04); }

  /* 房型图片 */
  .hf-room-img-wrap { position: relative; display: inline-block; }
  .hf-room-img { width: 140px; height: 140px; object-fit: cover; border-radius: 3px; border: 1px solid var(--border); display: block; }
  .hf-room-img-del {
    position: absolute; top: 6px; right: 6px;
    width: 22px; height: 22px; border-radius: 50%;
    background: rgba(192,57,43,0.9); color: #fff; border: none;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; cursor: pointer; transition: all 0.2s;
  }
  .hf-room-img-del:hover { background: var(--danger); transform: scale(1.1); }
  .hf-room-img-upload .ant-upload-select { border-radius: 3px !important; border-color: var(--border-input) !important; }
  .hf-room-img-upload .ant-upload-select:hover { border-color: var(--gold) !important; }

  /* 底部操作栏 */
  .hf-footer {
    display: flex; align-items: center; justify-content: flex-end; gap: 12px;
    padding: 20px 24px;
    background: var(--surface-card); border: 1px solid var(--border);
    border-radius: 4px; margin-top: 20px;
  }
  .hf-btn-cancel {
    height: 40px; padding: 0 24px; border-radius: 3px; font-family: 'Noto Serif SC', serif;
    font-size: 14px; letter-spacing: 0.06em; cursor: pointer;
    background: transparent; border: 1px solid var(--border-input); color: var(--text-secondary);
    transition: all 0.2s; display: flex; align-items: center; gap: 6px;
  }
  .hf-btn-cancel:hover { border-color: var(--text-secondary); color: var(--text-primary); }
  .hf-btn-submit {
    height: 40px; padding: 0 32px; border-radius: 3px; font-family: 'Noto Serif SC', serif;
    font-size: 14px; letter-spacing: 0.08em; cursor: pointer;
    background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%);
    border: none; color: #1a1208;
    box-shadow: 0 2px 8px rgba(201,168,76,0.3);
    transition: all 0.2s;
  }
  .hf-btn-submit:hover { box-shadow: 0 4px 14px rgba(201,168,76,0.45); transform: translateY(-1px); }
  .hf-btn-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  /* 提示图片占位说明 */
  .hf-img-hint {
    font-size: 12px; color: var(--text-secondary); margin-top: 8px; letter-spacing: 0.04em;
    display: flex; align-items: center; gap: 6px;
  }
  .hf-img-hint::before { content: ''; display: block; width: 12px; height: 1px; background: var(--border-input); flex-shrink: 0; }
`;

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

  useEffect(() => {
    if (isEditMode) {
      try {
        const searchParams = new URLSearchParams(location.search);
        const hotelDataStr = searchParams.get("data");
        if (hotelDataStr) {
          const hotel = JSON.parse(decodeURIComponent(hotelDataStr));
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
          if (hotel.banner_url) {
            setFileList([
              {
                uid: "-1",
                name: "",
                status: "done",
                url: hotel.banner_url,
                thumbUrl: hotel.banner_url,
              },
            ]);
          }
          if (hotel.rooms?.length > 0) {
            setRooms(
              hotel.rooms.map((room: any) => ({
                name: room.name || room.type_name || "",
                price: room.price || 0,
                capacity: room.capacity || room.stock || 0,
                description: room.description || "",
                image_url: room.image_url || "",
                amenities: room.amenities || [],
              })),
            );
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
    const r = [...rooms];
    r.splice(index, 1);
    setRooms(r);
  };
  const handleRoomChange = (index: number, field: string, value: any) => {
    const r = [...rooms];
    r[index] = { ...r[index], [field]: value };
    setRooms(r);
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      console.log("[DEBUG] Form values from Antd:", {
        description: values.description,
        facilities: values.facilities,
        tags: values.tags,
        banner_url: values.banner_url,
        allKeys: Object.keys(values),
      });
      const tagsArray = Array.isArray(values.tags) ? values.tags : [];
      const hotelRooms = Array.isArray(rooms) ? rooms : [];
      const transformedRooms = hotelRooms.map((room: any) => ({
        name: room.name || room.type_name || "",
        price: room.price || 0,
        capacity: room.capacity || room.stock || 0,
        description: room.description || "",
        image_url: room.image_url || "",
        amenities: room.amenities || [],
      }));
      const merchantUsername = localStorage.getItem("username");
      const hotelData = {
        ...values,
        tags: tagsArray,
        rooms: transformedRooms,
        audit_status: "Pending",
        is_offline: 0,
        merchant_username: merchantUsername,
      };
      const result = isEditMode
        ? await updateHotel(id!, hotelData)
        : await createHotel(hotelData);
      if (result.code === 200) {
        message.success(isEditMode ? "酒店更新成功" : "酒店添加成功");
        navigate("/merchant/hotels");
      } else
        message.error(
          result.message || (isEditMode ? "酒店更新失败" : "酒店添加失败"),
        );
    } catch {
      message.error("操作失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <style>{STYLES}</style>
      <div className="hf-page">
        {/* 页头 */}
        <div className="hf-header">
          <div className="hf-header-ornament" />
          <div>
            <h1 className="hf-title">{isEditMode ? "编辑酒店" : "添加酒店"}</h1>
            <p className="hf-subtitle">
              {isEditMode
                ? "修改酒店信息后将重新提交审核"
                : "填写完整信息后提交审核，审核通过后方可上线"}
            </p>
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="hf-form"
        >
          {/* 基本信息 */}
          <div className="hf-section">
            <div className="hf-section-head">
              <div className="hf-section-head-dot" />
              <h2 className="hf-section-title">基本信息</h2>
            </div>
            <div className="hf-section-body">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0 24px",
                }}
              >
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
              </div>
            </div>
          </div>

          {/* 酒店封面 */}
          <div className="hf-section">
            <div className="hf-section-head">
              <div className="hf-section-head-dot" />
              <h2 className="hf-section-title">酒店封面图片</h2>
            </div>
            <div className="hf-section-body">
              <Form.Item
                name="banner_url"
                label="封面图片"
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
                      if (info.file.response?.data?.url) {
                        const imageUrl = info.file.response.data.url;
                        console.log("上传成功，图片URL:", imageUrl);
                        form.setFieldsValue({ banner_url: imageUrl });
                        const fullImageUrl = imageUrl.startsWith("http")
                          ? imageUrl
                          : `${API_ORIGIN}${imageUrl}`;
                        console.log("完整图片URL:", fullImageUrl);
                        const uploadedFile = {
                          uid: info.file.uid,
                          name: "",
                          status: "done",
                          url: fullImageUrl,
                          thumbUrl: fullImageUrl,
                        };
                        console.log("更新文件列表:", uploadedFile);
                        setFileList([uploadedFile]);
                        form.setFieldsValue({ banner_url: fullImageUrl });
                      } else {
                        console.error(
                          "上传成功但响应数据格式不正确:",
                          info.file.response,
                        );
                      }
                    } else if (info.file.status === "removed") {
                      setFileList([]);
                    } else {
                      setFileList([info.file]);
                    }
                  }}
                  onPreview={() => false}
                  style={{ width: "100%" }}
                >
                  {fileList.length < 1 && (
                    <div className="hf-upload-placeholder">
                      {/* 图片占位区域 — 建议使用 1200×600px 横向酒店外观图 */}
                      {/* 图片路径: /src/images/upload-placeholder.png */}
                      <div className="hf-upload-icon">🖼</div>
                      <div>点击上传酒店封面图片</div>
                      <div
                        style={{ fontSize: 12, marginTop: 6, color: "#aaa" }}
                      >
                        建议尺寸 1200 × 600px，支持 JPG / PNG
                      </div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
              <div className="hf-img-hint">
                封面图将展示在酒店列表页和详情页顶部，建议选用酒店外观或大堂照片
              </div>
            </div>
          </div>

          {/* 描述与标签 */}
          <div className="hf-section">
            <div className="hf-section-head">
              <div className="hf-section-head-dot" />
              <h2 className="hf-section-title">描述与标签</h2>
            </div>
            <div className="hf-section-body">
              <Form.Item name="description" label="酒店介绍">
                <Input.TextArea
                  rows={4}
                  placeholder="请输入酒店描述，如地理位置、周边环境、服务特色等"
                  maxLength={500}
                  showCount
                />
              </Form.Item>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0 24px",
                }}
              >
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
              </div>
            </div>
          </div>

          {/* 房型信息 */}
          <div className="hf-section">
            <div className="hf-section-head">
              <div className="hf-section-head-dot" />
              <h2 className="hf-section-title">房型信息</h2>
            </div>
            <div className="hf-section-body">
              {rooms.map((room, index) => (
                <div key={index} className="hf-room-card">
                  <div className="hf-room-head">
                    <div className="hf-room-index">
                      <div className="hf-room-num">{index + 1}</div>
                      <div className="hf-room-label">房型 {index + 1}</div>
                    </div>
                    <button
                      className="hf-btn-remove-room"
                      type="button"
                      onClick={() => handleRemoveRoom(index)}
                    >
                      <MinusOutlined style={{ fontSize: 11 }} />
                      删除房型
                    </button>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: "0 16px",
                    }}
                  >
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
                      label="价格（元/晚）"
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
                      label="库存（间）"
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

                  <Form.Item label="房型图片">
                    {room.image_url && room.image_url.trim() !== "" ? (
                      <div className="hf-room-img-wrap">
                        <img
                          src={
                            room.image_url.startsWith("http")
                              ? room.image_url
                              : `${API_ORIGIN}${room.image_url}`
                          }
                          alt="房型图片"
                          className="hf-room-img"
                        />
                        <button
                          className="hf-room-img-del"
                          type="button"
                          onClick={() =>
                            handleRoomChange(index, "image_url", "")
                          }
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <Upload
                        className="hf-room-img-upload"
                        name="file"
                        listType="picture-card"
                        maxCount={1}
                        action={`${API_ORIGIN}/merchant/upload`}
                        onChange={(info) => {
                          if (info.file.status === "done") {
                            const url = info.file.response?.data?.url;
                            if (url) handleRoomChange(index, "image_url", url);
                          }
                        }}
                      >
                        <div>
                          <UploadOutlined />
                          <div style={{ marginTop: 8, fontSize: 12 }}>
                            上传图片
                          </div>
                        </div>
                      </Upload>
                    )}
                    <div className="hf-img-hint">
                      建议尺寸 800 × 600px，清晰展示房型实景
                    </div>
                  </Form.Item>
                </div>
              ))}

              <button
                className="hf-add-room-btn"
                type="button"
                onClick={handleAddRoom}
              >
                <PlusOutlined />
                添加房型
              </button>
            </div>
          </div>

          {/* 底部操作 */}
          <div className="hf-footer">
            <button
              className="hf-btn-cancel"
              type="button"
              onClick={() => navigate("/merchant/hotels")}
            >
              <ArrowLeftOutlined style={{ fontSize: 12 }} />
              取消
            </button>
            <button className="hf-btn-submit" type="submit" disabled={loading}>
              {loading ? "提交中..." : isEditMode ? "更新酒店" : "提交审核"}
            </button>
          </div>
        </Form>
      </div>
    </AdminLayout>
  );
};

export default HotelForm;
