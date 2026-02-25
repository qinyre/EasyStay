const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware, roleCheck } = require('../middlewares/auth');

// 全局应用认证中间件，并限定仅 admin 角色可访问
router.use(authMiddleware);
router.use(roleCheck(['admin']));

/**
 * @route   GET /api/v1/admin/hotels
 * @desc    获取全量酒店列表用于审核
 * @access  Private (Admin)
 */
router.get('/hotels', adminController.getAllHotels);

/**
 * @route   GET /api/v1/admin/hotels/:id
 * @desc    获取单个酒店详情用于审核
 * @access  Private (Admin)
 */
router.get('/hotels/:id', adminController.getHotelById);

/**
 * @route   PATCH /api/v1/admin/audit/:hotelId
 * @desc    审核酒店信息 (通过/拒绝)
 * @access  Private (Admin)
 */
router.patch('/audit/:hotelId', adminController.auditHotel);

/**
 * @route   PATCH /api/v1/admin/publish/:hotelId
 * @desc    发布/下线酒店 (虚拟删除)
 * @access  Private (Admin)
 */
router.patch('/publish/:hotelId', adminController.publishHotel);

module.exports = router;
