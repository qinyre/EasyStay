const Hotel = require('../models/Hotel');
const Room = require('../models/Room');
const { Cache } = require('../config/redis');

/**
 * 获取所有酒店列表 (管理员后台视角 - 不分类别)
 */
const getAllHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find();

        // 为每个酒店获取对应的房型信息
        const hotelsWithRooms = await Promise.all(
            hotels.map(async (hotel) => {
                const rooms = await Room.find({ hotelId: hotel._id });
                return {
                    ...hotel.toObject(),
                    rooms
                };
            })
        );

        res.json({
            code: 200,
            data: hotelsWithRooms,
            message: 'success'
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
        const { action, fail_reason } = req.body; // action: 'approve' 或 'reject'

        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(404).json({ code: 404, message: '酒店不存在' });
        }

        if (action === 'approve') {
            hotel.audit_status = 'Approved';
            hotel.fail_reason = '';
        } else if (action === 'reject') {
            hotel.audit_status = 'Rejected';
            hotel.fail_reason = fail_reason || '管理员未提供原因';
        } else {
            return res.status(400).json({ code: 400, message: '无效的审核操作(action只能是 approve 或 reject)' });
        }

        await hotel.save();

        // 清除相关缓存
        await Cache.del('banners');
        await Cache.del(`hotel:${hotel._id}`);

        res.json({
            code: 200,
            message: `酒店已标识为 ${hotel.audit_status}`
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
        const { action } = req.body;  // 'publish' (上线) 或 'unpublish' (下线)

        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(404).json({ code: 404, message: '酒店不存在' });
        }

        // 只有审核通过的酒店才能操作上线下线
        if (hotel.audit_status !== 'Approved') {
            return res.status(400).json({ code: 400, message: '只有审核通过的酒店支持上下线操作' });
        }

        // 虚拟删除：仅修改标志位
        if (action === 'unpublish') {
            hotel.is_offline = true;
        } else if (action === 'publish') {
            hotel.is_offline = false;
        } else {
            return res.status(400).json({ code: 400, message: '无效的发布操作(action必须是 publish 或 unpublish)' });
        }

        await hotel.save();

        // 清除相关缓存
        await Cache.del('banners');
        await Cache.del(`hotel:${hotel._id}`);

        res.json({
            code: 200,
            message: action === 'publish' ? '酒店已恢复上线' : '酒店已被下线'
        });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
};

module.exports = {
    getAllHotels,
    auditHotel,
    publishHotel
};
