import jwt from 'jsonwebtoken'
import logger from '../config/logger.js'
import dotenv from 'dotenv'
dotenv.config()

// [SECURITY] Require JWT secret at startup, or crash
const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  logger.error('[JWT][Config][Error] JWT_SECRET not set in environment variables!')
  process.exit(1)
}

// [1] Create JWT
const createToken = async (payload) => {
  try {
    // [SECURITY] Never log token itself, only userId or safe details
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: '1d',
      issuer: process.env.JWT_ISSUER || 'careerforge.pro', // [OPTIONAL: Set your own]
      audience: payload.userId ? String(payload.userId) : undefined // [OPTIONAL: Set to userId]
    })
    logger.info(`[JWT][Create][Success] Token issued for userId: ${payload.userId || 'unknown'}`)
    return token
  } catch (error) {
    // [SECURITY] Do not log sensitive payload in prod
    logger.error(`[JWT][Create][Error] Reason: ${error.message}`)
    // Throw a real error with details
    const err = new Error('TOKEN CREATION FAILED')
    err.status = 500
    err.name = 'TOKEN_CREATION_FAILED'
    err.message = error.message
    throw err
  }
}

// [2] Verify JWT
const verifyToken = async (token) => {
  try {
    const payload = jwt.verify(token, JWT_SECRET, {
      issuer: process.env.JWT_ISSUER || 'careerforge.pro',
      // [OPTIONAL: audience: userId, but you may not know userId yet]
    })
    logger.info(`[JWT][Verify][Success] Token verified for userId: ${payload.userId || 'unknown'}`)
    return payload
  } catch (error) {
    logger.warn(`[JWT][Verify][Error] Invalid or expired token. Reason: ${error.message}`)
    const err = new Error('TOKEN VERIFICATION FAILED')
    err.status = 401
    err.name = 'TOKEN_VERIFICATION_FAILED'
    err.message = error.message
    throw err
  }
}

export { createToken, verifyToken }
