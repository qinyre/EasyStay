const { db } = require('../config/database');
const { Cache } = require('../config/cache');
const crypto = require('crypto');

/**
 * 商户录入酒店信息
 */
const createHotel = async (req, res) => {
  try {
    const hotelData = req.body;

    // 非常基础的校验
    if (!hotelData.name_cn || !hotelData.address || !hotelData.rooms) {
      return res.status(400).json({
        code: 400,
        message: '请填写必须的字段：中文名、地址和房型信息',
      });
    }

    const hotelId = crypto.randomUUID();
    const now = new Date().toISOString();

    // 创建酒店
    db.prepare(
      `
            INSERT INTO hotels (id, name_cn, name_en, address, star_level, open_date, banner_url, description, facilities, tags, audit_status, is_offline, merchant_username, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', 0, ?, ?, ?)
        `
    ).run(
      hotelId,
      hotelData.name_cn,
      hotelData.name_en || null,
      hotelData.address,
      hotelData.star_level || null,
      hotelData.open_date || null,
      hotelData.banner_url || null,
      hotelData.description || null,
      hotelData.facilities ? JSON.stringify(hotelData.facilities) : null,
      hotelData.tags ? JSON.stringify(hotelData.tags) : null,
      req.user?.phone || req.user?.username || null,
      now,
      now
    );

    // 保存房型信息
    if (hotelData.rooms && hotelData.rooms.length > 0) {
      const insertRoom = db.prepare(`
                INSERT INTO rooms (id, name, price, capacity, description, image_url, amenities, hotelId)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `);

      for (const roomData of hotelData.rooms) {
        insertRoom.run(
          crypto.randomUUID(),
          roomData.name,
          roomData.price,
          roomData.capacity || 2,
          roomData.description || null,
          roomData.image_url || null,
          roomData.amenities ? JSON.stringify(roomData.amenities) : null,
          hotelId
        );
      }
    }

    // 清除相关缓存
    await Cache.del('banners');

    res.json({
      code: 200,
      data: { id: hotelId },
      message: '酒店录入成功，等待管理员审核',
    });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
};

/**
 * 商户编辑现有的酒店信息
 */
const updateHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const hotel = db.prepare('SELECT * FROM hotels WHERE id = ?').get(id);
    if (!hotel) {
      return res.status(404).json({ code: 404, message: '找不到该酒店数据' });
    }

    // 检查权限
    const merchantId = req.user?.phone || req.user?.username;
    if (hotel.merchant_username && hotel.merchant_username !== merchantId) {
      return res.status(403).json({ code: 403, message: '无权修改他人的酒店' });
    }

    const now = new Date().toISOString();

    // 调试：输出接收到的数据
    console.log('[DEBUG] updateHotel received data:', {
      description: updateData.description,
      facilities: updateData.facilities,
      tags: updateData.tags
    });

    // 更新酒店基本信息
    db.prepare(
      `
            UPDATE hotels SET
                name_cn = ?, name_en = ?, address = ?, star_level = ?,
                banner_url = ?, description = ?, tags = ?, facilities = ?, open_date = ?, audit_status = 'Pending', updatedAt = ?
            WHERE id = ?
        `
    ).run(
      updateData.name_cn || hotel.name_cn,
      updateData.name_en || hotel.name_en,
      updateData.address || hotel.address,
      updateData.star_level || hotel.star_level,
      updateData.banner_url || hotel.banner_url,
      updateData.description !== undefined ? updateData.description : hotel.description,
      updateData.tags ? JSON.stringify(updateData.tags) : hotel.tags,
      updateData.facilities ? JSON.stringify(updateData.facilities) : hotel.facilities,
      updateData.open_date || hotel.open_date,
      now,
      id
    );

    // 调试：输出更新后的数据
    const updatedHotel = db.prepare('SELECT * FROM hotels WHERE id = ?').get(id);
    console.log('[DEBUG] Hotel after update:', {
      id: updatedHotel.id,
      description: updatedHotel.description,
      facilities: updatedHotel.facilities
    });

    // 更新房型信息
    if (updateData.rooms && updateData.rooms.length > 0) {
      // 删除旧房型
      db.prepare('DELETE FROM rooms WHERE hotelId = ?').run(id);

      // 创建新房型
      const insertRoom = db.prepare(`
                INSERT INTO rooms (id, name, price, capacity, description, image_url, amenities, hotelId)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `);

      for (const roomData of updateData.rooms) {
        insertRoom.run(
          crypto.randomUUID(),
          roomData.name,
          roomData.price,
          roomData.capacity || 2,
          roomData.description || null,
          roomData.image_url || null,
          roomData.amenities ? JSON.stringify(roomData.amenities) : null,
          id
        );
      }
    }

    // 清除相关缓存
    await Cache.del('banners');
    await Cache.del(`hotel:v2:${id}`);
    // 清除所有酒店列表缓存（使用通配符）
    await Cache.del(/^hotels:v2:/);

    res.json({
      code: 200,
      message: '酒店信息编辑成功，需重新经过审核方可展示',
    });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
};

/**
 * 获取属于该商户的所有酒店
 */
const getMyHotels = async (req, res) => {
  try {
    const merchantId = req.user?.phone || req.user?.username;
    const myHotels = db
      .prepare('SELECT * FROM hotels WHERE merchant_username = ?')
      .all(merchantId);

    const hotelsWithRooms = myHotels.map((hotel) => {
      const rooms = db
        .prepare('SELECT * FROM rooms WHERE hotelId = ?')
        .all(hotel.id);
      return {
        ...hotel,
        is_offline: !!hotel.is_offline,
        tags: hotel.tags ? JSON.parse(hotel.tags) : [],
        facilities: hotel.facilities ? JSON.parse(hotel.facilities) : [],
        description: hotel.description || '',
        rooms: rooms.map((r) => ({
          ...r,
          type_name: r.name, // 兼容 PC
          stock: r.capacity, // 兼容 PC
          amenities: r.amenities ? JSON.parse(r.amenities) : [],
        })),
      };
    });

    res.json({
      code: 200,
      data: hotelsWithRooms,
      message: 'success',
    });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
};

/**
 * 商户获取单个酒店详情
 */
const getHotelById = async (req, res) => {
  try {
    const { id } = req.params;
    const merchantId = req.user?.phone || req.user?.username;

    const hotel = db.prepare('SELECT * FROM hotels WHERE id = ?').get(id);
    if (!hotel) {
      return res.status(404).json({ code: 404, message: '找不到该酒店数据' });
    }

    if (hotel.merchant_username && hotel.merchant_username !== merchantId) {
      return res.status(403).json({ code: 403, message: '无权查看他人的酒店' });
    }

    const rooms = db.prepare('SELECT * FROM rooms WHERE hotelId = ?').all(id);

    res.json({
      code: 200,
      data: {
        ...hotel,
        is_offline: !!hotel.is_offline,
        description: hotel.description || '',
        tags: hotel.tags ? JSON.parse(hotel.tags) : [],
        facilities: hotel.facilities ? JSON.parse(hotel.facilities) : [],
        rooms: rooms.map((r) => ({
          ...r,
          type_name: r.name, // 兼容 PC
          stock: r.capacity, // 兼容 PC
          amenities: r.amenities ? JSON.parse(r.amenities) : [],
        })),
      },
      message: 'success',
    });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
};

/**
 * 商户删除单个酒店
 */
const deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const merchantId = req.user?.phone || req.user?.username;

    const hotel = db.prepare('SELECT * FROM hotels WHERE id = ?').get(id);
    if (!hotel) {
      return res.status(404).json({ code: 404, message: '找不到该酒店数据' });
    }

    if (hotel.merchant_username && hotel.merchant_username !== merchantId) {
      return res.status(403).json({ code: 403, message: '无权删除他人的酒店' });
    }

    // 物理删除房型和酒店
    db.prepare('DELETE FROM rooms WHERE hotelId = ?').run(id);
    db.prepare('DELETE FROM hotels WHERE id = ?').run(id);

    // 清理缓存
    await Cache.del('banners');
    await Cache.del(`hotel:${id}`);

    res.json({
      code: 200,
      message: '酒店删除成功',
    });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
};

/**
 * 上传酒店图片
 */
const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ code: 400, message: '请选择要上传的图片' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;

  res.json({
    code: 200,
    data: {
      url: fileUrl,
      filename: req.file.filename,
    },
    message: '图片上传成功',
  });
};

module.exports = {
  createHotel,
  updateHotel,
  getMyHotels,
  uploadImage,
  getHotelById,
  deleteHotel,
};
