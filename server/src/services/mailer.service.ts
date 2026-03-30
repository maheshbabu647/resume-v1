import nodemailer from 'nodemailer'
import { env } from '../config/env'

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST || 'smtp.ethereal.email',
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: (env.SMTP_USER && env.SMTP_PASS) ? {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  } : undefined,
})

if (env.NODE_ENV !== 'test') {
  transporter.verify().then(() => console.log('✅  SMTP Connected')).catch(err => console.warn('⚠️   SMTP Not Configured:', err.message))
}

export const sendOtpEmail = async (to: string, otp: string) => {
  const mailOptions = {
    from: env.SMTP_FROM || '"CareerForge" <noreply@careerforge.com>',
    to,
    subject: 'Your CareerForge Verification Code',
    text: `Your verification code is: ${otp}. It expires in 10 minutes.`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; color: #1a202c; padding: 20px;">
        <h2 style="color: #131b2e; margin-bottom: 24px;">Welcome to CareerForge!</h2>
        <p style="font-size: 16px; line-height: 1.5;">To complete your registration and secure your account, please enter the following verification code:</p>
        <div style="background: #f7f9fb; padding: 24px; text-align: center; border-radius: 8px; margin: 32px 0; border: 1px solid #e2e8f0;">
          <h1 style="margin: 0; color: #006c49; letter-spacing: 8px; font-size: 36px;">${otp}</h1>
        </div>
        <p style="font-size: 14px; color: #718096; line-height: 1.5;">This code expires in 10 minutes. If you didn't request this, you can safely ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
        <p style="font-size: 12px; color: #a0aec0; text-align: center;">© 2026 CareerForge. All rights reserved.</p>
      </div>
    `,
  }

  return transporter.sendMail(mailOptions)
}
