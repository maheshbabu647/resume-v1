import logger from '../config/logger.js'

const createAuthCookie = async (res, authToken) => {
  try {
    const SERVER_DOMAIN = process.env.SERVER_DOMAIN || 'localhost'
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + 1)

    const cookie_options = {
      httpOnly: true,
      secure: true,
      // domain: SERVER_DOMAIN, // Uncomment if using subdomains
      path: '/',
      expires: expiryDate,
      sameSite: 'None'
    }

    res.cookie("authToken", authToken, cookie_options)

    logger.info(`[Cookie][Create][Success] Auth cookie set (httpOnly, secure) expiring: ${expiryDate.toISOString()}`)
  } catch (error) {
    logger.error(`[Cookie][Create][Error] Reason: ${error.message}`)
    const err = new Error()
    err.name = 'COOKIE CREATION FAILED'
    err.message = error.message
    throw err
  }
}

const clearAuthCookie = async (res) => {
  try {
    const SERVER_DOMAIN = process.env.SERVER_DOMAIN || 'localhost'

    const cookie_options = {
      httpOnly: true,
      secure: true,
      // domain: SERVER_DOMAIN,
      path: '/',
      sameSite: 'None'
    }

    res.clearCookie('authToken', cookie_options)
    logger.info(`[Cookie][Clear][Success] Auth cookie cleared`)
  } catch (error) {
    logger.error(`[Cookie][Clear][Error] Reason: ${error.message}`)
    const err = new Error()
    err.name = 'UNABLE TO CLEAR COOKIE'
    err.message = error.message
    throw err
  }
}

export { createAuthCookie, clearAuthCookie }
