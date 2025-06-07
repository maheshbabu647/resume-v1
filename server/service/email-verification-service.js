import mailTransporter from "../config/email-config.js";
import { createToken } from "../util/jwt.js";
import logger from "../config/logger.js";

// [SECURITY] Helper to escape HTML in user-provided names (defend against HTML injection)
const escapeHTML = (str) =>
  String(str).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );

const sendVerificationMail = async (userId, userName, userEmail) => {
  try {
    const CLIENT_BASE_URL = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
    const token = await createToken({ userId });
    
    // This link should point to your FRONTEND route that will handle the verification
    const verificationLink = `${CLIENT_BASE_URL}/verify-email/${token}`;

    const safeUserName = escapeHTML(userName);

    const mailBody = `<h2>Dear ${safeUserName},</h2>
      <p>Thank you for registering with CareerForge. To complete your account setup, please verify your email address by clicking the link below:</p>
      <a href="${verificationLink}" style="text-decoration: none; font-size: 18px; padding: 10px 20px; background-color: #007bff; color: white; border-radius: 5px;">Verify Your Email</a>
      <p>If you did not request this verification, please ignore this email. This link will expire in 24 hours.</p>
      <p>Best regards,<br/>The CareerForge Team</p>`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'no-reply@careerforge.pro',
      to: userEmail,
      replyTo: process.env.SUPPORT_EMAIL || 'support@careerforge.pro',
      subject: 'CareerForge: Please Verify Your Email Address',
      html: mailBody,
    };

    if (/[^\w@.\-+]/.test(userEmail)) {
      throw new Error('Invalid characters in email address');
    }

    await mailTransporter.sendMail(mailOptions);

    logger.info(`[Email][Verification][Success] Sent to: ${userEmail}, userId: ${userId}`);
  } catch (error) {
    logger.error(`[Email][Verification][Error] userId: ${userId}, userEmail: ${userEmail}, Reason: ${error.message}`);
    // Do not re-throw here to avoid crashing the sign-up process if email fails
  }
};

export default sendVerificationMail;