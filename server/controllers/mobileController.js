const { readHotels } = require('../utils/file');

/**
 * 获取首页 Banner
 */
const getBanners = async (req, res) => {
    try {
        const hotels = await readHotels();

        // 筛选出有 banner 的精选酒店（已审核且未下线）
        const banners = hotels
            .filter(h => h.banner_url && !h.is_offline && h.audit_status === 'Approved')
            .slice(0, 5) // 取前 5 个
            .map(h => ({
                id: h.id,
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

        let hotels = await readHotels();

        // 移动端只能看到已通过且未下线的酒店
        hotels = hotels.filter(h => !h.is_offline && h.audit_status === 'Approved');

        // 应用筛选条件
        if (location) {
            hotels = hotels.filter(h => h.address.includes(location));
        }
        if (keyword) {
            hotels = hotels.filter(h =>
                (h.name_cn?.includes(keyword) || h.name_en?.includes(keyword))
            );
        }
        if (starLevel) {
            hotels = hotels.filter(h => h.star_level === parseInt(starLevel));
        }

        // 分页处理
        const pageSize = 10;
        const start = (page - 1) * pageSize;
        const paginatedHotels = hotels.slice(start, start + pageSize);

        // 对于列表页，计算一下每家酒店的最低价格用于展示
        const listData = paginatedHotels.map(h => {
            const minPrice = h.rooms?.length > 0
                ? Math.min(...h.rooms.map(r => r.price))
                : 0;

            return {
                id: h.id,
                name_cn: h.name_cn,
                name_en: h.name_en,
                address: h.address,
                star_level: h.star_level,
                banner_url: h.banner_url,
                tags: h.tags,
                min_price: minPrice
            };
        });

        res.json({
            code: 200,
            data: {
                list: listData,
                total: hotels.length,
                page: parseInt(page),
                pageSize
            },
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
        const hotels = await readHotels();

        // 允许查看的条件（即便下线了，但如果是根据ID精确查找，前端也自己判断，但最好后端过滤）
        const hotel = hotels.find(h => h.id === id && h.audit_status === 'Approved' && !h.is_offline);

        if (!hotel) {
            return res.status(404).json({ code: 404, message: '酒店不存在或已下线' });
        }

        // Agent.md 要求：对后端返回的房型数据进行价格由低到高排序
        // 虽然前端会被要求处理，但后端也最好处理一下作为双重保障
        if (hotel.rooms && hotel.rooms.length > 0) {
            hotel.rooms.sort((a, b) => a.price - b.price);
        }

        res.json({
            code: 200,
            data: hotel,
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
