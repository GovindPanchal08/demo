module.exports = {
  apps: [
    {
      name: "VMS",
      script: "dist/server.js",
      instances: "max",
      exec_mode: "cluster",
      watch: false,
      autorestart: true,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "development",
        DATABASE_URL: "your_dev_db",
        REDIS_URL: "redis://localhost:6379",
        PORT: 4000,
      },
      env_staging: {
        NODE_ENV: "staging",
        DATABASE_URL: "your_staging_db",
        REDIS_URL: "redis://staging-redis:6379",
        PORT: 4000,
      },
      env_production: {
        NODE_ENV: "production",
        DATABASE_URL: process.env.DATABASE_URL,
        REDIS_URL: process.env.REDIS_URL,
        PORT: 8080,
      },
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      error_file: "logs/err.log",
      out_file: "logs/out.log",
      merge_logs: true,
      time: true,
    },
  ],
};
