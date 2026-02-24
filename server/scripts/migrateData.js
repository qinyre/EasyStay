const fs = require('fs').promises;
const path = require('path');
const mongoose = require('mongoose');
const User = require('../models/User');
const Hotel = require('../models/Hotel');
const Room = require('../models/Room');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/easystay';
const DATA_DIR = path.join(__dirname, '../data');

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully for migration');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

async function readJSONFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function migrateUsers() {
  console.log('Migrating users...');
  const users = await readJSONFile(path.join(DATA_DIR, 'users.json'));
  
  for (const userData of users) {
    try {
      // 检查用户是否已存在
      const existingUser = await User.findOne({ username: userData.username });
      if (!existingUser) {
        const user = new User({
          username: userData.username,
          password: userData.password, // 密码会在保存时自动加密
          role: userData.role
        });
        await user.save();
        console.log(`Migrated user: ${userData.username}`);
      } else {
        console.log(`User already exists: ${userData.username}`);
      }
    } catch (error) {
      console.error(`Error migrating user ${userData.username}:`, error);
    }
  }
  console.log('User migration completed');
}

async function migrateHotels() {
  console.log('Migrating hotels...');
  const hotels = await readJSONFile(path.join(DATA_DIR, 'hotels.json'));
  
  for (const hotelData of hotels) {
    try {
      // 检查酒店是否已存在
      const existingHotel = await Hotel.findOne({ name_cn: hotelData.name_cn });
      if (!existingHotel) {
        // 创建酒店
        const hotel = new Hotel({
          name_cn: hotelData.name_cn,
          name_en: hotelData.name_en,
          address: hotelData.address,
          star_level: hotelData.star_level,
          banner_url: hotelData.banner_url,
          tags: hotelData.tags,
          audit_status: hotelData.audit_status || 'Pending',
          is_offline: hotelData.is_offline || false,
          merchant_username: hotelData.merchant_username,
          fail_reason: hotelData.fail_reason
        });
        
        const savedHotel = await hotel.save();
        console.log(`Migrated hotel: ${hotelData.name_cn}`);
        
        // 迁移房型数据
        if (hotelData.rooms && hotelData.rooms.length > 0) {
          for (const roomData of hotelData.rooms) {
            const room = new Room({
              name: roomData.name,
              price: roomData.price,
              capacity: roomData.capacity,
              description: roomData.description,
              image_url: roomData.image_url,
              amenities: roomData.amenities,
              hotelId: savedHotel._id
            });
            await room.save();
            console.log(`Migrated room: ${roomData.name} for hotel ${hotelData.name_cn}`);
          }
        }
      } else {
        console.log(`Hotel already exists: ${hotelData.name_cn}`);
      }
    } catch (error) {
      console.error(`Error migrating hotel ${hotelData.name_cn}:`, error);
    }
  }
  console.log('Hotel migration completed');
}

async function main() {
  try {
    await connectDB();
    await migrateUsers();
    await migrateHotels();
    console.log('Data migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

main();