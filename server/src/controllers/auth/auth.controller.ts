import type { Request, Response, NextFunction } from 'express'
import * as authService from '../../services/auth/auth.service'
import { TOKEN } from '../../config/constants'
import { env }   from '../../config/env'

const p = (v: string | string[]): string => (Array.isArray(v) ? v[0] : v)

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, message } = await authService.register(req.body)
    res.status(201).json({ ok: true, data: { user, message } })
  } catch (err) { next(err) }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, accessToken, refreshToken } = await authService.login(req.body)
    res.cookie(TOKEN.REFRESH_COOKIE, refreshToken, TOKEN.COOKIE_OPTIONS)
    res.json({ ok: true, data: { user, accessToken } })
  } catch (err) { next(err) }
}

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, accessToken, refreshToken } = await authService.verifyEmail(req.body)
    res.cookie(TOKEN.REFRESH_COOKIE, refreshToken, TOKEN.COOKIE_OPTIONS)
    res.json({ ok: true, data: { user, accessToken } })
  } catch (err) { next(err) }
}

export const resendOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { message } = await authService.resendOtp(req.body)
    res.json({ ok: true, data: { message } })
  } catch (err) { next(err) }
}

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies[TOKEN.REFRESH_COOKIE]
    if (!token) return res.status(401).json({ ok: false, error: { code: 'AUTH_TOKEN_MISSING' } })
    const accessToken = await authService.refreshAccessToken(token)
    res.json({ ok: true, data: { accessToken } })
  } catch (err) { next(err) }
}

export const logout = (_req: Request, res: Response) => {
  res.clearCookie(TOKEN.REFRESH_COOKIE, { httpOnly: true, sameSite: 'lax' })
  res.status(204).send()
}

export const googleRedirect = (req: Request, res: Response) =>
  res.redirect(authService.getGoogleAuthUrl(p(req.query.ref as string)))

export const googleCallback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const code = p(req.query.code as string)
    const state = p(req.query.state as string)
    const { accessToken, refreshToken } = await authService.handleGoogleCallback(code, state)
    res.cookie(TOKEN.REFRESH_COOKIE, refreshToken, TOKEN.COOKIE_OPTIONS)
    res.redirect(`${env.CLIENT_URL}/auth/callback?${TOKEN.OAUTH_PARAM}=${accessToken}`)
  } catch (err) { next(err) }
}

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.getMe(req.user!._id)
    res.json({ ok: true, data: { user } })
  } catch (err) { next(err) }
}
