import fs from "fs";
import path from "path";

export function createGmailMime({ from, to, subject, text, attachments = [] }) {
  let boundary = "__MY_BOUNDARY__";

  let mime = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
  ];

  if (attachments.length > 0) {
    mime.push(`Content-Type: multipart/mixed; boundary="${boundary}"\n`);
    mime.push(`--${boundary}`);
    mime.push("Content-Type: text/plain; charset=UTF-8\n");
    mime.push(text + "\n");

    // Append attachments
    for (const file of attachments) {
      const fileData = fs.readFileSync(file);
      const filename = path.basename(file);

      mime.push(`--${boundary}`);
      mime.push(`Content-Type: application/octet-stream; name="${filename}"`);
      mime.push("Content-Transfer-Encoding: base64");
      mime.push(`Content-Disposition: attachment; filename="${filename}"\n`);
      mime.push(fileData.toString("base64") + "\n");
    }

    mime.push(`--${boundary}--`);
  } else {
    mime.push("Content-Type: text/plain; charset=UTF-8\n");
    mime.push(text);
  }

  const finalMime = mime.join("\n");

  // Gmail requires URL-safe Base64
  return Buffer.from(finalMime)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}
