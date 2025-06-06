// logger.js
import { createLogger, transports, format } from "winston";
import "winston-daily-rotate-file"; // Ensure this is installed

const isProd = process.env.NODE_ENV === "production";

const logFormat = format.combine(
  format.timestamp(),
  format.errors({ stack: true }),
  format.printf(({ timestamp, level, message, stack }) =>
    stack
      ? `${timestamp} [${level.toUpperCase()}]: ${message}\nStack: ${stack}`
      : `${timestamp} [${level.toUpperCase()}]: ${message}`
  )
);

const fileRotateTransport = new transports.DailyRotateFile({
  filename: "logs/app-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
  level: "info",
});

const errorFileTransport = new transports.DailyRotateFile({
  filename: "logs/error-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "10m",
  maxFiles: "30d",
  level: "error",
});

const logger = createLogger({
  level: isProd ? "info" : "debug",
  format: logFormat,
  transports: [
    new transports.Console({
      format: isProd
        ? format.json()
        : format.combine(format.colorize(), logFormat),
    }),
    fileRotateTransport,
    errorFileTransport,
  ],
  exitOnError: false,
});

export default logger;
