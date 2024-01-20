import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GG_EMAIL,
    pass: process.env.GG_KEY,
  },
});

export async function sendEmail(email: string, link: string) {
  await transporter.sendMail({
    from: process.env.GG_EMAIL,
    to: email,
    subject: 'Forgot password',
    html: `<p>Enter the following link to reset your password: ${link}</p>`,
  });
}
