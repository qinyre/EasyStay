/**
 * 内存级缓存（替代 Redis）
 * 使用 Map + TTL 过期机制，适合小型项目
 */

const cacheStore = new Map();

class Cache {
    /**
     * 设置缓存
     * @param {string} key 缓存键
     * @param {any} value 缓存值
     * @param {number} expiration 过期时间（秒），默认 1 小时
     */
    static async set(key, value, expiration = 3600) {
        try {
            const expireAt = Date.now() + expiration * 1000;
            cacheStore.set(key, { value, expireAt });
            return true;
        } catch (error) {
            console.error('Cache set error:', error);
            return false;
        }
    }

    /**
     * 获取缓存
     * @param {string} key 缓存键
     */
    static async get(key) {
        try {
            const entry = cacheStore.get(key);
            if (!entry) return null;

            // 检查是否过期
            if (Date.now() > entry.expireAt) {
                cacheStore.delete(key);
                return null;
            }

            return entry.value;
        } catch (error) {
            console.error('Cache get error:', error);
            return null;
        }
    }

    /**
     * 删除缓存
     * @param {string} key 缓存键
     */
    static async del(key) {
        try {
            if (key instanceof RegExp) {
                // 支持正则表达式批量删除
                for (const k of cacheStore.keys()) {
                    if (key.test(k)) {
                        cacheStore.delete(k);
                    }
                }
            } else {
                cacheStore.delete(key);
            }
            return true;
        } catch (error) {
            console.error('Cache del error:', error);
            return false;
        }
    }

    /**
     * 清除所有缓存
     */
    static async clear() {
        try {
            cacheStore.clear();
            return true;
        } catch (error) {
            console.error('Cache clear error:', error);
            return false;
        }
    }
}

module.exports = { Cache };
