// Stripe Checkout Logic

const API_URL = 'http://localhost:4242'; // Address of the generic Node backend

async function startCheckout(productId, orderType, priceInDollars) {
  try {
    // Basic verification the button was clicked
    console.log(`Starting checkout for ${productId} - ${orderType} - $${priceInDollars}`);
    
    // In production, you would retrieve the publishable key from backend or env
    // and initialize stripe.js here. 
    // const stripe = Stripe('pk_test_...');

    const response = await fetch(`${API_URL}/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          {
            id: productId,
            name: productId === 'pack1' ? '"See It Twice" Physical Pack' : 'Premium Sticker Pack',
            price: priceInDollars,
            quantity: 1
          }
        ],
        orderType: orderType // Lets the backend know how to fulfill this
      }),
    });

    if (!response.ok) {
      const errBytes = await response.text();
      throw new Error(`Server returned ${response.status}: ${errBytes}`);
    }

    const session = await response.json();
    
    // In production with stripe.js configured:
    // return stripe.redirectToCheckout({ sessionId: session.id });
    
    // For now we just redirect directly to the URL returned
    window.location.href = session.url;

  } catch (error) {
    console.error('Checkout error:', error);
    alert('Checkout failed to start. Ensure the backend server is running on port 4242.');
  }
}
