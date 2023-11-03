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
  async publish(key: string, value: string): Promise<any> {
    const syncRedisSet = await this.redisClient.publish(key, value);

    console.log(syncRedisSet);

    return syncRedisSet;
  }
}
