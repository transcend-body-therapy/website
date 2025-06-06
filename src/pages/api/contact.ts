import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    
    // TODO: Implement email sending logic with Resend
    console.log('Contact form submission:', data);

    return new Response(JSON.stringify({ message: 'Message sent successfully' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return new Response(JSON.stringify({ message: 'Error processing request' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}; 