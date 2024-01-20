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

export async function sendEmail({
  email,
  link,
  user,
}: {
  email: string;
  link: string;
  user: string;
}) {
  await transporter.sendMail({
    from: process.env.GG_EMAIL,
    to: email,
    subject: 'Password reset - Velmar',
    html: createMessage(link, user),
  });
}

const createMessage = (link: string, user: string) => {
  return `<p>
    Hi ${user}!
    <br/><br/>
    We've received a request to reset your password on Velmar. Click the link below to create a new password:
    <br/><br/>
    ${link}
    <br/><br/>
    If you didn't request this, please ignore this message. Your current password will remain valid.
    <br/><br/>
    Thanks!<br/><br/>
    Diego Nacimiento<br/><br/>
    Velmar
  </p>`;
};
