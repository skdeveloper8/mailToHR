// gmail.js
const nodemailer = require("nodemailer");

async function getGmailTransport() {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  return transporter;
}

module.exports = { getGmailTransport };
