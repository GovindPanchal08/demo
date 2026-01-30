import morgan, { StreamOptions } from "morgan";
import logger from "./winston.logger";

// Define stream type for TypeScript
const stream: StreamOptions = {
  write: (message: string) => logger.info(message.trim()),
};

// Morgan format string
const format =
  ":remote-addr :method :url :status :res[content-length] - :response-time ms";

// Create Morgan middleware
const morganLogger = morgan(format, { stream });

export default morganLogger;
