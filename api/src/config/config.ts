import { configDotenv } from "dotenv"
configDotenv();
const _config = {
  NODE_ENV: process.env.NODE_ENV || "development",
  JWT_SECRET: process.env.JWT_SECRET || "",
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_RESET_SECRET: process.env.JWT_RESET_SECRET,
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    db: process.env.REDIS_DB,
    url: process.env.REDIS_URL,
  },
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  SMTP_PORT: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
  SMTP_FROM: process.env.SMTP_FROM || "",
  SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL || "",
  SMTP_HOST: process.env.SMTP_HOST || "smtp.gmail.com",
  RABBITMQ_URL: process.env.RABBITMQ_URL || "amqp://localhost:5672",
  TWILIO_SID: process.env.TWILIO_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN
};

// console.log("Configuration loaded:", _config);

export default _config;
