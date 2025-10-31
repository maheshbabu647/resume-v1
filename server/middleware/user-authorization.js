import { verifyToken } from "../util/jwt.js"
import logger from "../config/logger.js"
import userModel from "../model/user-model.js"

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
    
    // Fetch full user details for AI usage tracking
    const user = await userModel.findById(userId).select('_id userEmail userName userRole')
    if (!user) {
      logger.warn(`[Auth] User ${userId} not found in database`)
      const err = new Error()
      err.name = 'USER NOT FOUND'
      err.message = 'User account not found'
      err.status = 401
      return next(err)
    }
    
    req.user = {
      _id: user._id,
      userId: user._id, // Keep for backward compatibility
      email: user.userEmail,
      userEmail: user.userEmail, // Keep for backward compatibility
      name: user.userName,
      userRole: user.userRole
    }
    logger.info(`[Auth] Auth success for user ${userId} (${user.userEmail}), role ${userRole}, from IP: ${req.ip}`)
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
