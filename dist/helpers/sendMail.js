"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const http_status_codes_1 = require("http-status-codes");
const config_1 = __importDefault(require("../config"));
const AppError_1 = __importDefault(require("../app/errors/AppError"));
function sendEmail(email, subject, text) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const transporter = nodemailer_1.default.createTransport({
                host: config_1.default.email.host,
                port: Number(config_1.default.email.port),
                secure: false,
                auth: {
                    user: config_1.default.email.user,
                    pass: config_1.default.email.pass,
                },
            });
            const info = yield transporter.sendMail({
                from: `"MED MEET" ${config_1.default.email.from}`, // Sender address
                to: email, // Recipient's email
                subject: `${subject}`, // Subject line
                text: text, // Plain text version
                html: `
      <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Promotional Email</title>
  <style>
    /* Reset styles */
    body, html {
      margin: 0;
      padding: 0;
      font-family: 'Helvetica Neue', Arial, sans-serif;
      background-color: #f8f8f8;
      color: #333;
    }

    /* Container styles */
    .container {
      max-width: 600px;
      margin: 30px auto;
      padding: 20px;
      border: none;
      border-radius: 12px;
      background: linear-gradient(145deg, #ffffff, #e6e6e6);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    }

    /* Header styles */
    .header {
      background-color: #5C450D; /* Gold-inspired header */
      padding: 30px;
      border-radius: 12px 12px 0 0;
      text-align: center;
      color: #ffffff;
    }
    .header h1 {
      font-size: 24px;
      margin: 0;
      font-weight: 700;
      letter-spacing: 1px;
    }

    /* Content styles */
    .content {
      padding: 20px 30px;
      text-align: left;
      font-size: 16px;
      line-height: 1.8;
      color: #4a4a4a;
    }

    /* Footer styles */
    .footer {
      background-color: #785B12; /* Darker gold footer */
      padding: 20px;
      border-radius: 0 0 12px 12px;
      text-align: center;
      color: #ffffff;
      font-size: 12px;
    }
    .footer p {
      margin: 0;
    }

    /* Responsive styles */
    @media (max-width: 600px) {
      .container {
        padding: 15px;
      }
      .content {
        padding: 15px;
        font-size: 14px;
      }
    }
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
     `,
            });
            return info;
        }
        catch (error) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Error sending email');
        }
    });
}
