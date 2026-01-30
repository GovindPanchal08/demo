// winston.logger.ts
import winston from "winston";
import config from "../../config/config";

type LogLevels = {
  error: number;
  warn: number;
  info: number;
  http: number;
  debug: number;
};

const levels: LogLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const getLevel = (): keyof LogLevels => {
  const env = config.NODE_ENV || "development";
  switch (env) {
    case "production":
      return "info";
    case "testing":
      return "warn";
    default:
      return "debug";
  }
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "blue",
  http: "white",
  debug: "white",
};

winston.addColors(colors);

const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => `${info.timestamp} [${info.level}]: ${info.message}`)
);

const logger = winston.createLogger({
  level: getLevel(),
  levels,
  transports: [
    new winston.transports.Console({
      format: consoleFormat,
    }),
  ],
  exitOnError: false,
});

// Minimal stream shape Morgan expects
interface MorganStream {
  write(message: string): void;
}

// Attach stream to logger using a local interface (no Writable)
const stream: MorganStream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

// attach using a type assertion or module augmentation if you prefer
(logger as any).stream = stream;

export default logger;
export { stream };
