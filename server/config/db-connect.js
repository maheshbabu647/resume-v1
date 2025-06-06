import mongoose from "mongoose";
import logger from "./logger.js";

const connectDB = async () => {
  const MONGOURI = process.env.MONGOURI || 'mongodb://localhost:27017';
  try {
    await mongoose.connect(MONGOURI);
    logger.info(`[MongoDB][Connect][Success] Connected to database: ${MONGOURI}`);
  } catch (error) {
    logger.error(`[MongoDB][Connect][Error] Unable to connect: ${error.message}`);
    // Optionally: process.exit(1) to crash app in case of critical DB error
    process.exit(1); // Don't run the app if DB can't connect!
  }
};

const disConnectDB = async () => {
  try {
    await mongoose.disconnect();
    logger.info(`[MongoDB][Disconnect][Success] Disconnected from database`);
  } catch (error) {
    logger.warn(`[MongoDB][Disconnect][Error] ${error.message}`);
  }
};

export { connectDB, disConnectDB };
