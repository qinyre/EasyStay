const express = require('express');
const router = express.Router();
const mobileController = require('../controllers/mobileController');

/**
 * @route   GET /api/v1/mobile/home/banners
 * @desc    获取首页 Banner
 * @access  Public
 */
router.get('/home/banners', mobileController.getBanners);

/**
 * @route   GET /api/v1/mobile/hotels
 * @desc    酒店列表查询 (带筛选、分页)
 * @access  Public
 */
router.get('/hotels', mobileController.getHotels);

/**
 * @route   GET /api/v1/mobile/hotels/:id
 * @desc    获取酒店详细信息
 * @access  Public
 */
router.get('/hotels/:id', mobileController.getHotelById);

module.exports = router;
