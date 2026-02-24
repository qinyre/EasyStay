const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name_cn: {
    type: String,
    required: true
  },
  name_en: {
    type: String
  },
  address: {
    type: String,
    required: true
  },
  star_level: {
    type: Number
  },
  banner_url: {
    type: String
  },
  tags: {
    type: [String]
  },
  audit_status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  is_offline: {
    type: Boolean,
    default: false
  },
  merchant_username: {
    type: String,
    required: true
  },
  fail_reason: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// 更新时间中间件
hotelSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel;