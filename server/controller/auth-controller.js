import bcrypt from 'bcrypt'
import userModel from '../model/user-model.js'
import sendVerificationMail from '../service/email-verification-service.js'
import { createToken } from '../util/jwt.js'
import { createAuthCookie, clearAuthCookie } from '../util/auth-cookie.js'
import logger from '../config/logger.js'
import { logAnalyticsEvent } from '../service/analytics-logger.js'

const userSignUp = async (req, res, next) => {
  try {
    const { userName, userEmail, userPassword } = req.body
    const userExisted = await userModel.findOne({ userEmail })

    if (userExisted) {
      logger.warn(`[SignUp][Conflict] Email exists: ${userEmail} from IP: ${req.ip}`)
      const err = new Error('Signup failed')
      err.name = 'USER ALREADY EXISTS'
      err.status = 409
      return next(err)
    }

    const hashedPassword = await bcrypt.hash(userPassword, 10)
    const userData = { userName, userEmail, userPassword: hashedPassword }
    const createdData = await userModel.create(userData)

    await sendVerificationMail(createdData._id, userName, userEmail)
    const authToken = await createToken({ userId: createdData._id, userRole: createdData.userRole })
    await createAuthCookie(res, authToken)

    // === Analytics Logging ===
    await logAnalyticsEvent({
      eventType: 'user_signup',
      userId: createdData._id,
      meta: { email: userEmail, ip: req.ip },
      req
    })

    logger.info(`[SignUp][Success] New user: ${userEmail} (ID: ${createdData._id})`)
    res.status(201).json({
      success: true,
      data: {
        _id: createdData._id,
        userName: createdData.userName,
        userEmail: createdData.userEmail
      }
    })
  } catch (error) {
    logger.error(`[SignUp][Error] Email: ${req.body.userEmail} - ${error.message}`)
    const err = new Error(error.message)
    err.name = error.name || "USER SIGNUP FAILED"
    err.status = error.status || 500
    next(err)
  }
}

const userSignIn = async (req, res, next) => {
  try {
    const { userEmail, userPassword } = req.body
    const userExisted = await userModel.findOne({ userEmail })
    let isAuth = false

    if (userExisted) {
      const userVerified = await bcrypt.compare(userPassword, userExisted.userPassword)
      isAuth = userVerified
      // Optionally: if (!userExisted.verified) isAuth = false
    }

    if (!isAuth) {
      logger.warn(`[SignIn][Fail] Email: ${userEmail} from IP: ${req.ip}`)
      // === Analytics: log failed login ===
      try {
        await logAnalyticsEvent({
          eventType: 'user_signin_failed',
          meta: { email: userEmail, ip: req.ip }
        })
      } catch (logErr) {
        logger.warn(`[Analytics][Log][Fail] user_signin_failed: ${logErr.message}`)
      }
      const err = new Error('Invalid email or password')
      err.name = 'AUTH_FAILED'
      err.status = 401
      return next(err)
    }

    const authToken = await createToken({ userId: userExisted._id, userRole: userExisted.userRole })
    await clearAuthCookie(res)
    await createAuthCookie(res, authToken)

    // === Analytics Logging for success ===
    await logAnalyticsEvent({
      eventType: 'user_signin',
      userId: userExisted._id,
      meta: { email: userEmail, ip: req.ip }
    })

    logger.info(`[SignIn][Success] User: ${userEmail} (ID: ${userExisted._id}) from IP: ${req.ip}`)
    res.status(200).json({
      success: true,
      data: {
        _id: userExisted._id,
        userName: userExisted.userName,
        userEmail: userExisted.userEmail,
        userRole: userExisted.userRole //security issue to send user role
      }
    })
  } catch (error) {
    logger.warn(`[SignIn][Error] Email: ${req.body.userEmail} - ${error.message}`)
    const err = new Error(error.message)
    err.name = error.name || "USER SIGNIN FAILED"
    err.status = error.status || 500
    next(err)
  }
}


const authStatus = async (req, res, next) => {
  try {
    const { userId } = req.user
    const userData = await userModel.findById({ _id: userId })
    if (!userData) {
      const err = new Error('User not found')
      err.name = 'USER NOT FOUND'
      err.status = 404
      return next(err)
    }

    // === Analytics Logging (optional, comment out if not needed) ===
    // await logAnalyticsEvent({
    //   eventType: 'auth_status_check',
    //   userId: userId,
    //   meta: { ip: req.ip }
    // })

    logger.info(`[AuthStatus][Checked] User: ${userId}`)
    res.status(200).json({
      success: true,
      data: {
        _id: userData._id,
        userName: userData.userName,
        userEmail: userData.userEmail,
        userRole: userData.userRole //security issue to send user role
      }
    })
  } catch (error) {
    logger.warn(`[AuthStatus][Error] ${error.message}`)
    const err = new Error(error.message)
    err.name = error.name || "AUTH_STATUS_FAILED"
    err.status = error.status || 500
    next(err)
  }
}

const userSignout = async (req, res, next) => {
  try {
    await clearAuthCookie(res)

    // === Analytics Logging ===
    await logAnalyticsEvent({
      eventType: 'user_signout',
      userId: req.user ? req.user.userId : null,
      meta: { ip: req.ip }
    })

    logger.info(`[SignOut][Success] User: ${req.user ? req.user.userId : 'unknown'} from IP: ${req.ip}`)
    res.status(200).json({ success: true })
  } catch (error) {
    logger.warn(`[SignOut][Error] ${error.message}`)
    const err = new Error(error.message)
    err.name = error.name || "SIGNOUT_FAILED"
    err.status = error.status || 500
    next(err)
  }
}

export { userSignIn, userSignUp, userSignout, authStatus }
