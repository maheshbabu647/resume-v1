import logger from "../config/logger.js"

const isAdmin = (req, res, next) => {
  if (req.user && req.user.userRole === 'admin') {
    next()
  } else {
    logger.warn(`[AdminAuth] Access denied to user: ${req.user ? req.user.userId : 'unknown'} from IP: ${req.ip}`)
    const err = new Error()
    err.name = "ACCESS DENIED"
    err.message = "Access denied. Admin role required."
    err.status = 403
    next(err)
  }
};

export { isAdmin }
