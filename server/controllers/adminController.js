const { db } = require('../config/database');
const { Cache } = require('../config/cache');

/**
 * 获取所有酒店列表 (管理员后台视角 - 不分类别)
 */
const getAllHotels = async (req, res) => {
  try {
    const hotels = db.prepare('SELECT * FROM hotels').all();

    const hotelsWithRooms = hotels.map((hotel) => {
      const rooms = db
        .prepare('SELECT * FROM rooms WHERE hotelId = ?')
        .all(hotel.id);
      return {
        ...hotel,
        is_offline: !!hotel.is_offline,
        tags: hotel.tags ? JSON.parse(hotel.tags) : [],
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
 * 审核酒店信息
 * PATCH /admin/audit/:hotelId
 */
const auditHotel = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const { action, fail_reason } = req.body;

    const hotel = db.prepare('SELECT * FROM hotels WHERE id = ?').get(hotelId);
    if (!hotel) {
      return res.status(404).json({ code: 404, message: '酒店不存在' });
    }

    let newStatus, newReason;
    if (action === 'approve') {
      newStatus = 'Approved';
      newReason = '';
    } else if (action === 'reject') {
      newStatus = 'Rejected';
      newReason = fail_reason || '管理员未提供原因';
    } else {
      return res
        .status(400)
        .json({
          code: 400,
          message: '无效的审核操作(action只能是 approve 或 reject)',
        });
    }

    // 当审核通过时，自动将酒店设置为上线状态
    if (action === 'approve') {
      db.prepare(
        'UPDATE hotels SET audit_status = ?, fail_reason = ?, is_offline = 0, updatedAt = ? WHERE id = ?'
      ).run(newStatus, newReason, new Date().toISOString(), hotelId);
    } else {
      db.prepare(
        'UPDATE hotels SET audit_status = ?, fail_reason = ?, updatedAt = ? WHERE id = ?'
      ).run(newStatus, newReason, new Date().toISOString(), hotelId);
    }

    // 清除相关缓存
    await Cache.del('banners');
    await Cache.del(`hotel:v2:${hotelId}`);
    await Cache.del(/^hotels:v2:/);

    res.json({
      code: 200,
      message: `酒店已标识为 ${newStatus}`,
    });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
};

/**
 * 发布/下线酒店 (虚拟删除)
 * PATCH /admin/publish/:hotelId
 */
const publishHotel = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const { action } = req.body;

    const hotel = db.prepare('SELECT * FROM hotels WHERE id = ?').get(hotelId);
    if (!hotel) {
      return res.status(404).json({ code: 404, message: '酒店不存在' });
    }

    if (hotel.audit_status !== 'Approved') {
      return res
        .status(400)
        .json({ code: 400, message: '只有审核通过的酒店支持上下线操作' });
    }

    let isOffline;
    if (action === 'unpublish') {
      isOffline = 1;
    } else if (action === 'publish') {
      isOffline = 0;
    } else {
      return res
        .status(400)
        .json({
          code: 400,
          message: '无效的发布操作(action必须是 publish 或 unpublish)',
        });
    }

    db.prepare(
      'UPDATE hotels SET is_offline = ?, updatedAt = ? WHERE id = ?'
    ).run(isOffline, new Date().toISOString(), hotelId);

    // 清除相关缓存
    await Cache.del('banners');
    await Cache.del(`hotel:v2:${hotelId}`);
    await Cache.del(/^hotels:v2:/);

    res.json({
      code: 200,
      message: action === 'publish' ? '酒店已恢复上线' : '酒店已被下线',
    });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
};

/**
 * 获取单个酒店详情 (管理员后台视角)
 */
const getHotelById = async (req, res) => {
  try {
    const { id } = req.params;

    const hotel = db.prepare('SELECT * FROM hotels WHERE id = ?').get(id);
    if (!hotel) {
      return res.status(404).json({ code: 404, message: '找不到该酒店数据' });
    }

    const rooms = db.prepare('SELECT * FROM rooms WHERE hotelId = ?').all(id);

    res.json({
      code: 200,
      data: {
        ...hotel,
        is_offline: !!hotel.is_offline,
        tags: hotel.tags ? JSON.parse(hotel.tags) : [],
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

module.exports = {
  getAllHotels,
  getHotelById,
  auditHotel,
  publishHotel,
};
