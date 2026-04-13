import bcrypt from 'bcryptjs'
import { OAuth2Client } from 'google-auth-library'
import { User, type IUser } from '../../models/User.model'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../lib/jwt'
import { AppError } from '../../lib/AppError'
import { env } from '../../config/env'
import { redis } from '../../config/redis'
import { Guest } from '../../models/Guest.model'
import { JDHistory } from '../../models/JDHistory.model'
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

export const mergeGuest = async (userId: string, guestId?: string) => {
  if (!guestId) return
  const guest = await Guest.findOne({ guestId })
  if (!guest) return // No guest usage to merge

  const currentMonth = new Date().toISOString().slice(0, 7)
  const user = await User.findById(userId).select('usage').lean()
  if (!user) return

  const userMonth = user.usage?.month
  const isCurentMonth = userMonth === currentMonth

  // Merge the usage
  const updateObj: any = {}
  const features = ['pdfDownloads', 'jdScore', 'aiBullets', 'jdTailoring', 'coverLetter']
  
  if (isCurentMonth) {
    // If user's usage is already for this month, we INCREMENT
    const incObj: any = {}
    for (const f of features) {
      if (guest.usage && guest.usage[f as keyof typeof guest.usage]) {
        incObj[`usage.${f}`] = guest.usage[f as keyof typeof guest.usage]
      }
    }
    if (Object.keys(incObj).length > 0) {
      await User.findByIdAndUpdate(userId, { $inc: incObj })
    }
  } else {
    // If user's usage is old or non-existent, we INITIALIZE with guest counts and set current month
    const setObj: any = { 'usage.month': currentMonth }
    for (const f of features) {
      setObj[`usage.${f}`] = guest.usage?.[f as keyof typeof guest.usage] ?? 0
    }
    // Preserving bonus pools if they exist
    setObj['usage.bonusTailoring'] = user.usage?.bonusTailoring ?? 0
    setObj['usage.bonusPdfDownloads'] = user.usage?.bonusPdfDownloads ?? 0
    
    await User.findByIdAndUpdate(userId, { $set: setObj })
  }

  // Update JDHistory created during guest phase
  await JDHistory.updateMany({ guestId }, { $set: { userId } })
  
  await Guest.deleteOne({ guestId })
}

export const register = async (body: RegisterBody, guestId?: string): Promise<{ user: SafeUser; message: string }> => {
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

  await mergeGuest(user._id.toString(), guestId)

  return { user: toSafeUser(user), message: 'OTP sent to email' }
}

export const login = async (body: LoginBody, guestId?: string): Promise<AuthResult> => {
  const user = await User.findOne({ email: body.email })
  if (!user || !user.passwordHash) throw new AppError('AUTH_CREDENTIALS_BAD', 401)
  if (!await bcrypt.compare(body.password, user.passwordHash)) throw new AppError('AUTH_CREDENTIALS_BAD', 401)
  
  if (!user.isEmailVerified) throw new AppError('AUTH_UNVERIFIED', 403, 'Email not verified')

  await mergeGuest(user._id.toString(), guestId)

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
  
  // Extract guestId from state structure if passed as JSON. If it's a simple string, it's referral code.
  let guestId: string | undefined
  if (state && state.startsWith('{')) {
    try {
      const parsed = JSON.parse(state)
      guestId = parsed.guestId
    } catch {}
  }
  
  await mergeGuest(user!._id.toString(), guestId)

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
