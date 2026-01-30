import { NextFunction, Request, Response } from "express";
import redisService from "../config/redis";

export default (keyFactory: (req: Request) => string, ttl = 60) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const redisKey = keyFactory(req);
    const exists = await redisService.exists(redisKey);
    if (exists) {
      const cached = await redisService.get(redisKey);
      return res.status(429).json({
        status: "error",
        message: "Too many requests, please try again later.",
        cached,
      });
    } else {
      await redisService.set(redisKey, "1", ttl);
      // intercept response.json to cache body when responding
      const originalJson = res.json.bind(res);
      res.json = (body: any) => {
        redisService.set(redisKey, body, ttl); // fire and forget
        return originalJson(body);
      };
      return next();
    }
  };
};
