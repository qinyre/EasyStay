const { db } = require('../config/database');
const crypto = require('crypto');

/**
 * 创建订单
 */
const createBooking = async (req, res) => {
    try {
        const { hotelId, roomId, checkIn, checkOut, totalPrice, guestName, guestPhone } = req.body;
        const { phone } = req.user;

        // 参数校验
        if (!hotelId || !roomId || !checkIn || !checkOut || !totalPrice || !guestName || !guestPhone) {
            return res.status(400).json({
                code: 400,
                message: '请提供完整的订单信息'
            });
        }

        // 查找用户
        const user = db.prepare('SELECT * FROM users WHERE phone = ?').get(phone);
        if (!user) {
            return res.status(404).json({ code: 404, message: '用户不存在' });
        }

        // 查找酒店
        const hotel = db.prepare('SELECT * FROM hotels WHERE id = ?').get(hotelId);
        if (!hotel) {
            return res.status(404).json({ code: 404, message: '酒店不存在' });
        }

        // 查找房型
        const room = db.prepare('SELECT * FROM rooms WHERE id = ?').get(roomId);
        if (!room) {
            return res.status(404).json({ code: 404, message: '房型不存在' });
        }

        // 生成订单ID
        const orderId = `bk_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
        const now = new Date().toISOString();

        // 创建订单
        db.prepare(`
            INSERT INTO orders (id, user_id, hotel_id, room_id, check_in_date, check_out_date, guests, total_price, status, payment_status, guestName, guestPhone, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, 1, ?, 'pending', 'unpaid', ?, ?, ?, ?)
        `).run(orderId, user.id, hotel.id, room.id, checkIn, checkOut, totalPrice, guestName, guestPhone, now, now);

        // 构建响应数据
        const responseData = {
            id: orderId,
            hotelId: hotel.id,
            roomId: room.id,
            userId: user.id,
            checkIn,
            checkOut,
            totalPrice,
            status: 'pending',
            guestName,
            guestPhone,
            createdAt: now,
            hotelName: hotel.name_cn,
            hotelNameCn: hotel.name_cn,
            hotelNameEn: hotel.name_en,
            hotelImage: hotel.banner_url,
            roomType: room.name
        };

        res.json({
            code: 200,
            data: responseData,
            message: '订单创建成功'
        });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
};

/**
 * 获取订单列表
 */
const getBookings = async (req, res) => {
    try {
        const { status, page = 1, pageSize = 10 } = req.query;
        const { phone } = req.user;

        const user = db.prepare('SELECT * FROM users WHERE phone = ?').get(phone);
        if (!user) {
            return res.status(404).json({ code: 404, message: '用户不存在' });
        }

        // 构建查询条件
        let sql = 'SELECT * FROM orders WHERE user_id = ?';
        let countSql = 'SELECT COUNT(*) as total FROM orders WHERE user_id = ?';
        let params = [user.id];

        if (status) {
            sql += ' AND status = ?';
            countSql += ' AND status = ?';
            params.push(status);
        }

        // 总数
        const { total } = db.prepare(countSql).get(...params);

        // 分页
        const offset = (parseInt(page) - 1) * parseInt(pageSize);
        sql += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';

        const orders = db.prepare(sql).all(...params, parseInt(pageSize), offset);

        // 构建响应数据
        const listData = orders.map(order => {
            const hotel = db.prepare('SELECT * FROM hotels WHERE id = ?').get(order.hotel_id);
            const room = db.prepare('SELECT * FROM rooms WHERE id = ?').get(order.room_id);

            return {
                id: order.id,
                hotelId: order.hotel_id,
                roomId: order.room_id,
                userId: order.user_id,
                hotelName: hotel ? hotel.name_cn : '',
                hotelNameCn: hotel ? hotel.name_cn : '',
                hotelNameEn: hotel ? hotel.name_en : '',
                hotelImage: hotel ? hotel.banner_url : '',
                roomType: room ? room.name : '',
                checkIn: order.check_in_date,
                checkOut: order.check_out_date,
                totalPrice: order.total_price,
                status: order.status,
                guestName: order.guestName,
                guestPhone: order.guestPhone,
                createdAt: order.createdAt
            };
        });

        res.json({
            code: 200,
            data: {
                list: listData,
                total,
                page: parseInt(page),
                pageSize: parseInt(pageSize)
            },
            message: 'success'
        });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
};

/**
 * 获取订单详情
 */
const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        const { phone } = req.user;

        const user = db.prepare('SELECT * FROM users WHERE phone = ?').get(phone);
        if (!user) {
            return res.status(404).json({ code: 404, message: '用户不存在' });
        }

        const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
        if (!order) {
            return res.status(404).json({ code: 404, message: '订单不存在' });
        }

        if (order.user_id !== user.id) {
            return res.status(403).json({ code: 403, message: '无权查看此订单' });
        }

        const hotel = db.prepare('SELECT * FROM hotels WHERE id = ?').get(order.hotel_id);
        const room = db.prepare('SELECT * FROM rooms WHERE id = ?').get(order.room_id);

        // 计算间夜数
        const checkIn = new Date(order.check_in_date);
        const checkOut = new Date(order.check_out_date);
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

        const responseData = {
            id: order.id,
            hotelId: order.hotel_id,
            roomId: order.room_id,
            userId: order.user_id,
            checkIn: order.check_in_date,
            checkOut: order.check_out_date,
            totalPrice: order.total_price,
            status: order.status,
            guestName: order.guestName,
            guestPhone: order.guestPhone,
            createdAt: order.createdAt,
            hotelName: hotel ? hotel.name_cn : '',
            hotelNameCn: hotel ? hotel.name_cn : '',
            hotelNameEn: hotel ? hotel.name_en : '',
            hotelImage: hotel ? hotel.banner_url : '',
            hotelAddress: hotel ? hotel.address : '',
            roomType: room ? room.name : '',
            nights
        };

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
 * 取消订单
 */
const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { phone } = req.user;

        const user = db.prepare('SELECT * FROM users WHERE phone = ?').get(phone);
        if (!user) {
            return res.status(404).json({ code: 404, message: '用户不存在' });
        }

        const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
        if (!order) {
            return res.status(404).json({ code: 404, message: '订单不存在' });
        }

        if (order.user_id !== user.id) {
            return res.status(403).json({ code: 403, message: '无权操作此订单' });
        }

        if (order.status === 'completed' || order.status === 'cancelled') {
            return res.status(400).json({ code: 400, message: '该订单状态不允许取消' });
        }

        // 更新订单状态
        db.prepare('UPDATE orders SET status = ?, updatedAt = ? WHERE id = ?')
            .run('cancelled', new Date().toISOString(), id);

        const hotel = db.prepare('SELECT * FROM hotels WHERE id = ?').get(order.hotel_id);
        const room = db.prepare('SELECT * FROM rooms WHERE id = ?').get(order.room_id);

        const responseData = {
            id: order.id,
            hotelId: order.hotel_id,
            roomId: order.room_id,
            userId: order.user_id,
            hotelName: hotel ? hotel.name_cn : '',
            hotelNameCn: hotel ? hotel.name_cn : '',
            hotelNameEn: hotel ? hotel.name_en : '',
            hotelImage: hotel ? hotel.banner_url : '',
            roomType: room ? room.name : '',
            checkIn: order.check_in_date,
            checkOut: order.check_out_date,
            totalPrice: order.total_price,
            status: 'cancelled',
            guestName: order.guestName,
            guestPhone: order.guestPhone,
            createdAt: order.createdAt
        };

        res.json({
            code: 200,
            data: responseData,
            message: '订单已取消'
        });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
};

/**
 * 更新订单状态 (通用)
 */
const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const { phone } = req.user;

        if (!status) {
            return res.status(400).json({ code: 400, message: '请提供新的状态' });
        }

        const user = db.prepare('SELECT * FROM users WHERE phone = ?').get(phone);
        if (!user) {
            return res.status(404).json({ code: 404, message: '用户不存在' });
        }

        const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
        if (!order) {
            return res.status(404).json({ code: 404, message: '订单不存在' });
        }

        if (order.user_id !== user.id) {
            return res.status(403).json({ code: 403, message: '无权操作此订单' });
        }

        // 更新订单状态
        db.prepare('UPDATE orders SET status = ?, updatedAt = ? WHERE id = ?')
            .run(status, new Date().toISOString(), id);

        const hotel = db.prepare('SELECT * FROM hotels WHERE id = ?').get(order.hotel_id);
        const room = db.prepare('SELECT * FROM rooms WHERE id = ?').get(order.room_id);

        const responseData = {
            id: order.id,
            hotelId: order.hotel_id,
            roomId: order.room_id,
            userId: order.user_id,
            hotelName: hotel ? hotel.name_cn : '',
            hotelNameCn: hotel ? hotel.name_cn : '',
            hotelNameEn: hotel ? hotel.name_en : '',
            hotelImage: hotel ? hotel.banner_url : '',
            roomType: room ? room.name : '',
            checkIn: order.check_in_date,
            checkOut: order.check_out_date,
            totalPrice: order.total_price,
            status: status,
            guestName: order.guestName,
            guestPhone: order.guestPhone,
            createdAt: order.createdAt
        };

        res.json({
            code: 200,
            data: responseData,
            message: '订单状态更新成功'
        });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
};

module.exports = {
    createBooking,
    getBookings,
    getBookingById,
    cancelBooking,
    updateBookingStatus
};