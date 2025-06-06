// --- app.js (Advanced: Logging, Security, Analytics Rate Limit Handler) ---

import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import cookieParser from 'cookie-parser'
import cors from 'cors'
import logger from "./config/logger.js" // Winston
import morgan from "morgan"
import helmet from 'helmet' // Secure HTTP headers
import rateLimit from 'express-rate-limit'
import indexRouter from './router/index-router.js'
import errorHandler from './middleware/err-handler.js'
import { logAnalyticsEvent } from './service/analytics-logger.js' // <<-- NEW
import performanceLogger from './middleware/performance-logger.js'

// === [Swagger Docs Imports & Setup] ===
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CareerForge API',
      version: '1.0.0',
      description: 'API documentation for CareerForge backend',
    },
  },
  apis: ['./router/*.js'], // Adjust path if needed
}

const swaggerSpec = swaggerJsdoc(swaggerOptions)
const SWAGGER_ROUTE = '/api-docs'
 
// [PROD/DEV]: Pretty HTTP logs in dev, JSON in prod, all piped to winston
const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev'
const morganStream = { write: msg => logger.http(msg.trim()) }

const app = express()

const COOKIE_SECRET = process.env.COOKIE_SECRET || 'cookiesceret'
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173'

// === [Security Middleware: Place BEFORE all routes/parsing] ===
app.use(helmet()) // <-- [ADDED] Sets secure HTTP headers

// [SECURITY: CORS] Allow only trusted origins and credentials
app.use(cors({ 
  origin: CLIENT_ORIGIN, 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}))

app.use(cookieParser(COOKIE_SECRET))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

app.use(morgan(morganFormat, { stream: morganStream }))

// === Performance logger here ===
app.use(performanceLogger)

// === [Swagger UI Route] ===
app.use(SWAGGER_ROUTE, swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// === [Custom Rate Limit Handler with Analytics Logging] ===
const customRateLimitHandler = async (req, res, next) => {
  try {
    await logAnalyticsEvent({
      eventType: 'rate_limit_hit',
      meta: { route: req.originalUrl, ip: req.ip }
    })
  } catch (err) {
    logger.warn(`[Analytics][Log][Fail] rate_limit_hit: ${err.message}`)
  }
  res.status(429).json({ status: 429, error: 'Too many requests. Please try again later.' })
}

// === [Global Rate Limiting] ===
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  handler: customRateLimitHandler
})

app.use('/api', globalLimiter)

app.get('/health', (req, res) => {
  logger.info(`[Health] Check by ${req.ip}`)
  res.status(200).send('<h1>The Server is healthy</h1>')
})

// [4] Log important startup events
app.use((req, res, next) => {
  logger.info(`[Startup] Incoming request: ${req.method} ${req.originalUrl}`)
  next()
})

app.use('/api', indexRouter)
app.use(errorHandler) // <=== Always last!

export default app
