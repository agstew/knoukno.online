const nodemailer = require('nodemailer');

const isConfigured = () => Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

let transporter;
const getTransporter = () => {
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT) || 465;
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });
  }
  return transporter;
};

const sendMail = ({ to, subject, text, html }) =>
  getTransporter().sendMail({ from: process.env.MAIL_FROM || process.env.SMTP_USER, to, subject, text, html });

module.exports = { isConfigured, sendMail };
