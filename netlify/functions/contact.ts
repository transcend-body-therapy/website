import type { Handler } from '@netlify/functions';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, message: 'Method not allowed' }),
    };
  }

  try {
    const data = JSON.parse(event.body || '') as ContactForm;
    console.log('Received form data:', data);
    
    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      console.log('Missing required fields:', { name: !!data.name, email: !!data.email, message: !!data.message });
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          success: false, 
          message: 'Name, email, and message are required' 
        }),
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      console.log('Invalid email format:', data.email);
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          success: false, 
          message: 'Invalid email format' 
        }),
      };
    }

    console.log('Attempting to send email via Resend...');
    // Send email via Resend
    const emailResult = await resend.emails.send({
      from: 'Transcend Body Therapy <onboarding@resend.dev>',
      to: 'amy@ibisadvisory.com',
      subject: `New Contact Form Submission from ${data.name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
        ${data.service ? `<p><strong>Service:</strong> ${data.service}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, '<br>')}</p>
      `,
    });
    console.log('Email sent successfully:', emailResult);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error('Error processing contact form:', error);
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Error processing request' 
      }),
    };
  }
}; 