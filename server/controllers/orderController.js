const Order = require('../models/Order');
const User = require('../models/User');
const Hotel = require('../models/Hotel');
const Room = require('../models/Room');

/**
 * 创建订单
 */
const createOrder = async (req, res) => {
    try {
        const { hotel_id, room_id, check_in_date, check_out_date, guests } = req.body;

        // 参数校验
        if (!hotel_id || !room_id || !check_in_date || !check_out_date || !guests) {
            return res.status(400).json({
                code: 400,
                message: '请提供完整的订单信息'
            });
        }

        // 查找用户
        const user = await User.findOne({ username: req.user.username });
        if (!user) {
            return res.status(404).json({
                code: 404,
                message: '用户不存在'
            });
        }

        // 查找酒店
        const hotel = await Hotel.findById(hotel_id);
        if (!hotel) {
            return res.status(404).json({
                code: 404,
                message: '酒店不存在'
            });
        }

        // 查找房型
        const room = await Room.findById(room_id);
        if (!room) {
            return res.status(404).json({
                code: 404,
                message: '房型不存在'
            });
        }

        // 计算总价格
        const checkIn = new Date(check_in_date);
        const checkOut = new Date(check_out_date);
        const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        const total_price = room.price * days;

        // 创建订单
        const order = new Order({
            user_id: user._id,
            hotel_id: hotel._id,
            room_id: room._id,
            check_in_date: checkIn,
            check_out_date: checkOut,
            guests,
            total_price,
            status: 'pending',
            payment_status: 'unpaid'
        });

        await order.save();

        res.json({
            code: 200,
            data: { order_id: order._id },
            message: '订单创建成功'
        });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
};

/**
 * 获取用户订单列表
 */
const getUserOrders = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.user.username });
        if (!user) {
            return res.status(404).json({
                code: 404,
                message: '用户不存在'
            });
        }

        const orders = await Order.find({ user_id: user._id }).populate(['hotel_id', 'room_id']);

        res.json({
            code: 200,
            data: orders,
            message: 'success'
        });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
};

/**
 * 获取订单详情
 */
const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({ username: req.user.username });
        if (!user) {
            return res.status(404).json({
                code: 404,
                message: '用户不存在'
            });
        }

        const order = await Order.findById(id).populate(['hotel_id', 'room_id']);
        if (!order) {
            return res.status(404).json({
                code: 404,
                message: '订单不存在'
            });
        }

        // 检查权限：只有订单所属用户或管理员可以查看
        if (order.user_id.toString() !== user._id.toString() && user.role !== 'admin') {
            return res.status(403).json({
                code: 403,
                message: '无权查看此订单'
            });
        }

        res.json({
            code: 200,
            data: order,
            message: 'success'
        });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
};

/**
 * 更新订单状态
 */
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const user = await User.findOne({ username: req.user.username });
        if (!user) {
            return res.status(404).json({
                code: 404,
                message: '用户不存在'
            });
        }

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({
                code: 404,
                message: '订单不存在'
            });
        }

        // 检查权限：只有订单所属用户或管理员可以更新
        if (order.user_id.toString() !== user._id.toString() && user.role !== 'admin') {
            return res.status(403).json({
                code: 403,
                message: '无权更新此订单'
            });
        }

        // 验证状态值
        const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                code: 400,
                message: '无效的订单状态'
            });
        }

        order.status = status;
        await order.save();

        res.json({
            code: 200,
            message: '订单状态更新成功'
        });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
};

/**
 * 更新支付状态
 */
const updatePaymentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { payment_status, payment_method, transaction_id } = req.body;

        const user = await User.findOne({ username: req.user.username });
        if (!user) {
            return res.status(404).json({
                code: 404,
                message: '用户不存在'
            });
        }

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({
                code: 404,
                message: '订单不存在'
            });
        }

        // 检查权限：只有订单所属用户或管理员可以更新
        if (order.user_id.toString() !== user._id.toString() && user.role !== 'admin') {
            return res.status(403).json({
                code: 403,
                message: '无权更新此订单'
            });
        }

        // 验证支付状态值
        const validPaymentStatuses = ['unpaid', 'paid', 'refunded'];
        if (!validPaymentStatuses.includes(payment_status)) {
            return res.status(400).json({
                code: 400,
                message: '无效的支付状态'
            });
        }

        order.payment_status = payment_status;
        if (payment_method) order.payment_method = payment_method;
        if (transaction_id) order.transaction_id = transaction_id;

        // 如果支付成功，自动更新订单状态为已确认
        if (payment_status === 'paid') {
            order.status = 'confirmed';
        }

        await order.save();

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
        const orders = await Order.find().populate(['user_id', 'hotel_id', 'room_id']);

        res.json({
            code: 200,
            data: orders,
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