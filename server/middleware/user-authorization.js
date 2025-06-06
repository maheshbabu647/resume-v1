import { verifyToken } from "../util/jwt.js"
import logger from "../config/logger.js"

const userAuthorization = async (req, res, next) => {
  try {
    const { authToken } = req.cookies
    if (!authToken) {
      logger.warn(`[Auth] Token missing from ${req.ip} for ${req.originalUrl}`)
      const err = new Error()
      err.name = 'AUTHORIZATION TOKEN NOT FOUND'
      err.message = 'Unable to find the authorization token in the cookie'
      err.status = 401
      return next(err)
    }
    const { userId, userRole } = await verifyToken(authToken)
    req.user = { userId, userRole }
    logger.info(`[Auth] Auth success for user ${userId}, role ${userRole}, from IP: ${req.ip}`)
    next()
  } catch (error) {
    logger.warn(`[Auth] Token invalid or expired for ${req.ip}: ${error.message}`)
    const err = new Error()
    err.name = error.name || 'AUTHORIZATION FAILED'
    err.message = error.message || 'Unable to authorize, signin again'
    err.status = 401
    next(err)
  }
}

export default userAuthorization
