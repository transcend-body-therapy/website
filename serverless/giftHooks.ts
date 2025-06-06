import type { Handler } from '@netlify/functions';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  try {
    const sig = event.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig || !webhookSecret) {
      throw new Error('Missing Stripe webhook signature or secret');
    }

    const stripeEvent = stripe.webhooks.constructEvent(
      event.body || '',
      sig,
      webhookSecret
    );

    // Handle different event types
    switch (stripeEvent.type) {
      case 'payment_intent.succeeded':
        // TODO: Handle successful payment
        console.log('Payment succeeded:', stripeEvent.data.object);
        break;

      case 'checkout.session.completed':
        // TODO: Handle completed checkout session
        console.log('Checkout completed:', stripeEvent.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (error) {
    console.error('Webhook error:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Webhook error',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
}; 