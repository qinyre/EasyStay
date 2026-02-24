const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // 从环境变量获取数据库连接字符串
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/easystay';
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;