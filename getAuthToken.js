// Run this to get a fresh refresh token
// node getAuthToken.js

require("dotenv").config();
const { google } = require("googleapis");
const express = require("express");
const app = express();

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// Generate auth URL
const scopes = ["https://mail.google.com/"];
const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: scopes,
});

console.log("\n🔗 Open this URL in your browser:");
console.log(authUrl);
console.log("\n📋 After authorization, you'll be redirected to a URL.");
console.log("Copy the code parameter from that URL and paste it below.\n");

// Listen for callback
app.get("/auth/callback", async (req, res) => {
  const code = req.query.code;
  
  if (!code) {
    return res.send("No authorization code received");
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log("\n✅ Successfully obtained tokens!");
    console.log("\nAdd these to your .env file:");
    console.log(`REFRESH_TOKEN=${tokens.refresh_token}`);
    console.log(`ACCESS_TOKEN=${tokens.access_token}`);
    
    res.send("✅ Tokens received! Check your console for the refresh token to add to .env");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error getting tokens:", err.message);
    res.send(`Error: ${err.message}`);
  }
});

app.listen(3001, () => {
  console.log("Waiting for callback on http://localhost:3001/auth/callback");
});
