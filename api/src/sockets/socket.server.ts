import { Server } from "socket.io";
import { createAdapter as createClusterAdapter } from "@socket.io/cluster-adapter";
// import { createAdapter as createRedisAdapter } from "@socket.io/redis-adapter";
// import { createClient } from "redis";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import UserDAO from "../modules/auth/user.dao";

interface User {
  id: number;
  [key: string]: any;
}

const initializeSocket = async (httpServer: import("http").Server) => {
  const io = new Server(httpServer, {
    cors: { origin: "*" },
  });

  // io.adapter(createClusterAdapter());

  // Redis adapter setup (optional) - left commented for local dev
  // const pubClient = createClient({ url: process.env.REDIS_URL || "redis://localhost:6379" });
  // const subClient = pubClient.duplicate();
  // await Promise.all([pubClient.connect(), subClient.connect()]);
  // io.adapter(createRedisAdapter(pubClient, subClient));

  io.use(async (socket: any, next) => {
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
    if (!cookies.token) {
      return next(new Error("Authentication error: No token provided"));
    }

    try {
      const decoded: any = jwt.verify(
        cookies.token,
        process.env.JWT_SECRET || ""
      );
      const user: User | null = await UserDAO.getUserById(decoded.id);
      if (!user) {
        return next(new Error("User not found"));
      }
      socket.user = user;
      next();
    } catch (err) {
      console.error("Socket authentication error:", err);
      return next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket: any) => {
    console.log(`Client connected: ${socket.id}, user=${socket.user?.id}`);

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
};

export default initializeSocket;
