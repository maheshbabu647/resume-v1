import { verifyToken } from "../../util/jwt.js"
import userModel from "../../model/user-model.js"
import logger from "../../config/logger.js"

const verifyUser = async (req, res, next) => {
  try {
    const verificationToken = req.params.verificationToken
    let payload
    try {
      payload = await verifyToken(verificationToken)
    } catch (error) {
      logger.warn(`[MailVerification][TokenInvalid] Invalid/expired token, IP: ${req.ip}`)
      // Always send generic error (don't leak details)
      return res.status(401).json({ success: false, message: 'Verification link is invalid or expired.' })
    }

    const { userId } = payload

    // [1] Atomic check & update: Only verify if not yet verified
    const user = await userModel.findOneAndUpdate(
      { userId, verified: { $ne: true } },
      { $set: { verified: true } },
      { new: false }
    )

    if (!user) {
      // User not found OR already verified; never leak which!
      logger.warn(`[MailVerification][NotFoundOrAlreadyVerified] userId: ${userId}, IP: ${req.ip}`)
      return res.status(401).json({ success: false, message: 'Verification link is invalid or expired.' })
    }

    logger.info(`[MailVerification][Success] User verified: ${userId}, IP: ${req.ip}`)

    res.status(200).json({ success: true, message: 'User verified successfully.' })
  } catch (error) {
    // Fallback: never leak error details to client
    logger.error(`[MailVerification][Error] IP: ${req.ip}, Reason: ${error.message}`)
    res.status(401).json({ success: false, message: 'Verification link is invalid or expired.' })
  }
}

export default verifyUser
