// index.js
require("dotenv").config();
const express = require("express");
const { getGmailTransport } = require("./gmail");

const app = express();
app.use(express.json());

app.post("/send-mails", async (req, res) => {
  const { emails, subject, text } = req.body;

  if (!emails || !Array.isArray(emails)) {
    return res.status(400).json({ error: "emails must be an array" });
  }

  const transporter = await getGmailTransport();
  let sent = 0;
  let failed = 0;

  // helper sleep function
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  for (let i = 0; i < emails.length; i++) {
    const email = emails[i];
    try {
      await transporter.sendMail({
        from: `"Sangeet Kumar" <${process.env.GMAIL_USER}>`,
        to: email,
        subject,
        text,
        attachments: [
          {
            filename: "Sangeet.pdf",
            path: "./Sangeet.pdf",
          },
        ],
      });

      sent++;
      console.log(`✔ Email sent to ${email}`);
    } catch (err) {
      failed++;
      console.error(`✖ Failed for ${email}:`, err.message);
    }

    // wait 30 seconds between sends, but skip waiting after the last email
    if (i < emails.length - 1) {
      console.log(`Waiting 30s before sending next email...`);
      await sleep(30 * 1000);
    }
  }

  res.json({
    message: "Email sending completed",
    total: emails.length,
    sent,
    failed,
  });
});

app.listen(3000, () => console.log("Server running on port 3000"));
