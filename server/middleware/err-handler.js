import logger from "../config/logger.js";
import { logAnalyticsEvent } from "../service/analytics-logger.js";

const errorHandler = async (error, req, res, next) => {
  const status = error.status || 500;
  const name = error.name || "INTERNAL_SERVER_ERROR";
  const message = error.message || "Something went wrong in the server";

  // ==== [SECURE LOGGING] ====
  // Never log sensitive user data
  logger.error(
    `Status: ${status}, Name: ${name}, Message: ${message}, URL: ${req.originalUrl}, Method: ${req.method}, IP: ${req.ip}`
  );

  // Log stack trace ONLY for internal logs, never send to client
  if (error.stack) {
    logger.error(`Stack: ${error.stack}`);
  }

  // Optionally log request body in dev (redact in production)
  if (process.env.NODE_ENV !== 'production') {
    logger.error(`[Request Body]: ${JSON.stringify(req.body).slice(0, 500)}`); // Limit to 500 chars
  }

  // ==== [ANALYTICS LOGGING FOR SERVER ERRORS] ====
  // Only log analytics event for server errors (5xx)
  if (status >= 500) {
    try {
      await logAnalyticsEvent({
        eventType: 'error_server',
        meta: {
          url: req.originalUrl,
          method: req.method,
          ip: req.ip,
          status,
          name,
          message: message.slice(0, 200) // Limit message length
        }
      });
    } catch (logErr) {
      logger.warn(`[Analytics][Log][Fail] error_server: ${logErr.message}`);
    }
  }

  // ==== [SECURE RESPONSE] ====
  // Never send stack, DB error, or sensitive info to client
  res.status(status).json({
    name,
    message,
    success: false,
    // debug: process.env.NODE_ENV !== 'production' ? error.stack : undefined // [UNSAFE: commented, don't send]
  });
};

export default errorHandler;
