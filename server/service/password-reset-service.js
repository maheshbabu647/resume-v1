import mailTransporter from "../config/email-config.js";
import logger from "../config/logger.js";

// Helper to escape HTML in user-provided names to prevent injection
const escapeHTML = (str) =>
  String(str).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );

const sendPasswordResetEmail = async (userEmail, userName, token) => {
    try {
        const CLIENT_BASE_URL = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
        // This link should point to your FRONTEND route that will handle the reset
        const resetLink = `${CLIENT_BASE_URL}/reset-password/${token}`;

        const safeUserName = escapeHTML(userName);

        const mailBody = `<h2>Dear ${safeUserName},</h2>
        <p>You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>
        <p>Please click on the following link, or paste it into your browser to complete the process:</p>
        <a href="${resetLink}" style="text-decoration: none; font-size: 18px; padding: 10px 20px; background-color: #007bff; color: white; border-radius: 5px;">Reset Your Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        <p>Best regards,<br/>The CareerForge Team</p>`;

        const mailOptions = {
            from: process.env.EMAIL_FROM || 'no-reply@careerforge.pro',
            to: userEmail,
            subject: 'CareerForge: Password Reset Request',
            html: mailBody,
        };

        await mailTransporter.sendMail(mailOptions);
        logger.info(`[Email][PasswordReset][Success] Sent to: ${userEmail}`);

    } catch (error) {
        // Log the error but throw a generic one so the controller can handle it
        logger.error(`[Email][PasswordReset][Error] userEmail: ${userEmail}, Reason: ${error.message}`);
        throw new Error('PASSWORD_RESET_EMAIL_FAILED');
    }
}

export default sendPasswordResetEmail;