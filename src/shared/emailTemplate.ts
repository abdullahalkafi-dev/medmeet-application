import { ICreateAccount, IResetPassword } from "../types/emailTamplate";

const createAccount = (values: ICreateAccount) => {
  const data = {
    to: values.email,
    subject: "Verify your account",
    html: `<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 50px; padding: 20px; color: #555;">
    <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <img src="https://res.cloudinary.com/dqumshlcs/image/upload/v1739507391/medmeet_yhhou2.png" alt="Logo" style="display: block; margin: 0 auto 20px; width:150px" />
          <h2 style="color: #BB6D42; font-size: 24px; margin-bottom: 20px;">Hi ${values.name},</h2>
        <div style="text-align: center;">
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Your single use code is:</p>
            <div style="background-color: #BB6D42; width: 100px; padding: 10px; text-align: center; border-radius: 8px; color: #fff; font-size: 25px; letter-spacing: 2px; margin: 20px auto;">${values.otp}</div>
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">This code is valid for 3 minutes.</p>
              <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;text-align:left">If you didn't request this code, you can safely ignore this email. Someone else might have typed your email address by mistake.</p>
        </div>
    </div>
</body>`,
  };
  return data;
};

const resetPassword = (values: IResetPassword) => {
  const data = {
    to: values.email,
    subject: "Reset your password",
    html: `<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; color: #333;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="min-width: 100%; background-color: #f4f4f4;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                    <tr>
                        <td align="center" style="padding: 40px 40px 30px;">
                            <img src="https://res.cloudinary.com/dqumshlcs/image/upload/v1739507391/medmeet_yhhou2.png" alt="Logo" style="display: block; width: 180px; max-width: 100%; height: auto;" />
                        </td>
                    </tr> 
                    <tr>
                        <td style="padding: 0 40px;">
                            <h1 style="color: #333; font-size: 24px; text-align: center; margin: 0 0 20px;">Your Single Use Code</h1>
                            <p style="color: #555; font-size: 16px; line-height: 1.5; margin: 0 0 20px; text-align: center;">Please use the following code to complete your request:</p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 0 40px;">
                            <table cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="background-color: #BB6D42; padding: 15px 30px; border-radius: 8px;">
                                        <span style="color: #ffffff; font-size: 28px; font-weight: bold; letter-spacing: 4px;">${values.otp}</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px 40px 0;">
                            <p style="color: #555; font-size: 16px; line-height: 1.5; margin: 0 0 20px; text-align: center;">This code is valid for <strong>30 minutes</strong>.</p>
                            <p style="color: #555; font-size: 14px; line-height: 1.5; margin: 0 0 20px;">If you didn't request this code, you can safely ignore this email. Someone else might have typed your email address by mistake.</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 0 40px 40px;">
                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-top: 1px solid #e0e0e0;">
                                <tr>
                                    <td style="padding-top: 20px;">
                                        <p style="color: #888; font-size: 12px; line-height: 1.5; margin: 0; text-align: center;">This is an automated message, please do not reply to this email.</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>`,
  };
  return data;
};

export const emailTemplate = {
  createAccount,
  resetPassword,
};
