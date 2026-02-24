const redis = require('redis');

// 创建Redis客户端
const redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// 连接Redis
redisClient.connect().catch(console.error);

// 错误处理
redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
});

// 缓存工具类
class Cache {
    /**
     * 设置缓存
     * @param {string} key 缓存键
     * @param {any} value 缓存值
     * @param {number} expiration 过期时间（秒）
     */
    static async set(key, value, expiration = 3600) {
        try {
            const jsonValue = JSON.stringify(value);
            await redisClient.set(key, jsonValue, { EX: expiration });
            return true;
        } catch (error) {
            console.error('Redis set error:', error);
            return false;
        }
    }

    /**
     * 获取缓存
     * @param {string} key 缓存键
     */
    static async get(key) {
        try {
            const value = await redisClient.get(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error('Redis get error:', error);
            return null;
        }
    }

    /**
     * 删除缓存
     * @param {string} key 缓存键
     */
    static async del(key) {
        try {
            await redisClient.del(key);
            return true;
        } catch (error) {
            console.error('Redis del error:', error);
            return false;
        }
    }

    /**
     * 清除所有缓存
     */
    static async clear() {
        try {
            await redisClient.flushAll();
            return true;
        } catch (error) {
            console.error('Redis clear error:', error);
            return false;
        }
    }
}

module.exports = {
    redisClient,
    Cache
};