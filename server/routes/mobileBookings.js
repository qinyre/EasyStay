const express = require('express');
const router = express.Router();
const mobileBookingController = require('../controllers/mobileBookingController');
const { authMiddleware } = require('../middlewares/auth');

/**
 * @route   POST /api/v1/mobile/bookings
 * @desc    创建订单
 * @access  Private
 */
router.post('/bookings', authMiddleware, mobileBookingController.createBooking);

/**
 * @route   GET /api/v1/mobile/bookings
 * @desc    获取订单列表
 * @access  Private
 */
router.get('/bookings', authMiddleware, mobileBookingController.getBookings);

/**
 * @route   GET /api/v1/mobile/bookings/:id
 * @desc    获取订单详情
 * @access  Private
 */
router.get('/bookings/:id', authMiddleware, mobileBookingController.getBookingById);

/**
 * @route   PATCH /api/v1/mobile/bookings/:id/cancel
 * @desc    取消订单
 * @access  Private
 */
router.patch('/bookings/:id/cancel', authMiddleware, mobileBookingController.cancelBooking);

/**
 * @route   PATCH /api/v1/mobile/bookings/:id
 * @desc    通用订单状态更新
 * @access  Private
 */
router.patch('/bookings/:id', authMiddleware, mobileBookingController.updateBookingStatus);

module.exports = router;