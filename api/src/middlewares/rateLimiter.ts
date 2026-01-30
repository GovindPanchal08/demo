import rateLimit, { RateLimitRequestHandler, Options, ipKeyGenerator } from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { Request, Response, NextFunction } from 'express';
import redisService from '../config/redis';
import logger from "../core/logger/winston.logger"

interface FallbackLimiterOptions extends Partial<Options> {
  storePrefix: string;
}

const createRedisStore = (prefix: string): any | undefined => {
  try {
    if (redisService.client && redisService.isConnected()) {
      return new RedisStore({
        sendCommand: (...args: any[]) => {
          if (!redisService.client) {
            throw new Error("Redis client is not available");
          }
          return redisService.client.call(...(args as [string, ...any[]])) as Promise<any>;
        },
        prefix: prefix,
      });
    }
    return undefined;
  } catch (error: any) {
    logger.warn(`Redis store creation failed: ${error.message}`);
    return undefined;
  }
};

type LimiterMiddleware = (req: Request, res: Response, next: NextFunction) => void;

const createRateLimiterWithFallback = (
  options: FallbackLimiterOptions
): LimiterMiddleware => {
  let limiter: RateLimitRequestHandler | null = null;

  return (req: Request, res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV === 'testing') {
      return next();
    }

    if (!limiter) {
      const redisStore = createRedisStore(options.storePrefix);
      if (redisStore) {
        logger.info(
          `Using Redis store for rate limiting: ${options.storePrefix}`
        );
        limiter = rateLimit({
          ...options,
          store: redisStore,
        });
      } else {
        logger.warn(
          `Using memory store for rate limiting: ${options.storePrefix}`
        );
        limiter = rateLimit({
          ...options,
          // No store specified, will use default memory store
        });
      }
    }

    // 'limiter' is guaranteed to be non-null here, assert its type
    return (limiter as RateLimitRequestHandler)(req, res, next);
  };
};


export const registerRateLimiter: LimiterMiddleware = createRateLimiterWithFallback({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  storePrefix: 'rl:register:',
  message: {
    status: 'error',
    statusCode: 429,
    message:
      'Too many registration attempts from this IP, please try again in a minute.',
    details: {
      retryAfter: '60 seconds',
      maxRequests: 5,
      windowMs: 60000,
    },
  },
  handler: (req, res) => {
    res.status(429).json({
      status: 'error',
      statusCode: 429,
      message:
        'Too many registration attempts from this IP, please try again in a minute.',
      details: {
        retryAfter: '60 seconds',
        maxRequests: 5,
        windowMs: 60000,
        ip: req.ip,
        timestamp: new Date().toISOString(),
      },
    });
  },
});

export const authRateLimiter: LimiterMiddleware = createRateLimiterWithFallback({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 requests per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  storePrefix: 'rl:auth:',
  message: {
    status: 'error',
    statusCode: 429,
    message:
      'Too many authentication attempts from this IP, please try again later.',
    details: {
      retryAfter: '15 minutes',
      maxRequests: 20,
      windowMs: 900000,
    },
  },
  handler: (req, res) => {
    res.status(429).json({
      status: 'error',
      statusCode: 429,
      message:
        'Too many authentication attempts from this IP, please try again later.',
      details: {
        retryAfter: '15 minutes',
        maxRequests: 20,
        windowMs: 900000,
        ip: req.ip,
        timestamp: new Date().toISOString(),
      },
    });
  },
});

export const generalRateLimiter: LimiterMiddleware = createRateLimiterWithFallback({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  storePrefix: 'rl:general:',
  message: {
    status: 'error',
    statusCode: 429,
    message: 'Too many requests from this IP, please try again later.',
    details: {
      retryAfter: '15 minutes',
      maxRequests: 100,
      windowMs: 900000,
    },
  },
  handler: (req, res) => {
    res.status(429).json({
      status: 'error',
      statusCode: 429,
      message: 'Too many requests from this IP, please try again later.',
      details: {
        retryAfter: '15 minutes',
        maxRequests: 100,
        windowMs: 900000,
        ip: req.ip,
        timestamp: new Date().toISOString(),
      },
    });
  },
});

export const hostRateLimiter: LimiterMiddleware = createRateLimiterWithFallback({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10, // 10 requests per 10 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  storePrefix: 'rl:host:',
  message: {
    status: 'error',
    statusCode: 429,
    message: 'Too many host requests from this IP, please try again later.',
    details: {
      retryAfter: '10 minutes',
      maxRequests: 10,
      windowMs: 600000,
    },
  },
  handler: (req, res) => {
    res.status(429).json({
      status: 'error',
      statusCode: 429,
      message:
        'Too many product requests from this IP, please try again later.',
      details: {
        retryAfter: '10 minutes',
        maxRequests: 10,
        windowMs: 600000,
        ip: req.ip,
        timestamp: new Date().toISOString(),
      },
    });
  },
});

export const adminRateLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  store: createRedisStore('rate_limit:admin:'),
  // keyGenerator: (req: Request) => req.ip ?? "",
  skipSuccessfulRequests: false,
  skipFailedRequests: false,

  message: {
    status: 'error',
    statusCode: 429,
    message: 'Too many admin requests from this IP, please try again later.',
    details: {
      retryAfter: '5 minutes',
      maxRequests: 100,
      windowMs: 300000,
    },
  },
  handler: (req, res) => {
    res.status(429).json({
      status: 'error',
      statusCode: 429,
      message: 'Too many admin requests from this IP, please try again later.',
      details: {
        retryAfter: '5 minutes',
        maxRequests: 100,
        windowMs: 300000,
        ip: req.ip,
        timestamp: new Date().toISOString(),
      },
    });
  },
});