// // logger.js
// import { createLogger, transports, format } from "winston";
// import "winston-daily-rotate-file"; // Ensure this is installed

// const isProd = process.env.NODE_ENV === "production";

// const logFormat = format.combine(
//   format.timestamp(),
//   format.errors({ stack: true }),
//   format.printf(({ timestamp, level, message, stack }) =>
//     stack
//       ? `${timestamp} [${level.toUpperCase()}]: ${message}\nStack: ${stack}`
//       : `${timestamp} [${level.toUpperCase()}]: ${message}`
//   )
// );

// const fileRotateTransport = new transports.DailyRotateFile({
//   filename: "logs/app-%DATE%.log",
//   datePattern: "YYYY-MM-DD",
//   zippedArchive: true,
//   maxSize: "20m",
//   maxFiles: "14d",
//   level: "info",
// });

// const errorFileTransport = new transports.DailyRotateFile({
//   filename: "logs/error-%DATE%.log",
//   datePattern: "YYYY-MM-DD",
//   zippedArchive: true,
//   maxSize: "10m",
//   maxFiles: "30d",
//   level: "error",
// });

// const logger = createLogger({
//   level: isProd ? "info" : "debug",
//   format: logFormat,
//   transports: [
//     new transports.Console({
//       format: isProd
//         ? format.json()
//         : format.combine(format.colorize(), logFormat),
//     }),
//     fileRotateTransport,
//     errorFileTransport,
//   ],
//   exitOnError: false,
// });

// export default logger;


// server/config/logger.js

import winston, { createLogger, transports, format } from "winston";
import "winston-daily-rotate-file";

const isProd = process.env.NODE_ENV === "production";
const logDir = 'logs'; // Centralized log directory

// Define custom log levels to include 'http'
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.errors({ stack: true }),
  format.printf(({ timestamp, level, message, stack }) =>
    stack
      ? `${timestamp} [${level.toUpperCase()}]: ${message}\n${stack}`
      : `${timestamp} [${level.toUpperCase()}]: ${message}`
  )
);

// Define transports to be used
const transportsList = [
  new transports.Console({
    format: isProd
      ? format.json() 
      : format.combine(
          format.colorize({ all: true }), 
          logFormat
        ),
  }),
];


if (!isProd) {
  transportsList.push(
    new transports.DailyRotateFile({
      filename: `${logDir}/app-%DATE%.log`,
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    })
  );
  transportsList.push(
    new transports.DailyRotateFile({
      level: "error",
      filename: `${logDir}/error-%DATE%.log`,
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "10m",
      maxFiles: "30d",
    })
  );
}

const logger = createLogger({
  level: isProd ? "http" : "debug",
  levels, 
  format: logFormat,
  transports: transportsList,
  exitOnError: false,
});

export default logger;