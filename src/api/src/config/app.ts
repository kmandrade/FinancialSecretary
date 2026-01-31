import dotenv from "dotenv";

dotenv.config();

export const config = {
  // Server
  port: parseInt(process.env.PORT || "3001", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  
  // API
  apiPrefix: "/api/v1",
  
  // CORS
  corsOrigins: process.env.CORS_ORIGINS?.split(",") || ["http://localhost:3000"],
  
  // JWT
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-in-production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  
  // Database (para futura implementacao)
  databaseUrl: process.env.DATABASE_URL || "",
  
  // Redis (para futura implementacao)
  redisUrl: process.env.REDIS_URL || "",
  
  // Price Update Interval (minutos)
  priceUpdateInterval: parseInt(process.env.PRICE_UPDATE_INTERVAL || "5", 10),
  
  // Push Notifications
  vapidPublicKey: process.env.VAPID_PUBLIC_KEY || "",
  vapidPrivateKey: process.env.VAPID_PRIVATE_KEY || "",
  
  // Email
  smtpHost: process.env.SMTP_HOST || "",
  smtpPort: parseInt(process.env.SMTP_PORT || "587", 10),
  smtpUser: process.env.SMTP_USER || "",
  smtpPass: process.env.SMTP_PASS || "",
  
  // External APIs
  brapiToken: process.env.BRAPI_TOKEN || "",
} as const;

export type Config = typeof config;
