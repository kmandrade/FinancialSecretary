import winston from "winston";
import { config } from "./index.js";

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = printf(({ level, message, timestamp, jobName, stack }) => {
  const job = jobName ? `[${jobName}]` : "";
  return `${timestamp} [${level}] ${job}: ${stack || message}`;
});

export const logger = winston.createLogger({
  level: config.nodeEnv === "production" ? "info" : "debug",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        logFormat
      ),
    }),
  ],
});

if (config.nodeEnv === "production") {
  logger.add(
    new winston.transports.File({
      filename: "logs/worker-error.log",
      level: "error",
    })
  );
  logger.add(
    new winston.transports.File({
      filename: "logs/worker-combined.log",
    })
  );
}

// Helper para criar logger com contexto do job
export const createJobLogger = (jobName: string) => {
  return {
    info: (message: string, meta?: object) => 
      logger.info(message, { jobName, ...meta }),
    warn: (message: string, meta?: object) => 
      logger.warn(message, { jobName, ...meta }),
    error: (message: string, meta?: object) => 
      logger.error(message, { jobName, ...meta }),
    debug: (message: string, meta?: object) => 
      logger.debug(message, { jobName, ...meta }),
  };
};
