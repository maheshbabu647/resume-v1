import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import pinoHttp from 'pino-http'
import helmet from 'helmet'

import { env }          from './config/env'
import { logger }       from './config/logger'
import { initSentry, Sentry } from './config/sentry'
import { API_PREFIX }   from './config/constants'
import { errorHandler } from './middleware/errorHandler'
import apiRouter        from './routers/index'

// Initialise Sentry before anything else
initSentry()

const app = express()

// ─── Sentry request handler (must be first middleware) ───────────────────────
Sentry.setupExpressErrorHandler(app)

// ─── Security + Parsing ───────────────────────────────────────────────────────
app.use(helmet())
app.use(cors({ origin: env.CLIENT_URL, credentials: true }))
app.use(express.json({ limit: '2mb' }))
app.use(cookieParser())
app.use(pinoHttp({ logger }))

// ─── API routes (all auth handled inside routers/) ────────────────────────────
app.use(API_PREFIX, apiRouter)

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ ok: true, env: env.NODE_ENV, ts: new Date().toISOString() }))

// ─── Global error handler (MUST be last) ─────────────────────────────────────
app.use(errorHandler)

export { app }
