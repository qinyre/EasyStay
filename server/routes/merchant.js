const express = require('express');
const router = express.Router();
const merchantController = require('../controllers/merchantController');
const { authMiddleware, roleCheck } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { hotelSchema } = require('../validators/schemas');
const upload = require('../middlewares/upload');

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

/**
 * @route   POST /api/v1/merchant/upload
 * @desc    商户上传图片
 * @access  Private (Merchant)
 */
router.post('/upload', (req, res, next) => {
    // 拦截 Multer 可能抛出的错误进行转换
    upload.single('file')(req, res, (err) => {
        if (err) {
            if (err.message === 'INVALID_TYPE') {
                return res.status(400).json({ code: 400, message: '只允许上传图片文件 (JPEG, JPG, PNG, WebP)' });
            }
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ code: 400, message: '文件大小不能超过50MB' });
            }
            return res.status(500).json({ code: 500, message: '图片上传失败' });
        }
        next();
    });
}, merchantController.uploadImage);

module.exports = router;
