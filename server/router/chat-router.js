import express from 'express';
import rateLimit from 'express-rate-limit';
import userAuthorization from '../middleware/user-authorization.js';
import { handleChat } from '../controller/chat-controller.js';

const chatRouter = express.Router();

// A specific rate limiter for the chat feature to prevent abuse
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each user to 100 chat messages per 15 minutes
  message: {
    status: 429,
    error: 'Too many chat requests. Please try again later.'
  }
});

// Define the chat endpoint
// It's a POST request because the client will be sending a payload (the history)
chatRouter.post('/',
  userAuthorization, 
  chatLimiter,       
  handleChat         
);

export default chatRouter;