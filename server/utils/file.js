const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');

// 简单的读写锁标志，防止高并发下文件腐烂
let isWritingHotels = false;
let isWritingUsers = false;

// 辅助方法：等待锁释放
const waitForLock = async (checkLockFunc) => {
    while (checkLockFunc()) {
        // 短暂等待
        await new Promise(resolve => setTimeout(resolve, 10));
    }
};

/**
 * 读取酒店数据
 */
async function readHotels() {
    const filePath = path.join(DATA_DIR, 'hotels.json');
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(content);
    } catch (error) {
        if (error.code === 'ENOENT') {
            // 文件不存在则返回空数组
            return [];
        }
        throw error;
    }
}

/**
 * 写入酒店数据 (带简易文件锁保护)
 */
async function writeHotels(hotels) {
    await waitForLock(() => isWritingHotels);

    isWritingHotels = true;
    try {
        const filePath = path.join(DATA_DIR, 'hotels.json');
        await fs.writeFile(
            filePath,
            JSON.stringify(hotels, null, 2),
            'utf-8'
        );
    } finally {
        isWritingHotels = false;
    }
}

/**
 * 读取用户数据
 */
async function readUsers() {
    const filePath = path.join(DATA_DIR, 'users.json');
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

/**
 * 写入用户数据 (带简易文件锁保护)
 */
async function writeUsers(users) {
    await waitForLock(() => isWritingUsers);

    isWritingUsers = true;
    try {
        const filePath = path.join(DATA_DIR, 'users.json');
        await fs.writeFile(
            filePath,
            JSON.stringify(users, null, 2),
            'utf-8'
        );
    } finally {
        isWritingUsers = false;
    }
}

module.exports = {
    readHotels,
    writeHotels,
    readUsers,
    writeUsers
};
