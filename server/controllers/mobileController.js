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
            id: `banner_${h._id}`,
            name: h.name_cn,
            image: h.banner_url,
            hotelId: h._id
        }));

        // 若无真实数据则返回模拟 Banner
        if (banners.length === 0) {
            banners.push(
                {
                    id: 'banner_1',
                    name: '上海陆家嘴禧酒店',
                    image: 'https://images.unsplash.com/photo-1542314831-c53cd3816002?auto=format&fit=crop&q=80&w=1000',
                    hotelId: 'hotel_123'
                },
                {
                    id: 'banner_2',
                    name: '北京王府井希尔顿酒店',
                    image: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?auto=format&fit=crop&q=80&w=1000',
                    hotelId: 'hotel_456'
                }
            );
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
 * 获取热门城市
 */
const getPopularCities = async (req, res) => {
    try {
        // 尝试从缓存获取
        const cachedCities = await Cache.get('popular_cities');
        if (cachedCities) {
            return res.json({
                code: 200,
                data: cachedCities,
                message: 'success (from cache)'
            });
        }

        // 模拟热门城市数据
        const popularCities = [
            {
                name: '上海',
                image: 'https://images.unsplash.com/photo-1548092372-0d1bd40894a3?auto=format&fit=crop&q=80&w=1000'
            },
            {
                name: '北京',
                image: 'https://images.unsplash.com/photo-1544037835-7f51363191f5?auto=format&fit=crop&q=80&w=1000'
            },
            {
                name: '三亚',
                image: 'https://images.unsplash.com/photo-1568850362944-036d337a2756?auto=format&fit=crop&q=80&w=1000'
            },
            {
                name: '杭州',
                image: 'https://images.unsplash.com/photo-1584273258445-fb11a250d87e?auto=format&fit=crop&q=80&w=1000'
            },
            {
                name: '成都',
                image: 'https://images.unsplash.com/photo-1588298723524-1509f144010d?auto=format&fit=crop&q=80&w=1000'
            }
        ];

        // 缓存结果，设置过期时间为24小时
        await Cache.set('popular_cities', popularCities, 86400);

        res.json({
            code: 200,
            data: popularCities,
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
        const { city, keyword, checkIn, checkOut, starLevel, priceMin, priceMax, tags, page = 1, pageSize = 10 } = req.query;

        // 生成缓存键
        const cacheKey = `hotels:${city || 'all'}:${keyword || 'none'}:${starLevel || 'all'}:${priceMin || '0'}:${priceMax || '99999'}:${tags || 'none'}:${page}:${pageSize}`;

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
        if (city) {
            query.address = { $regex: city, $options: 'i' };
        }
        if (keyword) {
            query.$or = [
                { name_cn: { $regex: keyword, $options: 'i' } },
                { name_en: { $regex: keyword, $options: 'i' } }
            ];
        }
        if (starLevel && starLevel !== '0') {
            query.star_level = parseInt(starLevel);
        }

        // 查询酒店列表
        const hotels = await Hotel.find(query).skip((page - 1) * pageSize).limit(parseInt(pageSize));

        // 对于列表页，计算一下每家酒店的最低价格用于展示
        const listData = await Promise.all(
            hotels.map(async (h) => {
                const rooms = await Room.find({ hotelId: h._id });
                let price_start = 0;
                if (rooms.length > 0) {
                    price_start = Math.min(...rooms.map(r => r.price));
                    // 价格范围筛选
                    if (priceMin && price_start < parseInt(priceMin)) {
                        return null;
                    }
                    if (priceMax && price_start > parseInt(priceMax)) {
                        return null;
                    }
                }

                // 标签筛选
                if (tags) {
                    const tagArray = tags.split(',');
                    const hotelTags = h.tags || [];
                    const hasMatchingTag = tagArray.some(tag => hotelTags.includes(tag));
                    if (!hasMatchingTag) {
                        return null;
                    }
                }

                return {
                    id: h._id,
                    name_cn: h.name_cn,
                    name_en: h.name_en,
                    star_level: h.star_level,
                    address: h.address,
                    image: h.banner_url,
                    rating: 4.5, // 模拟评分
                    tags: h.tags,
                    price_start,
                    is_offline: h.is_offline,
                    audit_status: h.audit_status.toLowerCase()
                };
            })
        );

        // 过滤掉不符合条件的酒店
        const filteredList = listData.filter(item => item !== null);
        // 查询酒店总数
        const total = await Hotel.countDocuments(query);

        const responseData = {
            list: filteredList,
            total,
            page: parseInt(page),
            pageSize: parseInt(pageSize)
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

        // 构建位置信息
        const location = {
            province: '上海市', // 模拟数据，实际应该从酒店数据中获取
            city: '上海市',     // 模拟数据，实际应该从酒店数据中获取
            address: hotel.address,
            latitude: 31.2397, // 模拟数据，实际应该从酒店数据中获取
            longitude: 121.4997 // 模拟数据，实际应该从酒店数据中获取
        };

        // 构建完整的酒店信息
        const hotelDetails = {
            id: hotel._id,
            name_cn: hotel.name_cn,
            name_en: hotel.name_en,
            star_level: hotel.star_level,
            location,
            description: hotel.description || '酒店位于市中心，交通便利，设施齐全', // 模拟数据
            rating: 4.8, // 模拟数据
            image: hotel.banner_url,
            images: [hotel.banner_url], // 模拟数据，实际应该从酒店数据中获取
            tags: hotel.tags || [],
            facilities: ['健身房', '游泳池', 'WiFi', '停车场'], // 模拟数据
            rooms: rooms.map(room => ({
                id: room._id,
                type: room.name,
                price: room.price,
                stock: 10, // 模拟数据
                description: room.description,
                image: room.image_url
            })),
            price_start: rooms.length > 0 ? Math.min(...rooms.map(r => r.price)) : 0,
            is_offline: hotel.is_offline,
            audit_status: hotel.audit_status.toLowerCase(),
            created_at: hotel.createdAt
        };

        // 缓存结果，设置过期时间为1小时
        await Cache.set(cacheKey, hotelDetails, 3600);

        res.json({
            code: 200,
            data: hotelDetails,
            message: 'success'
        });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
};

module.exports = {
    getBanners,
    getPopularCities,
    getHotels,
    getHotelById
};
