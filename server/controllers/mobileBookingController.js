const Order = require('../models/Order');
const User = require('../models/User');
const Hotel = require('../models/Hotel');
const Room = require('../models/Room');

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
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({
                code: 404,
                message: '用户不存在'
            });
        }

        // 查找酒店
        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(404).json({
                code: 404,
                message: '酒店不存在'
            });
        }

        // 查找房型
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({
                code: 404,
                message: '房型不存在'
            });
        }

        // 生成订单ID
        const orderId = `bk_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

        // 创建订单
        const order = new Order({
            _id: orderId,
            user_id: user._id,
            hotel_id: hotel._id,
            room_id: room._id,
            check_in_date: checkIn,
            check_out_date: checkOut,
            guests: 1, // 默认为1人
            total_price: totalPrice,
            status: 'pending',
            payment_status: 'unpaid',
            guestName,
            guestPhone
        });

        await order.save();

        // 构建响应数据
        const responseData = {
            id: order._id,
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

        // 查找用户
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({
                code: 404,
                message: '用户不存在'
            });
        }

        // 构建查询条件
        const query = { user_id: user._id };
        if (status) {
            query.status = status;
        }

        // 分页处理
        const skip = (page - 1) * pageSize;

        // 查询订单总数
        const total = await Order.countDocuments(query);
        // 查询订单列表
        const orders = await Order.find(query).skip(skip).limit(parseInt(pageSize)).sort({ createdAt: -1 });

        // 构建响应数据
        const listData = await Promise.all(
            orders.map(async (order) => {
                // 查找酒店
                const hotel = await Hotel.findById(order.hotel_id);
                // 查找房型
                const room = await Room.findById(order.room_id);

                return {
                    id: order._id,
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
            })
        );

        const responseData = {
            list: listData,
            total,
            page: parseInt(page),
            pageSize: parseInt(pageSize)
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
 * 获取订单详情
 */
const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        const { phone } = req.user;

        // 查找用户
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({
                code: 404,
                message: '用户不存在'
            });
        }

        // 查找订单
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({
                code: 404,
                message: '订单不存在'
            });
        }

        // 检查权限
        if (order.user_id.toString() !== user._id.toString()) {
            return res.status(403).json({
                code: 403,
                message: '无权查看此订单'
            });
        }

        // 查找酒店
        const hotel = await Hotel.findById(order.hotel_id);
        // 查找房型
        const room = await Room.findById(order.room_id);

        // 计算间夜数
        const checkIn = new Date(order.check_in_date);
        const checkOut = new Date(order.check_out_date);
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

        // 构建响应数据
        const responseData = {
            id: order._id,
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
            nights: nights
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

        // 查找用户
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({
                code: 404,
                message: '用户不存在'
            });
        }

        // 查找订单
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({
                code: 404,
                message: '订单不存在'
            });
        }

        // 检查权限
        if (order.user_id.toString() !== user._id.toString()) {
            return res.status(403).json({
                code: 403,
                message: '无权操作此订单'
            });
        }

        // 检查订单状态
        if (order.status === 'completed' || order.status === 'cancelled') {
            return res.status(400).json({
                code: 400,
                message: '该订单状态不允许取消'
            });
        }

        // 更新订单状态
        order.status = 'cancelled';
        await order.save();

        // 查找关联的酒店和房型数据以构建完整响应
        const hotel = await Hotel.findById(order.hotel_id);
        const room = await Room.findById(order.room_id);

        // 构建完整的响应数据（与 getBookings 列表结构一致）
        const responseData = {
            id: order._id,
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

        // 查找用户
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({ code: 404, message: '用户不存在' });
        }

        // 查找订单
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ code: 404, message: '订单不存在' });
        }

        // 检查权限
        if (order.user_id.toString() !== user._id.toString()) {
            return res.status(403).json({ code: 403, message: '无权操作此订单' });
        }

        // 更新订单状态
        order.status = status;
        await order.save();

        res.json({
            code: 200,
            data: { id: order._id, status: order.status },
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