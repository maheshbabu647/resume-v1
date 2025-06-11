import mailTransporter from "../config/email-config.js";
import logger from "../config/logger.js";
import crypto from 'crypto'; // Import crypto for generating random bytes

// [SECURITY] Helper to escape HTML in user-provided names (defend against HTML injection)
const escapeHTML = (str) =>
  String(str).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );

/**
 * Sends a verification email with a 6-digit code to the user.
 * @param {string} userId - The ID of the user.
 * @param {string} userName - The name of the user.
 * @param {string} userEmail - The email address of the user.
 * @returns {string|null} The generated verification code if successful, otherwise null.
 */
const sendVerificationMail = async (userId, userName, userEmail) => {
  try {
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const safeUserName = escapeHTML(userName);

    const mailBody = `<h2>Dear ${safeUserName},</h2>
      <p>Thank you for registering with CareerForge. To complete your account setup, please verify your email address using the code below:</p>
      <div style="font-family: monospace; font-size: 24px; font-weight: bold; text-align: center; background-color: #f0f0f0; padding: 15px; border-radius: 8px; margin: 20px 0;">
        ${verificationCode}
      </div>
      <p>Please enter this code on the verification page within 15 minutes to activate your account.</p>
      <p>If you did not request this verification, please ignore this email. This code will expire shortly.</p>
      <p>Best regards,<br/>The CareerForge Team</p>`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'no-reply@careerforge.pro',
      to: userEmail,
      replyTo: process.env.SUPPORT_EMAIL || 'support@careerforge.pro',
      subject: 'CareerForge: Your Email Verification Code',
      html: mailBody,
    };

    if (/[^\w@.\-+]/.test(userEmail)) {
      throw new Error('Invalid characters in email address');
    }

    await mailTransporter.sendMail(mailOptions);

    logger.info(`[Email][Verification][Success] Sent code to: ${userEmail}, userId: ${userId}`);
    return verificationCode; // Return the raw code to be hashed and stored
  } catch (error) {
    logger.error(`[Email][Verification][Error] userId: ${userId}, userEmail: ${userEmail}, Reason: ${error.message}`);
    // Do not re-throw here to avoid crashing the sign-up process if email fails
    return null;
  }
};

export default sendVerificationMail;
