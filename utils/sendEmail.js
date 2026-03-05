// eslint-disable-next-line import/no-extraneous-dependencies
import nodemailer from "nodemailer";

// eslint-disable-next-line import/prefer-default-export
export const sendEmail = async (options) => {
  // 1) Create a transporter like Gmail, SendGrid, Mailgun
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Send the email
  await transporter.sendMail(mailOptions);
};
