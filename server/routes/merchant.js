const express = require('express');
const router = express.Router();
const merchantController = require('../controllers/merchantController');
const { authMiddleware, roleCheck } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { hotelSchema } = require('../validators/schemas');

// 全局应用认证中间件，并限定仅 merchant 角色可访问
router.use(authMiddleware);
router.use(roleCheck(['merchant']));

/**
 * @route   GET /api/v1/merchant/hotels
 * @desc    查询该商户名下的酒店
 * @access  Private (Merchant)
 */
router.get('/hotels', merchantController.getMyHotels);

/**
 * @route   POST /api/v1/merchant/hotels
 * @desc    商户录入新酒店
 * @access  Private (Merchant)
 */
router.post('/hotels', validate(hotelSchema), merchantController.createHotel);

/**
 * @route   PUT /api/v1/merchant/hotels/:id
 * @desc    商户编辑现有酒店
 * @access  Private (Merchant)
 */
router.put('/hotels/:id', validate(hotelSchema), merchantController.updateHotel);

module.exports = router;
