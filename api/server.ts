import http from "http";
import app from "./src/app";
import redisService from "./src/config/redis";
import logger from "./src/core/logger/winston.logger";
// import initializeSocket from "./src/sockets/socket.server";
import { startCronJobs } from "./src/core/cron";
const httpServer = http.createServer(app);
(async () => {
  try {
    const PORT = process.env.PORT || 3000;

    const connected = await redisService.connect();
    if (connected) {
      logger.info("Redis client successfully connected");
    } else {
      logger.warn("Failed to connect to Redis - check your configuration");
    }

    httpServer.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
    // startCronJobs()
    process.on("SIGTERM", async () => {
      console.log("SIGTERM received, shutting down gracefully");
      try {
        httpServer.close(() => {
          console.log("Closed out remaining connections.");
          process.exit(0);
        });
      } catch (err) {
        console.error("Error during shutdown", err);
        process.exit(1);
      }
    });
  } catch (err) {
    console.error("Failed to start the application", err);
    process.exit(1);
  }
})();

// pm2 cmd
// pm2 start server.ts --name "vms-server" --interpreter ./node_modules/.bin/ts-node
// pm2 logs vms-server
// pm2 stop vms-server
// pm2 restart vms-server
// pm2 delete vms-server
