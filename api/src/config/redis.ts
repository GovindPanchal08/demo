import Redis from "ioredis";
import config from "../config/config";
import logger from "../core/logger/winston.logger";

class RedisService {
  static #instance: RedisService | null = null;
  client: Redis | null = null;
  options: any;

  static getInstance(options = {}) {
    if (!RedisService.#instance) {
      RedisService.#instance = new RedisService(options);
    }
    return RedisService.#instance;
  }

  constructor(options: any = {}) {
    if (RedisService.#instance) return RedisService.#instance;
    this.options = {
      host: options.host || config.redis?.host || "127.0.0.1",
      port: options.port || Number(config.redis?.port) || 6379,
      username: options.username || config.redis?.username || "",
      password: options.password || config.redis?.password || "",
      db: options.db || Number(config.redis?.db) || 0,
      onConnect: options.onConnect || (() => { }),
      onError: options.onError || ((err: any) => logger.error(`Redis client error: ${err?.message}`)),
    };
    RedisService.#instance = this;
  }

  async connect() {
    if (this.client && this.isConnected()) {
      logger.info("Redis client already connected");
      return true;
    }
    try {
      this.client = new Redis({
        port: this.options.port,
        host: this.options.host,
        username: this.options.username || undefined,
        password: this.options.password || undefined,
        db: this.options.db,
        retryStrategy: (times: number) => Math.min(times * 50, 2000),
      });

      this.client.on("connect", () => {
        logger.info("Redis client connected");
        this.options.onConnect();
      });

      this.client.on("error", (err: any) => {
        logger.error(`Redis client error: ${err?.message}`);
        this.options.onError(err);
      });

      this.client.on("ready", () => logger.info("Redis client ready"));
      this.client.on("reconnecting", () => logger.info("Redis client reconnecting"));
      this.client.on("end", () => logger.info("Redis client connection closed"));

      return true;
    } catch (err: any) {
      logger.error(`Redis initialization error: ${err?.message}`);
      return false;
    }
  }

  isConnected() {
    return !!(this.client && this.client.status === "ready");
  }

  async disconnect() {
    if (this.client) {
      await this.client.quit();
      this.client = null;
      logger.info("Redis connection closed gracefully");
    }
  }

  async get(key: string) {
    try {
      const value = await this.client!.get(key);
      return value ? JSON.parse(value) : null;
    } catch (err: any) {
      logger.error(`Redis GET error for key ${key}: ${err?.message}`);
      return null;
    }
  }

  async set(key: string, value: any, expirySeconds?: number) {
    try {
      const stringValue = JSON.stringify(value);
      if (expirySeconds) {
        await this.client!.set(key, stringValue, "EX", expirySeconds);
      } else {
        await this.client!.set(key, stringValue);
      }
      return true;
    } catch (err: any) {
      logger.error(`Redis SET error for key ${key}: ${err?.message}`);
      return false;
    }
  }

  async del(key: string) {
    try {
      await this.client!.del(key);
      return true;
    } catch (err: any) {
      logger.error(`Redis DEL error for key ${key}: ${err?.message}`);
      return false;
    }
  }

  async exists(key: string) {
    try {
      const result = await this.client!.exists(key);
      return result === 1;
    } catch (err: any) {
      logger.error(`Redis EXISTS error for key ${key}: ${err?.message}`);
      return false;
    }
  }

  async expire(key: string, seconds: number) {
    try {
      await this.client!.expire(key, seconds);
      return true;
    } catch (err: any) {
      logger.error(`Redis EXPIRE error for key ${key}: ${err?.message}`);
      return false;
    }
  }

  async incr(key: string) {
    try {
      return await this.client!.incr(key);
    } catch (err: any) {
      logger.error(`Redis INCR error for key ${key}: ${err?.message}`);
      return null;
    }
  }
  async hset(key: string, fields: Record<string, any>) {
    try {
      const parsedFields: Record<string, string> = {};

      for (const [field, value] of Object.entries(fields)) {
        parsedFields[field] =
          typeof value === "object" ? JSON.stringify(value) : String(value);
      }

      await this.client!.hset(key, parsedFields);
      return true;
    } catch (err: any) {
      logger.error(`Redis HSET error for key ${key}: ${err?.message}`);
      return false;
    }
  }


  async hgetall(key: string) {
    try {
      return await this.client!.hgetall(key);
    } catch (err: any) {
      logger.error(`Redis HGETALL error for key ${key}: ${err?.message}`);
      return null;
    }
  }

  async lrange(key: string, start: number, stop: number) {
    try {
      const result = await this.client!.lrange(key, start, stop);
      return result.map((item) => {
        try {
          return JSON.parse(item);
        } catch {
          return item;
        }
      });
    } catch (err: any) {
      logger.error(`Redis LRANGE error for key ${key}: ${err?.message}`);
      return null;
    }
  }

  async rpush(key: string, value: any) {
    try {
      return await this.client!.rpush(
        key,
        typeof value === "object" ? JSON.stringify(value) : value
      );
    } catch (err: any) {
      logger.error(`Redis RPUSH error for key ${key}: ${err?.message}`);
      return null;
    }
  }
}

export default RedisService.getInstance();


