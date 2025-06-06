import type { Handler } from '@netlify/functions';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface GiftCertificateData {
  recipientName: string;
  recipientEmail: string;
  senderName: string;
  amount: number;
  message?: string;
  code: string;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  try {
    const data = JSON.parse(event.body || '') as GiftCertificateData;

    // TODO: Implement email template
    const emailHtml = `
      <h1>Your Gift Certificate from ${data.senderName}</h1>
      <p>Dear ${data.recipientName},</p>
      <p>You've received a gift certificate worth $${data.amount} for Transcend Body Therapy.</p>
      <p>Gift Code: ${data.code}</p>
      ${data.message ? `<p>Message: ${data.message}</p>` : ''}
      <p>Book your session at transcendbodytherapy.com</p>
    `;

    await resend.emails.send({
      from: 'Transcend Body Therapy <noreply@transcendbodytherapy.com>',
      to: data.recipientEmail,
      subject: 'Your Transcend Body Therapy Gift Certificate',
      html: emailHtml,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Gift certificate email sent successfully' }),
    };
  } catch (error) {
    console.error('Error sending gift certificate email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to send gift certificate email',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
}; 