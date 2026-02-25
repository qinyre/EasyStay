const { db } = require('../config/database');
const { Cache } = require('../config/cache');
const { parseProvinceCity } = require('../utils/location');

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
        const hotels = db.prepare(`
            SELECT * FROM hotels
            WHERE banner_url IS NOT NULL AND banner_url != ''
            AND is_offline = 0 AND audit_status = 'Approved'
            LIMIT 5
        `).all();

        const banners = hotels.map(h => ({
            id: `banner_${h.id}`,
            name: h.name_cn,
            image: h.banner_url,
            hotelId: h.id
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
            { name: '上海', image: 'https://images.unsplash.com/photo-1548092372-0d1bd40894a3?auto=format&fit=crop&q=80&w=1000' },
            { name: '北京', image: 'https://images.unsplash.com/photo-1544037835-7f51363191f5?auto=format&fit=crop&q=80&w=1000' },
            { name: '三亚', image: 'https://images.unsplash.com/photo-1568850362944-036d337a2756?auto=format&fit=crop&q=80&w=1000' },
            { name: '杭州', image: 'https://images.unsplash.com/photo-1584273258445-fb11a250d87e?auto=format&fit=crop&q=80&w=1000' },
            { name: '成都', image: 'https://images.unsplash.com/photo-1588298723524-1509f144010d?auto=format&fit=crop&q=80&w=1000' }
        ];

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
        const pageNum = parseInt(page);
        const pageSizeNum = parseInt(pageSize);

        // 生成缓存键
        const cacheKey = `hotels:v2:${city || 'all'}:${keyword || 'none'}:${checkIn || 'any'}:${checkOut || 'any'}:${starLevel || 'all'}:${priceMin || '0'}:${priceMax || '99999'}:${tags || 'none'}:${pageNum}:${pageSizeNum}`;

        const cachedData = await Cache.get(cacheKey);
        if (cachedData) {
            return res.json({
                code: 200,
                data: cachedData,
                message: 'success (from cache)'
            });
        }

        // 构建动态 SQL 查询
        let whereClauses = ["is_offline = 0", "audit_status = 'Approved'"];
        let params = [];

        if (city) {
            whereClauses.push("address LIKE ?");
            params.push(`%${city}%`);
        }
        if (keyword) {
            whereClauses.push("(name_cn LIKE ? OR name_en LIKE ?)");
            params.push(`%${keyword}%`, `%${keyword}%`);
        }
        if (starLevel && starLevel !== '0') {
            whereClauses.push("star_level = ?");
            params.push(parseInt(starLevel));
        }

        const whereSQL = whereClauses.join(' AND ');

        // 获取所有符合基准条件的酒店
        let hotels = db.prepare(`SELECT * FROM hotels WHERE ${whereSQL} ORDER BY createdAt DESC`).all(...params);

        // 对每个酒店联查房型，计算最低价格和标签筛选
        let result = hotels.map(h => {
            const rooms = db.prepare('SELECT * FROM rooms WHERE hotelId = ? ORDER BY price ASC').all(h.id);
            const minPrice = rooms.length > 0 ? Math.min(...rooms.map(r => r.price)) : 0;
            const hotelTags = h.tags ? JSON.parse(h.tags) : [];
            const parsed = parseProvinceCity(h.address);

            return {
                id: h.id,
                name_cn: h.name_cn,
                name_en: h.name_en,
                star_level: h.star_level,
                location: {
                    province: parsed.province,
                    city: parsed.city,
                    address: h.address,
                    latitude: 31.2397,
                    longitude: 121.4997
                },
                address: h.address,
                image: h.banner_url,
                rating: 4.5,
                tags: hotelTags,
                price_start: minPrice,
                is_offline: !!h.is_offline,
                audit_status: h.audit_status.toLowerCase(),
                created_at: h.createdAt
            };
        });

        // 价格区间筛选
        if (priceMin) {
            result = result.filter(h => h.price_start >= parseInt(priceMin));
        }
        if (priceMax && priceMax !== '99999') {
            result = result.filter(h => h.price_start <= parseInt(priceMax));
        }

        // 标签筛选
        if (tags) {
            const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);
            if (tagArray.length > 0) {
                result = result.filter(h => tagArray.some(tag => h.tags.includes(tag)));
            }
        }

        const total = result.length;

        // 分页
        const start = (pageNum - 1) * pageSizeNum;
        const filteredList = result.slice(start, start + pageSizeNum);

        const responseData = {
            list: filteredList,
            total,
            page: pageNum,
            pageSize: pageSizeNum
        };

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

        const cacheKey = `hotel:v2:${id}`;
        const cachedHotel = await Cache.get(cacheKey);
        if (cachedHotel) {
            return res.json({
                code: 200,
                data: cachedHotel,
                message: 'success (from cache)'
            });
        }

        const hotel = db.prepare(`
            SELECT * FROM hotels WHERE id = ? AND audit_status = 'Approved' AND is_offline = 0
        `).get(id);

        if (!hotel) {
            return res.status(404).json({ code: 404, message: '酒店不存在或已下线' });
        }

        // 获取房型数据并按价格由低到高排序
        const rooms = db.prepare('SELECT * FROM rooms WHERE hotelId = ? ORDER BY price ASC').all(hotel.id);

        const parsed = parseProvinceCity(hotel.address);
        const location = {
            province: parsed.province,
            city: parsed.city,
            address: hotel.address,
            latitude: 31.2397,
            longitude: 121.4997
        };

        const hotelTags = hotel.tags ? JSON.parse(hotel.tags) : [];
        const hotelFacilities = hotel.facilities ? JSON.parse(hotel.facilities) : [];

        // 调试：输出 description 的值
        console.log(`[DEBUG] Hotel ${hotel.id} description from DB:`, hotel.description);

        const hotelDetails = {
            id: hotel.id,
            name_cn: hotel.name_cn,
            name_en: hotel.name_en,
            star_level: hotel.star_level,
            location,
            description: hotel.description || '酒店位于市中心，交通便利，设施齐全',
            rating: 4.8,
            image: hotel.banner_url,
            images: [hotel.banner_url],
            tags: hotelTags,
            facilities: hotelFacilities.length > 0 ? hotelFacilities : ['健身房', '游泳池', 'WiFi', '停车场'],
            rooms: rooms.map(room => ({
                id: room.id,
                type: room.name,
                price: room.price,
                stock: 10,
                description: room.description,
                image: room.image_url
            })),
            price_start: rooms.length > 0 ? Math.min(...rooms.map(r => r.price)) : 0,
            is_offline: !!hotel.is_offline,
            audit_status: hotel.audit_status.toLowerCase(),
            created_at: hotel.createdAt
        };

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
