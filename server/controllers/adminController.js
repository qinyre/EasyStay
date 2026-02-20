const { readHotels, writeHotels } = require('../utils/file');

/**
 * 获取所有酒店列表 (管理员后台视角 - 不分类别)
 */
const getAllHotels = async (req, res) => {
    try {
        const hotels = await readHotels();
        res.json({
            code: 200,
            data: hotels,
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

        const hotels = await readHotels();
        const hotelIndex = hotels.findIndex(h => h.id === hotelId);

        if (hotelIndex === -1) {
            return res.status(404).json({ code: 404, message: '酒店不存在' });
        }

        if (action === 'approve') {
            hotels[hotelIndex].audit_status = 'Approved';
            hotels[hotelIndex].fail_reason = '';
        } else if (action === 'reject') {
            hotels[hotelIndex].audit_status = 'Rejected';
            hotels[hotelIndex].fail_reason = fail_reason || '管理员未提供原因';
        } else {
            return res.status(400).json({ code: 400, message: '无效的审核操作(action只能是 approve 或 reject)' });
        }

        await writeHotels(hotels);

        res.json({
            code: 200,
            message: `酒店已标识为 ${hotels[hotelIndex].audit_status}`
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

        const hotels = await readHotels();
        const hotelIndex = hotels.findIndex(h => h.id === hotelId);

        if (hotelIndex === -1) {
            return res.status(404).json({ code: 404, message: '酒店不存在' });
        }

        // 只有审核通过的酒店才能操作上线下线
        if (hotels[hotelIndex].audit_status !== 'Approved') {
            return res.status(400).json({ code: 400, message: '只有审核通过的酒店支持上下线操作' });
        }

        // 虚拟删除：仅修改标志位
        if (action === 'unpublish') {
            hotels[hotelIndex].is_offline = true;
        } else if (action === 'publish') {
            hotels[hotelIndex].is_offline = false;
        } else {
            return res.status(400).json({ code: 400, message: '无效的发布操作(action必须是 publish 或 unpublish)' });
        }

        await writeHotels(hotels);

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
