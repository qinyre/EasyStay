const { readHotels, writeHotels } = require('../utils/file');

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

        const hotels = await readHotels();

        const newHotel = {
            ...hotelData,
            id: generateId(),
            audit_status: 'Pending', // 新录入状态必为待审核
            is_offline: false,       // 默认在线（但由于是Pending，也不会展现在移动端）
            merchant_username: req.user?.username // 记录是哪个商户创建的
        };

        hotels.push(newHotel);
        await writeHotels(hotels);

        res.json({
            code: 200,
            data: { id: newHotel.id },
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

        const hotels = await readHotels();
        const hotelIndex = hotels.findIndex(h => h.id === id);

        if (hotelIndex === -1) {
            return res.status(404).json({ code: 404, message: '找不到该酒店数据' });
        }

        // 检查权限：该酒店是否属于当前商户 (严格模式下)
        if (hotels[hotelIndex].merchant_username &&
            hotels[hotelIndex].merchant_username !== req.user.username) {
            return res.status(403).json({ code: 403, message: '无权修改他人的酒店' });
        }

        // 更新数据：不允许商户直接修改审核状态或ID
        const updatedHotel = {
            ...hotels[hotelIndex],
            ...updateData,
            id: hotels[hotelIndex].id,           // 保护ID不被篡改
            // 如果数据被改动，往往需要重新审核，这里简单处理重新打回 Pending
            audit_status: 'Pending',
            is_offline: hotels[hotelIndex].is_offline
        };

        hotels[hotelIndex] = updatedHotel;
        await writeHotels(hotels);

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
        const hotels = await readHotels();

        const myHotels = hotels.filter(h => h.merchant_username === req.user.username);

        res.json({
            code: 200,
            data: myHotels,
            message: 'success'
        });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
}


module.exports = {
    createHotel,
    updateHotel,
    getMyHotels
};
