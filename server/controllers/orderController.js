const { db } = require('../config/database');
const crypto = require('crypto');

/**
 * 创建订单 (PC端)
 */
const createOrder = async (req, res) => {
    try {
        const { hotel_id, room_id, check_in_date, check_out_date, guests } = req.body;

        if (!hotel_id || !room_id || !check_in_date || !check_out_date || !guests) {
            return res.status(400).json({
                code: 400,
                message: '请提供完整的订单信息'
            });
        }

        const user = db.prepare('SELECT * FROM users WHERE username = ?').get(req.user.username);
        if (!user) {
            return res.status(404).json({ code: 404, message: '用户不存在' });
        }

        const hotel = db.prepare('SELECT * FROM hotels WHERE id = ?').get(hotel_id);
        if (!hotel) {
            return res.status(404).json({ code: 404, message: '酒店不存在' });
        }

        const room = db.prepare('SELECT * FROM rooms WHERE id = ?').get(room_id);
        if (!room) {
            return res.status(404).json({ code: 404, message: '房型不存在' });
        }

        // 计算总价格
        const checkIn = new Date(check_in_date);
        const checkOut = new Date(check_out_date);
        const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        const total_price = room.price * days;

        const orderId = crypto.randomUUID();
        const now = new Date().toISOString();

        db.prepare(`
            INSERT INTO orders (id, user_id, hotel_id, room_id, check_in_date, check_out_date, guests, total_price, status, payment_status, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'unpaid', ?, ?)
        `).run(orderId, user.id, hotel.id, room.id, check_in_date, check_out_date, guests, total_price, now, now);

        res.json({
            code: 200,
            data: { order_id: orderId },
            message: '订单创建成功'
        });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
};

/**
 * 获取用户订单列表 (PC端)
 */
const getUserOrders = async (req, res) => {
    try {
        const user = db.prepare('SELECT * FROM users WHERE username = ?').get(req.user.username);
        if (!user) {
            return res.status(404).json({ code: 404, message: '用户不存在' });
        }

        const orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY createdAt DESC').all(user.id);

        // 为每个订单关联酒店和房型信息
        const enrichedOrders = orders.map(order => {
            const hotel = db.prepare('SELECT * FROM hotels WHERE id = ?').get(order.hotel_id);
            const room = db.prepare('SELECT * FROM rooms WHERE id = ?').get(order.room_id);
            return {
                ...order,
                hotel_id: hotel || null,
                room_id: room || null
            };
        });

        res.json({
            code: 200,
            data: enrichedOrders,
            message: 'success'
        });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
};

/**
 * 获取订单详情 (PC端)
 */
const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = db.prepare('SELECT * FROM users WHERE username = ?').get(req.user.username);
        if (!user) {
            return res.status(404).json({ code: 404, message: '用户不存在' });
        }

        const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
        if (!order) {
            return res.status(404).json({ code: 404, message: '订单不存在' });
        }

        // 检查权限
        if (order.user_id !== user.id && user.role !== 'admin') {
            return res.status(403).json({ code: 403, message: '无权查看此订单' });
        }

        const hotel = db.prepare('SELECT * FROM hotels WHERE id = ?').get(order.hotel_id);
        const room = db.prepare('SELECT * FROM rooms WHERE id = ?').get(order.room_id);

        res.json({
            code: 200,
            data: {
                ...order,
                hotel_id: hotel || null,
                room_id: room || null
            },
            message: 'success'
        });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
};

/**
 * 更新订单状态 (PC端)
 */
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const user = db.prepare('SELECT * FROM users WHERE username = ?').get(req.user.username);
        if (!user) {
            return res.status(404).json({ code: 404, message: '用户不存在' });
        }

        const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
        if (!order) {
            return res.status(404).json({ code: 404, message: '订单不存在' });
        }

        if (order.user_id !== user.id && user.role !== 'admin') {
            return res.status(403).json({ code: 403, message: '无权更新此订单' });
        }

        const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ code: 400, message: '无效的订单状态' });
        }

        db.prepare('UPDATE orders SET status = ?, updatedAt = ? WHERE id = ?')
            .run(status, new Date().toISOString(), id);

        res.json({
            code: 200,
            message: '订单状态更新成功'
        });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
};

/**
 * 更新支付状态 (PC端)
 */
const updatePaymentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { payment_status, payment_method, transaction_id } = req.body;

        const user = db.prepare('SELECT * FROM users WHERE username = ?').get(req.user.username);
        if (!user) {
            return res.status(404).json({ code: 404, message: '用户不存在' });
        }

        const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
        if (!order) {
            return res.status(404).json({ code: 404, message: '订单不存在' });
        }

        if (order.user_id !== user.id && user.role !== 'admin') {
            return res.status(403).json({ code: 403, message: '无权更新此订单' });
        }

        const validPaymentStatuses = ['unpaid', 'paid', 'refunded'];
        if (!validPaymentStatuses.includes(payment_status)) {
            return res.status(400).json({ code: 400, message: '无效的支付状态' });
        }

        let newStatus = order.status;
        if (payment_status === 'paid') {
            newStatus = 'confirmed';
        }

        db.prepare(`
            UPDATE orders SET payment_status = ?, payment_method = ?, transaction_id = ?, status = ?, updatedAt = ?
            WHERE id = ?
        `).run(
            payment_status,
            payment_method || order.payment_method,
            transaction_id || order.transaction_id,
            newStatus,
            new Date().toISOString(),
            id
        );

        res.json({
            code: 200,
            message: '支付状态更新成功'
        });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
};

/**
 * 获取所有订单（管理员）
 */
const getAllOrders = async (req, res) => {
    try {
        const orders = db.prepare('SELECT * FROM orders ORDER BY createdAt DESC').all();

        const enrichedOrders = orders.map(order => {
            const user = db.prepare('SELECT id, username, phone, email, name, role FROM users WHERE id = ?').get(order.user_id);
            const hotel = db.prepare('SELECT * FROM hotels WHERE id = ?').get(order.hotel_id);
            const room = db.prepare('SELECT * FROM rooms WHERE id = ?').get(order.room_id);
            return {
                ...order,
                user_id: user || null,
                hotel_id: hotel || null,
                room_id: room || null
            };
        });

        res.json({
            code: 200,
            data: enrichedOrders,
            message: 'success'
        });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
};

module.exports = {
    createOrder,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
    updatePaymentStatus,
    getAllOrders
};