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
    const SERVER_BASE_URL = process.env.SERVER_BASE_URL || 'http://localhost:4000';
    const token = await createToken({ userId });
    const verificationLink = `${SERVER_BASE_URL}/task-manager/api/v1/user/verify/${token}`;

    // [SECURITY] Sanitize userName before using in HTML!
    const safeUserName = escapeHTML(userName);

    const mailBody = `<h2>Dear ${safeUserName}</h2>
      <p>Thank you for registering with us.
      To complete your account setup, please verify your email address by clicking the link below:</P>
      <a href="${verificationLink}" style="text-decoration : none; font-size : 24px;">Verify Your Email</a>
      <p>If you did not request this verification, please ignore this email. This link will expire in 24hrs.
      If you have any questions, feel free to reach out to our support team.</P>
      <h3>Best regards</h3>`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'no-reply@careerforge.pro', // [SECURITY] Use environment variable!
      to: userEmail,
      replyTo: process.env.SUPPORT_EMAIL || 'support@careerforge.pro', // [PROFESSIONAL] Set reply-to
      subject: 'Email Verification',
      html: mailBody,
    };

    // [SECURITY] Defend against email header injection (very rare with nodemailer, but safe!)
    if (/[^\w@.\-+]/.test(userEmail)) {
      throw new Error('Invalid characters in email address');
    }

    const response = await mailTransporter.sendMail(mailOptions);

    logger.info(`[Email][Verification][Success] Sent to: ${userEmail}, userId: ${userId}`);
    return response;
  } catch (error) {
    // [SECURITY] Never leak sensitive info in logs
    logger.error(`[Email][Verification][Error] userId: ${userId}, userEmail: ${userEmail}, Reason: ${error.message}`);
    const err = new Error('VERIFICATION MAIL NOT SENT');
    err.name = 'VERIFICATION_MAIL_NOT_SENT';
    err.message = error.message;
    throw err;
  }
};

export default sendVerificationMail;
