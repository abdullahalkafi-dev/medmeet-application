import { StatusCodes } from "http-status-codes";
import AppError from "../app/errors/AppError";
import axios from "axios";
import config from "../config";

export async function sendEmail(email: string, subject: string, text: string) {
  try {
    const html = `
      <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Promotional Email</title>
  <style>
    body, html { margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8f8f8; color: #333; }
    .container { max-width: 600px; margin: 30px auto; padding: 20px; border: none; border-radius: 12px; background: linear-gradient(145deg, #ffffff, #e6e6e6); box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1); }
    .header { background-color: #5C450D; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; color: #ffffff; }
    .header h1 { font-size: 24px; margin: 0; font-weight: 700; letter-spacing: 1px; }
    .content { padding: 20px 30px; text-align: left; font-size: 16px; line-height: 1.8; color: #4a4a4a; }
    .footer { background-color: #785B12; padding: 20px; border-radius: 0 0 12px 12px; text-align: center; color: #ffffff; font-size: 12px; }
    .footer p { margin: 0; }
    @media (max-width: 600px) { .container { padding: 15px; } .content { padding: 15px; font-size: 14px; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${subject}</h1>
    </div>
    <div class="content">
      <p>${text}</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} MED MEET. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `;

    const response = await axios.post(
      "https://api.resend.com/emails",
      {
        from: config.resend.from_email,
        to: email,
        subject,
        html,
      },
      {
        headers: {
          Authorization: `Bearer ${config.resend.api_key}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Error sending email via Resend",
    );
  }
}
