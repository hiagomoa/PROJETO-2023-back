import Redis from "ioredis";
import { promisify } from "util";

export class RedisService {
  private redisClient: Redis;
  constructor() {
    this.redisClient = new Redis(process.env.REDIS_URL as string);

    this.redisClient.on("ready", () => {
      console.debug("redis is connected");
    });
  }
  async set(key: string, value: string): Promise<any> {
    const syncRedisSet = await promisify(this.redisClient.set).bind(
      this.redisClient
    );

    return syncRedisSet(key, value);
  }
  async get(value: string): Promise<any> {
    const syncRedisGet = promisify(this.redisClient.get).bind(this.redisClient);
    return await syncRedisGet(value);
  }
  async del(): Promise<void> {
    await promisify(this.redisClient.del).bind(this.redisClient);
  }
}
