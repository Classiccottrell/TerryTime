const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

// Use JSON parser for all non-webhook routes
app.use((req, res, next) => {
  if (req.originalUrl === '/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.use(cors());

// Serve the static frontend
app.use(express.static(path.join(__dirname, '../client')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Create Stripe checkout session
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { items, orderType } = req.body;
    
    // In a real app, calculate total securely here rather than trusting client
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100, // Stripe uses cents
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/index.html`,
      metadata: {
        orderType: orderType // 'physical' or 'digital'
      }
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Stripe webhook handler
app.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // Fulfill the purchase...
    console.log('Payment successful for session:', session.id);
    
    if (session.metadata.orderType === 'physical') {
      // TODO: Implement Printful API triggered fulfillment
      console.log('Would trigger Printful API for physical fulfillment');
      // triggerPrintfulFulfillment(session);
    } else if (session.metadata.orderType === 'digital') {
      // TODO: Implement automated email delivery of digital asset
      console.log('Would trigger automated delivery of digital asset');
      // deliverDigitalAssets(session.customer_details.email);
    }
  }

  res.send();
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
