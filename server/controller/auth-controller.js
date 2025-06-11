import bcrypt from 'bcrypt'
import crypto from 'crypto'
import userModel from '../model/user-model.js'
import sendVerificationMail from '../service/email-verification-service.js'
import sendPasswordResetEmail from '../service/password-reset-service.js'
import { createToken } from '../util/jwt.js' // Still needed for auth token
import { createAuthCookie, clearAuthCookie } from '../util/auth-cookie.js'
import logger from '../config/logger.js'
import { logAnalyticsEvent } from '../service/analytics-logger.js'

const userSignUp = async (req, res, next) => {
  try {
    const { userName, userEmail, userPassword } = req.body
    const userExisted = await userModel.findOne({ userEmail })

    if (userExisted) {
      logger.warn(`[SignUp][Conflict] Email exists: ${userEmail} from IP: ${req.ip}`)
      const err = new Error('An account with this email address already exists.')
      err.name = 'USER ALREADY EXISTS'
      err.status = 409
      return next(err)
    }

    const hashedPassword = await bcrypt.hash(userPassword, 10)
    const userData = { userName, userEmail, userPassword: hashedPassword }
    const createdData = await userModel.create(userData)

    // Generate and send verification code
    const verificationCode = await sendVerificationMail(createdData._id, userName, userEmail);

    if (verificationCode) {
      // Hash the verification code before storing it
      createdData.verificationCode = crypto.createHash('sha256').update(verificationCode).digest('hex');
      createdData.verificationCodeExpires = Date.now() + 15 * 60 * 1000; // Code valid for 15 minutes
      await createdData.save(); // Save the user with the verification code
    } else {
      logger.error(`[SignUp][EmailError] Failed to send verification email for user: ${userEmail}`);
      // Decide how to handle this: either allow signup without email or throw an error.
      // For now, we proceed with signup but log the email sending failure.
    }

    await logAnalyticsEvent({
      eventType: 'user_signup',
      userId: createdData._id,
      meta: { email: userEmail, ip: req.ip },
      req
    })

    logger.info(`[SignUp][Success] New user: ${userEmail} (ID: ${createdData._id})`)
    res.status(201).json({
      success: true,
      message: "Signup successful. Please check your email for the verification code.",
      data: {
        _id: createdData._id,
        userName: createdData.userName,
        userEmail: createdData.userEmail,
        userRole: createdData.userRole // Send role on signup
      }
    })
  } catch (error) {
    logger.error(`[SignUp][Error] Email: ${req.body.userEmail} - ${error.message}`)
    const err = new Error("An unexpected error occurred during signup.")
    err.name = error.name || "USER SIGNUP FAILED"
    err.status = error.status || 500
    next(err)
  }
}

const userSignIn = async (req, res, next) => {
  try {
    const { userEmail, userPassword } = req.body
    const userExisted = await userModel.findOne({ userEmail })

    if (!userExisted) {
       logger.warn(`[SignIn][Fail] Email not found: ${userEmail} from IP: ${req.ip}`);
       const err = new Error('Invalid email or password');
       err.name = 'AUTH_FAILED';
       err.status = 401;
       return next(err);
    }

    const isPasswordCorrect = await bcrypt.compare(userPassword, userExisted.userPassword);

    if (!isPasswordCorrect) {
      logger.warn(`[SignIn][Fail] Invalid password for email: ${userEmail} from IP: ${req.ip}`);
       try {
        await logAnalyticsEvent({
          eventType: 'user_signin_failed',
          meta: { email: userEmail, ip: req.ip }
        })
      } catch (logErr) {
        logger.warn(`[Analytics][Log][Fail] user_signin_failed: ${logErr.message}`)
      }
      const err = new Error('Invalid email or password');
      err.name = 'AUTH_FAILED';
      err.status = 401;
      return next(err);
    }

    const authToken = await createToken({ userId: userExisted._id, userRole: userExisted.userRole })
    await clearAuthCookie(res)
    await createAuthCookie(res, authToken)


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
        userRole: userExisted.userRole,
        isVerified: userExisted.verified
      }
    })
  } catch (error) {
    logger.warn(`[SignIn][Error] Email: ${req.body.userEmail} - ${error.message}`)
    const err = new Error("An unexpected error occurred during signin.")
    err.name = error.name || "USER SIGNIN FAILED"
    err.status = error.status || 500
    next(err)
  }
}

// Renamed and modified from verifyEmail to verifyEmailCode
const verifyEmail = async (req, res, next) => {
  try {
    const { userEmail, verificationCode } = req.body;

    // Validate the input code format (e.g., 6 digits)
    if (!verificationCode || !/^\d{6}$/.test(verificationCode)) { // Changed to validate 6 digits
      const err = new Error('Invalid verification code format. Must be a 6-digit number.');
      err.status = 400;
      return next(err);
    }

    const user = await userModel.findOne({ userEmail });

    if (!user) {
      logger.warn(`[MailVerification][NotFound] User not found for email: ${userEmail}`);
      const err = new Error('Invalid email or verification code.');
      err.status = 400;
      return next(err);
    }

    if (user.verified) {
      logger.info(`[MailVerification][AlreadyVerified] User already verified: ${user.userEmail}`);
      return res.status(200).json({ success: true, message: 'This email address has already been verified.' });
    }

    // Hash the provided code to compare with the stored hashed code
    const hashedCode = crypto.createHash('sha256').update(verificationCode).digest('hex');

    // Check if the provided code matches and is not expired
    if (user.verificationCode !== hashedCode || user.verificationCodeExpires < Date.now()) {
      logger.warn(`[MailVerification][InvalidCodeOrExpired] Invalid or expired code for email: ${userEmail}`);
      const err = new Error('Verification code is invalid or has expired.');
      err.status = 400;
      return next(err);
    }

    user.verified = true;
    user.verificationCode = undefined; // Clear the code after successful verification
    user.verificationCodeExpires = undefined; // Clear the expiration
    await user.save();

    const authToken = await createToken({ userId: user._id, userRole: user.userRole })
    await createAuthCookie(res, authToken)

    logger.info(`[MailVerification][Success] User verified: ${user.userEmail}, ID: ${user._id}, IP: ${req.ip}`);
    res.status(200).json({ success: true, message: 'Email successfully verified. You can now log in.' });
  } catch (error) {
    logger.error(`[MailVerification][Error] Email: ${req.body.userEmail}, Reason: ${error.message}`);
    const err = new Error('An error occurred during email verification.');
    err.status = 500;
    next(err);
  }
};

const resendVerificationLink = async (req, res, next) => {
  try {
    const { userEmail } = req.body;
    const user = await userModel.findOne({ userEmail });

    if (!user) {
      logger.warn(`[ResendVerification][NotFound] Attempt for non-existent email: ${userEmail}`);
      // Respond vaguely to prevent email enumeration
      return res.status(200).json({ success: true, message: 'If an account with that email address exists, a new verification code has been sent.' });
    }

    if (user.verified) {
      logger.warn(`[ResendVerification][AlreadyVerified] Attempt for already verified email: ${userEmail}`);
      return res.status(200).json({ success: true, message: 'This account has already been verified.' });
    }

    // Asynchronously send a new verification email with a code
    const newVerificationCode = await sendVerificationMail(user._id, user.userName, user.userEmail);

    if (newVerificationCode) {
      // Hash the new code and update the user document
      user.verificationCode = crypto.createHash('sha256').update(newVerificationCode).digest('hex');
      user.verificationCodeExpires = Date.now() + 15 * 60 * 1000; // New code valid for 15 minutes
      await user.save();
      logger.info(`[ResendVerification][Success] New verification code sent to: ${userEmail}`);
      res.status(200).json({ success: true, message: 'A new verification code has been sent to your email address.' });
    } else {
      logger.error(`[ResendVerification][EmailError] Failed to send new verification email for user: ${userEmail}`);
      // Respond with a success message even if email sending fails to avoid leaking info
      res.status(500).json({ success: false, message: 'Failed to send new verification code. Please try again later.' });
    }
  } catch (error) {
    logger.error(`[ResendVerification][Error] ${error.message}`);
    next(new Error('Error resending verification code.'));
  }
};

const authStatus = async (req, res, next) => {
  try {
    const { userId } = req.user
    const userData = await userModel.findById({ _id: userId }).select('-userPassword -resetPasswordToken -resetPasswordExpires');
    if (!userData) {
      const err = new Error('User not found')
      err.name = 'USER NOT FOUND'
      err.status = 404
      return next(err)
    }

    logger.info(`[AuthStatus][Checked] User: ${userId}`)
    res.status(200).json({
      success: true,
      data: {
        _id: userData._id,
        userName: userData.userName,
        userEmail: userData.userEmail,
        userRole: userData.userRole,
        isVerified: userData.verified
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

    await logAnalyticsEvent({
      eventType: 'user_signout',
      userId: req.user ? req.user.userId : null,
      meta: { ip: req.ip }
    })

    logger.info(`[SignOut][Success] User: ${req.user ? req.user.userId : 'unknown'} from IP: ${req.ip}`)
    res.status(200).json({ success: true, message: "Signed out successfully" })
  } catch (error) {
    logger.warn(`[SignOut][Error] ${error.message}`)
    const err = new Error(error.message)
    err.name = error.name || "SIGNOUT_FAILED"
    err.status = error.status || 500
    next(err)
  }
}

const forgotPassword = async (req, res, next) => {
    try {
        const { userEmail } = req.body;
        const user = await userModel.findOne({ userEmail });

        if (!user) {
            logger.warn(`[ForgotPassword][NotFound] Attempt for non-existent email: ${userEmail}`);
            return res.status(200).json({ success: true, message: 'If an account with that email exists, a password reset link has been sent.' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpires = Date.now() + 3600000; // Token is valid for 1 hour

        await user.save();

        sendPasswordResetEmail(user.userEmail, user.userName, resetToken);

        res.status(200).json({ success: true, message: 'If an account with that email exists, a password reset link has been sent.' });

    } catch (error) {
        logger.error(`[ForgotPassword][Error] ${error.message}`);
        next(new Error('Error processing password reset request.'));
    }
};

const resetPassword = async (req, res, next) => {
    try {
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        const user = await userModel.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            const err = new Error('Password reset token is invalid or has expired.');
            err.status = 400;
            return next(err);
        }

        user.userPassword = await bcrypt.hash(req.body.userPassword, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        const authToken = await createToken({ userId: user._id, userRole: user.userRole });
        await createAuthCookie(res, authToken);

        logger.info(`[ResetPassword][Success] User password reset for: ${user.userEmail}`);
        res.status(200).json({ success: true, message: 'Password has been successfully reset.' });

    } catch (error) {
        logger.error(`[ResetPassword][Error] ${error.message}`);
        next(new Error('Failed to reset password.'));
    }
};

export {
    userSignIn,
    userSignUp,
    userSignout,
    authStatus,
    forgotPassword,
    resetPassword,
    verifyEmail, // Export the new function
    resendVerificationLink
}
