import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const SMTP_EMAIL = process.env.SMTP_EMAIL
const SMTP_EMAIL_PASSWORD = process.env.SMTP_EMAIL_PASSWORD

const mailTransporter = nodemailer.createTransport({
    host : 'smtp.hostinger.com',
    port : 465,
    secure : true,
    auth : {
        user : SMTP_EMAIL,
        pass : SMTP_EMAIL_PASSWORD
    }
})

export default mailTransporter