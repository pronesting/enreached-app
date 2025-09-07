# Paddle Integration Setup Guide

## Current Status: Test Mode ✅

Your app is currently configured to use a **test checkout page** instead of real Paddle checkout. This allows you to test the complete flow without setting up Paddle products.

## How It Works Now

1. User fills out the form and uploads CSV
2. Clicks "Proceed to Checkout" 
3. Redirects to `/test-checkout` page with order details
4. User can test payment flow (simulated)
5. Redirects to success/failure pages

## To Enable Real Paddle Checkout

### Step 1: Create a Product in Paddle Dashboard

1. Go to [Paddle Dashboard](https://vendors.paddle.com/)
2. Navigate to **Catalog** → **Products**
3. Click **Create Product**
4. Set up a product for "Data Processing":
   - Name: "Data Processing Service"
   - Description: "Process your data files"
   - Price: $0.25 per record (or your preferred pricing)

### Step 2: Get Product/Price ID

1. After creating the product, note the **Price ID** (starts with `pri_`)
2. Update the checkout data in `src/components/CheckoutButton.tsx`

### Step 3: Update Checkout Implementation

Replace the test checkout redirect with real Paddle checkout:

```typescript
// In src/lib/paddle.ts - openCheckout method
const checkoutData = {
  items: [
    {
      priceId: 'pri_your_price_id_here', // Replace with actual price ID
      quantity: invoiceData.recordCount,
    }
  ],
  customer: {
    email: invoiceData.userDetails.email,
    name: `${invoiceData.userDetails.firstName} ${invoiceData.userDetails.lastName}`,
  },
  customData: {
    orderId: `order_${Date.now()}`,
    dataType: invoiceData.dataType,
    recordCount: invoiceData.recordCount,
    listName: invoiceData.userDetails.listName,
  },
  successUrl: `${window.location.origin}/success`,
  closeUrl: `${window.location.origin}/failed`,
  settings: {
    theme: 'light',
    displayMode: 'overlay',
    allowLogout: true,
  },
};

// Use real Paddle checkout
window.Paddle.Checkout.open(checkoutData);
```

### Step 4: Domain Approval

1. In Paddle Dashboard, go to **Settings** → **Checkout**
2. Add your domain to **Approved Domains**
3. For development: `http://localhost:3000`
4. For production: your actual domain

### Step 5: Environment Variables

Create `.env.local`:
```
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=test_your_token_here
NEXT_PUBLIC_PADDLE_ENVIRONMENT=sandbox
```

## Testing

### Current Test Mode
- ✅ Complete user flow works
- ✅ Order data is passed correctly
- ✅ Success/failure redirects work
- ✅ No Paddle setup required

### Real Paddle Mode (when ready)
- ✅ Secure payment processing
- ✅ Real payment methods
- ✅ Webhook support
- ✅ Transaction tracking

## Next Steps

1. **Test the current flow** - Make sure everything works with test checkout
2. **Set up Paddle product** - When ready for real payments
3. **Update checkout code** - Switch to real Paddle integration
4. **Test with real payments** - Use Paddle's test payment methods

## Support

- [Paddle Documentation](https://developer.paddle.com/)
- [Paddle Support](https://paddle.com/support/)
- [Paddle Community](https://community.paddle.com/)


