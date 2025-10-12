import logger from '../config/logger.js';

// HTML sanitization for user input
const sanitizeHtml = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// SQL injection prevention
const sanitizeSql = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/['"]/g, '')
    .replace(/;/g, '')
    .replace(/--/g, '')
    .replace(/\/\*/g, '')
    .replace(/\*\//g, '');
};

// XSS prevention
const sanitizeXss = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/<script/gi, '')
    .replace(/<\/script>/gi, '');
};

// Main sanitization middleware
const sanitizeInput = (req, res, next) => {
  try {
    // Sanitize body
    if (req.body && typeof req.body === 'object') {
      const sanitizeObject = (obj) => {
        for (const key in obj) {
          if (typeof obj[key] === 'string') {
            obj[key] = sanitizeHtml(sanitizeSql(sanitizeXss(obj[key])));
          } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            sanitizeObject(obj[key]);
          }
        }
      };
      sanitizeObject(req.body);
    }

    // Sanitize query parameters
    if (req.query && typeof req.query === 'object') {
      const sanitizeObject = (obj) => {
        for (const key in obj) {
          if (typeof obj[key] === 'string') {
            obj[key] = sanitizeHtml(sanitizeSql(sanitizeXss(obj[key])));
          }
        }
      };
      sanitizeObject(req.query);
    }

    // Sanitize params
    if (req.params && typeof req.params === 'object') {
      const sanitizeObject = (obj) => {
        for (const key in obj) {
          if (typeof obj[key] === 'string') {
            obj[key] = sanitizeHtml(sanitizeSql(sanitizeXss(obj[key])));
          }
        }
      };
      sanitizeObject(req.params);
    }

    next();
  } catch (error) {
    logger.error(`[InputSanitizer][Error] ${error.message}`);
    res.status(400).json({ 
      status: 400, 
      error: 'Invalid input detected' 
    });
  }
};

export default sanitizeInput;
