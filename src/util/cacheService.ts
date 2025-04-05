// cacheService.ts
import redisClient from "./redisClient";

class CacheService {
  async setCache(
    key: string,
    value: any,
    expiryInSec: number = 3600,
  ): Promise<void> {
    const stringifiedValue = JSON.stringify(value);
    await redisClient.set(key, stringifiedValue, expiryInSec);
  }

  async getCache<T>(key: string): Promise<T | null> {
    const data = await redisClient.get(key);
    if (data) {
      return JSON.parse(data) as T;
    }
    return null;
  }

  async deleteCache(key: string): Promise<void> {
    await redisClient.delete(key);
  }
}

export default new CacheService();
