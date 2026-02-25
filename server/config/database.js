const Database = require('better-sqlite3');
const path = require('path');

// 数据库文件路径（存放在 server/data/ 目录下）
const DB_PATH = path.join(__dirname, '..', 'data', 'easystay.db');

// 确保 data 目录存在
const fs = require('fs');
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 创建数据库连接（同步 API，无需 await）
const db = new Database(DB_PATH);

// 开启 WAL 模式（提升并发读写性能）
db.pragma('journal_mode = WAL');
// 开启外键约束
db.pragma('foreign_keys = ON');

/**
 * 初始化数据库表结构
 */
const initDatabase = () => {
  // 用户表
  db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id          TEXT PRIMARY KEY,
            phone       TEXT UNIQUE,
            email       TEXT UNIQUE,
            password    TEXT NOT NULL,
            name        TEXT,
            avatar      TEXT,
            role        TEXT NOT NULL DEFAULT 'user',
            username    TEXT UNIQUE,
            createdAt   TEXT DEFAULT (datetime('now'))
        )
    `);

  // 酒店表
  db.exec(`
        CREATE TABLE IF NOT EXISTS hotels (
            id                  TEXT PRIMARY KEY,
            name_cn             TEXT NOT NULL,
            name_en             TEXT,
            address             TEXT NOT NULL,
            star_level          INTEGER,
            open_date           TEXT,
            banner_url          TEXT,
            description         TEXT,
            tags                TEXT,
            audit_status        TEXT DEFAULT 'Pending',
            is_offline          INTEGER DEFAULT 0,
            merchant_username   TEXT,
            fail_reason         TEXT,
            createdAt           TEXT DEFAULT (datetime('now')),
            updatedAt           TEXT DEFAULT (datetime('now'))
        )
    `);

  // 如果酒店表已经存在但缺少open_date字段，则添加该字段
  try {
    db.exec(`ALTER TABLE hotels ADD COLUMN open_date TEXT`);
  } catch (error) {
    // 如果字段已经存在，忽略错误
    console.log('open_date字段已经存在，跳过添加');
  }

  // 如果酒店表已经存在但缺少facilities字段，则添加该字段
  try {
    db.exec(`ALTER TABLE hotels ADD COLUMN facilities TEXT`);
  } catch (error) {
    console.log('facilities字段已经存在，跳过添加');
  }

  // 房型表
  db.exec(`
        CREATE TABLE IF NOT EXISTS rooms (
            id          TEXT PRIMARY KEY,
            name        TEXT NOT NULL,
            price       REAL NOT NULL,
            capacity    INTEGER NOT NULL DEFAULT 2,
            description TEXT,
            image_url   TEXT,
            amenities   TEXT,
            hotelId     TEXT NOT NULL,
            FOREIGN KEY (hotelId) REFERENCES hotels(id) ON DELETE CASCADE
        )
    `);

  // 订单表
  db.exec(`
        CREATE TABLE IF NOT EXISTS orders (
            id              TEXT PRIMARY KEY,
            user_id         TEXT NOT NULL,
            hotel_id        TEXT NOT NULL,
            room_id         TEXT NOT NULL,
            check_in_date   TEXT NOT NULL,
            check_out_date  TEXT NOT NULL,
            guests          INTEGER DEFAULT 1,
            total_price     REAL NOT NULL,
            status          TEXT DEFAULT 'pending',
            payment_status  TEXT DEFAULT 'unpaid',
            payment_method  TEXT,
            transaction_id  TEXT,
            guestName       TEXT,
            guestPhone      TEXT,
            createdAt       TEXT DEFAULT (datetime('now')),
            updatedAt       TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (hotel_id) REFERENCES hotels(id),
            FOREIGN KEY (room_id) REFERENCES rooms(id)
        )
    `);

  console.log('SQLite database initialized successfully');
};

module.exports = { db, initDatabase };
