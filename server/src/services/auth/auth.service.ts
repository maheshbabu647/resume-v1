import bcrypt from 'bcryptjs'
import { OAuth2Client } from 'google-auth-library'
import { User, type IUser } from '../../models/User.model'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../lib/jwt'
import { AppError } from '../../lib/AppError'
import { env } from '../../config/env'
import { redis } from '../../config/redis'
import { sendOtpEmail } from '../mailer.service'
import type { AuthResult, SafeUser } from '../../types/auth.types'
import type { RegisterBody, LoginBody, VerifyEmailBody, ResendOtpBody } from '../../schemas/auth.schema'

const oauthClient = new OAuth2Client(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET, env.GOOGLE_CALLBACK_URL)

const toSafeUser = (user: IUser): SafeUser => ({
  _id: user._id.toString(), name: user.name, email: user.email,
  avatarUrl: user.avatarUrl, plan: user.plan, resumeCount: user.resumeCount,
  referralCode: user.referralCode, createdAt: user.createdAt,
  isEmailVerified: user.isEmailVerified,
})

const buildTokens = (user: IUser) => ({
  accessToken:  signAccessToken({ _id: user._id.toString(), name: user.name, email: user.email, plan: user.plan }),
  refreshToken: signRefreshToken(user._id.toString()),
})

const generateOtp = (): string => Math.floor(100000 + Math.random() * 900000).toString()
const generateReferralCode = (): string => Math.random().toString(36).substring(2, 10).toUpperCase()

export const register = async (body: RegisterBody): Promise<{ user: SafeUser; message: string }> => {
  if (await User.findOne({ email: body.email }).lean()) throw new AppError('AUTH_EMAIL_EXISTS', 400, 'Email already registered.')
  
  let referredBy: string | undefined
  if (body.referralCode) {
    const referrer = await User.findOne({ referralCode: body.referralCode }).select('_id').lean()
    if (referrer) referredBy = referrer._id.toString()
  }

  const passwordHash = await bcrypt.hash(body.password, 12)
  const user = await User.create({ 
    name: body.name, 
    email: body.email, 
    passwordHash, 
    isEmailVerified: false, 
    referralCode: generateReferralCode(),
    referredBy
  })
  
  const otp = generateOtp()
  await redis.setex(`otp:${user.email}`, 600, otp) // 10 minutes TTL
  await sendOtpEmail(user.email, otp).catch(err => console.error('Failed to send OTP email:', err))

  return { user: toSafeUser(user), message: 'OTP sent to email' }
}

export const login = async (body: LoginBody): Promise<AuthResult> => {
  const user = await User.findOne({ email: body.email })
  if (!user || !user.passwordHash) throw new AppError('AUTH_CREDENTIALS_BAD', 401)
  if (!await bcrypt.compare(body.password, user.passwordHash)) throw new AppError('AUTH_CREDENTIALS_BAD', 401)
  
  if (!user.isEmailVerified) throw new AppError('AUTH_UNVERIFIED', 403, 'Email not verified')

  return { user: toSafeUser(user), ...buildTokens(user) }
}

export const verifyEmail = async (body: VerifyEmailBody): Promise<AuthResult> => {
  const { email, otp } = body
  const storedOtp = await redis.get(`otp:${email}`)
  if (!storedOtp || storedOtp !== otp) throw new AppError('AUTH_OTP_INVALID', 400, 'Invalid or expired OTP')

  const user = await User.findOneAndUpdate({ email }, { isEmailVerified: true }, { new: true })
  if (!user) throw new AppError('USER_NOT_FOUND', 404)

  await redis.del(`otp:${email}`)
  return { user: toSafeUser(user), ...buildTokens(user) }
}

export const resendOtp = async (body: ResendOtpBody): Promise<{ message: string }> => {
  const user = await User.findOne({ email: body.email })
  if (!user) throw new AppError('USER_NOT_FOUND', 404)
  if (user.isEmailVerified) throw new AppError('AUTH_ALREADY_VERIFIED', 400, 'Email already verified')

  const otp = generateOtp()
  await redis.setex(`otp:${user.email}`, 600, otp) // 10 minutes TTL
  await sendOtpEmail(user.email, otp).catch(err => console.error('Failed to send OTP email:', err))

  return { message: 'OTP resent to email' }
}

export const getGoogleAuthUrl = (state?: string): string =>
  oauthClient.generateAuthUrl({ access_type: 'offline', scope: ['openid', 'email', 'profile'], prompt: 'consent', ...(state ? { state } : {}) })

export const handleGoogleCallback = async (code: string, state?: string): Promise<AuthResult> => {
  const { tokens } = await oauthClient.getToken(code)
  oauthClient.setCredentials(tokens)
  const ticket  = await oauthClient.verifyIdToken({ idToken: tokens.id_token!, audience: env.GOOGLE_CLIENT_ID })
  const payload = ticket.getPayload()
  if (!payload?.email) throw new AppError('AUTH_TOKEN_INVALID', 401, 'Google login failed.')

  let user = await User.findOne({ googleId: payload.sub })
  if (!user) {
    let referredBy: string | undefined
    if (state) {
      const referrer = await User.findOne({ referralCode: state }).select('_id').lean()
      if (referrer) referredBy = referrer._id.toString()
    }

    user = await User.findOneAndUpdate(
      { email: payload.email },
      { 
        $setOnInsert: { resumeCount: 0, plan: 'seeker', referralCode: generateReferralCode(), referredBy }, 
        $set: { googleId: payload.sub, name: payload.name ?? 'User', avatarUrl: payload.picture, isEmailVerified: true } 
      },
      { new: true, upsert: true }
    )
  }
  return { user: toSafeUser(user!), ...buildTokens(user!) }
}

export const refreshAccessToken = async (refreshToken: string): Promise<string> => {
  let payload: { _id: string }
  try { payload = verifyRefreshToken(refreshToken) }
  catch { throw new AppError('AUTH_TOKEN_INVALID', 401, 'Invalid or expired refresh token.') }
  const user = await User.findById(payload._id).select('name email plan').lean()
  if (!user) throw new AppError('AUTH_TOKEN_INVALID', 401)
  return signAccessToken({ _id: payload._id, name: user.name, email: user.email, plan: user.plan })
}

export const getMe = async (userId: string): Promise<SafeUser> => {
  const user = await User.findById(userId)
  if (!user) throw new AppError('USER_NOT_FOUND', 404)
  return toSafeUser(user)
}
