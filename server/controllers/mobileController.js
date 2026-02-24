const Hotel = require('../models/Hotel');
const Room = require('../models/Room');
const { Cache } = require('../config/redis');

/**
 * 获取首页 Banner
 */
const getBanners = async (req, res) => {
    try {
        // 尝试从缓存获取
        const cachedBanners = await Cache.get('banners');
        if (cachedBanners) {
            return res.json({
                code: 200,
                data: cachedBanners,
                message: 'success (from cache)'
            });
        }

        // 筛选出有 banner 的精选酒店（已审核且未下线）
        const hotels = await Hotel.find({
            banner_url: { $ne: null, $ne: '' },
            is_offline: false,
            audit_status: 'Approved'
        }).limit(5);

        const banners = hotels.map(h => ({
            id: h._id,
            banner_url: h.banner_url,
            title: h.name_cn
        }));

        // 若无真实数据则返回模拟 Banner
        if (banners.length === 0) {
            banners.push({
                id: 'mock_banner',
                banner_url: 'https://images.unsplash.com/photo-1542314831-c53cd3816002?auto=format&fit=crop&q=80&w=1000',
                title: '欢迎来到 EasyStay'
            });
        }

        // 缓存结果，设置过期时间为1小时
        await Cache.set('banners', banners, 3600);

        res.json({
            code: 200,
            data: banners,
            message: 'success'
        });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
};

/**
 * 酒店列表查询 (支持多条件筛选、分页)
 */
const getHotels = async (req, res) => {
    try {
        const { location, keyword, startDate, endDate, starLevel, page = 1 } = req.query;

        // 生成缓存键
        const cacheKey = `hotels:${location || 'all'}:${keyword || 'none'}:${starLevel || 'all'}:${page}`;

        // 尝试从缓存获取
        const cachedData = await Cache.get(cacheKey);
        if (cachedData) {
            return res.json({
                code: 200,
                data: cachedData,
                message: 'success (from cache)'
            });
        }

        // 构建查询条件
        const query = {
            is_offline: false,
            audit_status: 'Approved'
        };

        // 应用筛选条件
        if (location) {
            query.address = { $regex: location, $options: 'i' };
        }
        if (keyword) {
            query.$or = [
                { name_cn: { $regex: keyword, $options: 'i' } },
                { name_en: { $regex: keyword, $options: 'i' } }
            ];
        }
        if (starLevel) {
            query.star_level = parseInt(starLevel);
        }

        // 分页处理
        const pageSize = 10;
        const skip = (page - 1) * pageSize;

        // 查询酒店总数
        const total = await Hotel.countDocuments(query);
        // 查询酒店列表
        const hotels = await Hotel.find(query).skip(skip).limit(pageSize);

        // 对于列表页，计算一下每家酒店的最低价格用于展示
        const listData = await Promise.all(
            hotels.map(async (h) => {
                const rooms = await Room.find({ hotelId: h._id });
                const minPrice = rooms.length > 0
                    ? Math.min(...rooms.map(r => r.price))
                    : 0;

                return {
                    id: h._id,
                    name_cn: h.name_cn,
                    name_en: h.name_en,
                    address: h.address,
                    star_level: h.star_level,
                    banner_url: h.banner_url,
                    tags: h.tags,
                    min_price: minPrice
                };
            })
        );

        const responseData = {
            list: listData,
            total,
            page: parseInt(page),
            pageSize
        };

        // 缓存结果，设置过期时间为30分钟
        await Cache.set(cacheKey, responseData, 1800);

        res.json({
            code: 200,
            data: responseData,
            message: 'success'
        });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
};

/**
 * 酒店详情获取
 */
const getHotelById = async (req, res) => {
    try {
        const { id } = req.params;

        // 生成缓存键
        const cacheKey = `hotel:${id}`;

        // 尝试从缓存获取
        const cachedHotel = await Cache.get(cacheKey);
        if (cachedHotel) {
            return res.json({
                code: 200,
                data: cachedHotel,
                message: 'success (from cache)'
            });
        }

        // 允许查看的条件（即便下线了，但如果是根据ID精确查找，前端也自己判断，但最好后端过滤）
        const hotel = await Hotel.findOne({ 
            _id: id, 
            audit_status: 'Approved', 
            is_offline: false 
        });

        if (!hotel) {
            return res.status(404).json({ code: 404, message: '酒店不存在或已下线' });
        }

        // 获取房型数据并按价格由低到高排序
        const rooms = await Room.find({ hotelId: hotel._id }).sort({ price: 1 });

        // 构建完整的酒店信息
        const hotelWithRooms = {
            ...hotel.toObject(),
            rooms
        };

        // 缓存结果，设置过期时间为1小时
        await Cache.set(cacheKey, hotelWithRooms, 3600);

        res.json({
            code: 200,
            data: hotelWithRooms,
            message: 'success'
        });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
};

module.exports = {
    getBanners,
    getHotels,
    getHotelById
};
