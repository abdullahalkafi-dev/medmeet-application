// redisClient.ts
import { createClient, RedisClientType } from 'redis';

class RedisClient {
  public client: RedisClientType;

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });
    this.client.on('error', (err: Error) => {
      console.error('Redis Client Error:', err);
    });
  }

  async connect(): Promise<void> {
    if (!this.client.isOpen) {
      await this.client.connect();
      console.log('Connected to Redis');
    }
  }

  async ensureConnected(): Promise<void> {
    if (!this.client.isOpen) {
      await this.connect();
    }
  }

  async set(key: string, value: string, expiryInSec: number = 3600): Promise<void> {
    try {
      await this.ensureConnected();
      await this.client.setEx(key, expiryInSec, value);
    } catch (err) {
      console.error(`Error setting key ${key}:`, err);
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      await this.ensureConnected();
      return await this.client.get(key);
    } catch (err) {
      console.error(`Error getting key ${key}:`, err);
      return null;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.ensureConnected();
      await this.client.del(key);
    } catch (err) {
      console.error(`Error deleting key ${key}:`, err);
    }
  }
}

export default new RedisClient();
