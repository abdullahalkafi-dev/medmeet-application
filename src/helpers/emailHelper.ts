import axios from 'axios';
import config from '../config';
import { errorLogger, logger } from '../shared/logger';
import { ISendEmail } from '../types/email';

const sendEmail = async (values: ISendEmail) => {
  try {
    const response = await axios.post(
      'https://api.resend.com/emails',
      {
        from: config.resend.from_email,
        to: values.to,
        subject: values.subject,
        html: values.html,
      },
      {
        headers: {
          'Authorization': `Bearer ${config.resend.api_key}`,
          'Content-Type': 'application/json',
        },
      }
    );

    logger.info('Mail sent successfully via Resend', response.data);
    return response.data;
  } catch (error) {
    errorLogger.error('Email sending failed via Resend', error);
    throw error;
  }
};

export const emailHelper = {
  sendEmail,
};
