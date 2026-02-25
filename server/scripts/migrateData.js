const fs = require('fs').promises;
const path = require('path');
const { db, initDatabase } = require('../config/database');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, '../data');

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
  const now = new Date().toISOString();

  const insertUser = db.prepare(`
    INSERT INTO users (id, username, password, role, createdAt)
    VALUES (?, ?, ?, ?, ?)
  `);

  for (const userData of users) {
    try {
      // 检查用户是否已存在
      const existingUser = db.prepare('SELECT id FROM users WHERE username = ?').get(userData.username);
      if (!existingUser) {
        const hashedPassword = bcrypt.hashSync(userData.password, 10);
        insertUser.run(
          crypto.randomUUID(),
          userData.username,
          hashedPassword,
          userData.role || 'user',
          now
        );
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
  const now = new Date().toISOString();

  const insertHotel = db.prepare(`
    INSERT INTO hotels (id, name_cn, name_en, address, star_level, banner_url, tags, audit_status, is_offline, merchant_username, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertRoom = db.prepare(`
    INSERT INTO rooms (id, name, price, capacity, description, image_url, amenities, hotelId)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const hotelData of hotels) {
    try {
      // 检查酒店是否已存在
      const existingHotel = db.prepare('SELECT id FROM hotels WHERE name_cn = ?').get(hotelData.name_cn);
      if (!existingHotel) {
        const hotelId = crypto.randomUUID();

        insertHotel.run(
          hotelId,
          hotelData.name_cn,
          hotelData.name_en || null,
          hotelData.address,
          hotelData.star_level || null,
          hotelData.banner_url || null,
          hotelData.tags ? JSON.stringify(hotelData.tags) : null,
          hotelData.audit_status || 'Approved',
          hotelData.is_offline ? 1 : 0,
          hotelData.merchant_username || null,
          now,
          now
        );
        console.log(`Migrated hotel: ${hotelData.name_cn}`);

        // 迁移房型数据
        if (hotelData.rooms && hotelData.rooms.length > 0) {
          for (const roomData of hotelData.rooms) {
            insertRoom.run(
              crypto.randomUUID(),
              roomData.type_name || roomData.name,
              roomData.price,
              roomData.stock || roomData.capacity || 2,
              roomData.description || null,
              roomData.image_url || null,
              null,
              hotelId
            );
            console.log(`Migrated room: ${roomData.type_name || roomData.name} for hotel ${hotelData.name_cn}`);
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
    // 确保建表
    initDatabase();

    await migrateUsers();
    await migrateHotels();

    console.log('Data migration to SQLite completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

main();