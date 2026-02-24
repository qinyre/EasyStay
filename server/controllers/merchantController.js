const Hotel = require('../models/Hotel');
const Room = require('../models/Room');
const { Cache } = require('../config/redis');

/**
 * 生成唯一ID的简单方法 (实际生产中应该用 uuid)
 */
const generateId = () => {
    return 'hotel_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

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
                message: '请填写必须的字段：中文名、地址和房型信息'
            });
        }

        // 创建酒店
        const newHotel = new Hotel({
            name_cn: hotelData.name_cn,
            name_en: hotelData.name_en,
            address: hotelData.address,
            star_level: hotelData.star_level,
            banner_url: hotelData.banner_url,
            tags: hotelData.tags,
            audit_status: 'Pending', // 新录入状态必为待审核
            is_offline: false,       // 默认在线（但由于是Pending，也不会展现在移动端）
            merchant_username: req.user?.username // 记录是哪个商户创建的
        });

        const savedHotel = await newHotel.save();

        // 保存房型信息
        if (hotelData.rooms && hotelData.rooms.length > 0) {
            for (const roomData of hotelData.rooms) {
                const room = new Room({
                    name: roomData.name,
                    price: roomData.price,
                    capacity: roomData.capacity,
                    description: roomData.description,
                    image_url: roomData.image_url,
                    amenities: roomData.amenities,
                    hotelId: savedHotel._id
                });
                await room.save();
            }
        }

        // 清除相关缓存
        await Cache.del('banners');

        res.json({
            code: 200,
            data: { id: savedHotel._id },
            message: '酒店录入成功，等待管理员审核'
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

        // 查找酒店
        const hotel = await Hotel.findById(id);
        if (!hotel) {
            return res.status(404).json({ code: 404, message: '找不到该酒店数据' });
        }

        // 检查权限：该酒店是否属于当前商户
        if (hotel.merchant_username && hotel.merchant_username !== req.user.username) {
            return res.status(403).json({ code: 403, message: '无权修改他人的酒店' });
        }

        // 更新酒店基本信息
        hotel.name_cn = updateData.name_cn || hotel.name_cn;
        hotel.name_en = updateData.name_en || hotel.name_en;
        hotel.address = updateData.address || hotel.address;
        hotel.star_level = updateData.star_level || hotel.star_level;
        hotel.banner_url = updateData.banner_url || hotel.banner_url;
        hotel.tags = updateData.tags || hotel.tags;
        hotel.audit_status = 'Pending'; // 重新审核

        await hotel.save();

        // 更新房型信息
        if (updateData.rooms && updateData.rooms.length > 0) {
            // 删除旧房型
            await Room.deleteMany({ hotelId: hotel._id });
            // 创建新房型
            for (const roomData of updateData.rooms) {
                const room = new Room({
                    name: roomData.name,
                    price: roomData.price,
                    capacity: roomData.capacity,
                    description: roomData.description,
                    image_url: roomData.image_url,
                    amenities: roomData.amenities,
                    hotelId: hotel._id
                });
                await room.save();
            }
        }

        // 清除相关缓存
        await Cache.del('banners');
        await Cache.del(`hotel:${hotel._id}`);

        res.json({
            code: 200,
            message: '酒店信息编辑成功，需重新经过审核方可展示'
        });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
};

/**
 * 获取属于该商户的所有酒店（商户后台视角）
 */
const getMyHotels = async (req, res) => {
    try {
        const myHotels = await Hotel.find({ merchant_username: req.user.username });

        // 为每个酒店获取对应的房型信息
        const hotelsWithRooms = await Promise.all(
            myHotels.map(async (hotel) => {
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
 * 上传酒店图片
 */
const uploadImage = (req, res) => {
    // 经过 multer 处理，文件信息会挂载在 req.file 上
    if (!req.file) {
        return res.status(400).json({ code: 400, message: '请选择要上传的图片' });
    }

    // 拼接可在浏览器里访问的静态资源 URL
    const fileUrl = `/uploads/${req.file.filename}`;

    res.json({
        code: 200,
        data: {
            url: fileUrl,
            filename: req.file.filename
        },
        message: '图片上传成功'
    });
};

module.exports = {
    createHotel,
    updateHotel,
    getMyHotels,
    uploadImage
};
