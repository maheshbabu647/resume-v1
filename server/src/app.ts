import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'

import { env }          from './config/env'
import { API_PREFIX }   from './config/constants'
import { errorHandler } from './middleware/errorHandler'
import apiRouter        from './routers/index'

const app = express()

// ─── Security + Parsing ───────────────────────────────────────────────────────
app.use(helmet())
app.use(cors({ origin: env.CLIENT_URL, credentials: true }))
app.use(express.json({ limit: '2mb' }))
app.use(cookieParser())
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'))

// ─── API routes (all auth handled inside routers/) ────────────────────────────
app.use(API_PREFIX, apiRouter)

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ ok: true, env: env.NODE_ENV, ts: new Date().toISOString() }))

// ─── Global error handler (MUST be last) ─────────────────────────────────────
app.use(errorHandler)

export { app }
