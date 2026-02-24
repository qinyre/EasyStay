const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  description: {
    type: String
  },
  image_url: {
    type: String
  },
  amenities: {
    type: [String]
  },
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  }
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;