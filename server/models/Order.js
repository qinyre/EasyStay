const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hotel_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  room_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  check_in_date: {
    type: Date,
    required: true
  },
  check_out_date: {
    type: Date,
    required: true
  },
  guests: {
    type: Number,
    required: true
  },
  total_price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  payment_status: {
    type: String,
    enum: ['unpaid', 'paid', 'refunded'],
    default: 'unpaid'
  },
  payment_method: {
    type: String
  },
  transaction_id: {
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
orderSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;