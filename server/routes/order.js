const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authMiddleware, roleCheck } = require('../middlewares/auth');

/**
 * @route   POST /api/v1/order
 * @desc    创建订单
 * @access  Private
 */
router.post('/', authMiddleware, orderController.createOrder);

/**
 * @route   GET /api/v1/order
 * @desc    获取用户订单列表
 * @access  Private
 */
router.get('/', authMiddleware, orderController.getUserOrders);

/**
 * @route   GET /api/v1/order/:id
 * @desc    获取订单详情
 * @access  Private
 */
router.get('/:id', authMiddleware, orderController.getOrderById);

/**
 * @route   PATCH /api/v1/order/:id/status
 * @desc    更新订单状态
 * @access  Private
 */
router.patch('/:id/status', authMiddleware, orderController.updateOrderStatus);

/**
 * @route   PATCH /api/v1/order/:id/payment
 * @desc    更新支付状态
 * @access  Private
 */
router.patch('/:id/payment', authMiddleware, orderController.updatePaymentStatus);

/**
 * @route   GET /api/v1/order/admin/all
 * @desc    获取所有订单（管理员）
 * @access  Private (Admin)
 */
router.get('/admin/all', authMiddleware, roleCheck(['admin']), orderController.getAllOrders);

module.exports = router;