import logger from './logger.js';

// Security configuration validation
const validateSecurityConfig = () => {
  const requiredEnvVars = [
    'JWT_SECRET',
    'COOKIE_SECRET',
    'NODE_ENV'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    logger.error(`[Security][Config][Error] Missing required environment variables: ${missingVars.join(', ')}`);
    process.exit(1);
  }

  // Validate JWT secret strength
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    logger.error('[Security][Config][Error] JWT_SECRET must be at least 32 characters long');
    process.exit(1);
  }

  // Validate cookie secret strength
  if (process.env.COOKIE_SECRET && process.env.COOKIE_SECRET.length < 32) {
    logger.error('[Security][Config][Error] COOKIE_SECRET must be at least 32 characters long');
    process.exit(1);
  }

  logger.info('[Security][Config][Success] All security configurations validated');
};

// Security headers configuration
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': process.env.NODE_ENV === 'production' 
    ? 'max-age=31536000; includeSubDomains; preload' 
    : undefined
};

// Content Security Policy
export const cspDirectives = {
  defaultSrc: ["'self'"],
  styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  fontSrc: ["'self'", "https://fonts.gstatic.com"],
  imgSrc: ["'self'", "data:", "https:"],
  scriptSrc: ["'self'", "https://www.googletagmanager.com"],
  connectSrc: ["'self'", "https://www.google-analytics.com"],
  frameSrc: ["'none'"],
  objectSrc: ["'none'"],
  upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null
};

export default validateSecurityConfig;
