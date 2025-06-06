import morgan from "morgan";
import logger from "./config/logger.js";

const stream = {
  write: (message) => logger.http(message.trim()),
};

const morganMiddleware =
  process.env.NODE_ENV === "production"
    ? morgan("combined", { stream })
    : morgan("dev");

export default morganMiddleware;
