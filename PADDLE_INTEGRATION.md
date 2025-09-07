# Paddle Payment Integration

This app now includes **real Paddle.js integration** with your sandbox product for secure payment processing.

## Current Configuration

- **Mode**: Real Paddle Checkout (sandbox)
- **Client Token**: `test_ebdda6dcc37ac553c3e8bc3683d`
- **Product ID**: `pro_01k4gbm9hqgtbz0462wxnjpdbk`
- **Environment**: Sandbox
- **Debug Mode**: Enabled in development

## How It Works Now

1. **Initialization**: Paddle.js is loaded globally via the layout component
2. **Real Checkout Flow**: When user clicks "Proceed to Checkout", the app:
   - Converts `InvoiceData` to Paddle's checkout format
   - Opens Paddle's secure checkout overlay with your product
   - User completes payment through Paddle's interface
   - Handles success/failure redirects via Paddle events

## Data Flow

The integration converts your existing `InvoiceData` structure to Paddle's format:

```typescript
// Your InvoiceData
{
  userDetails: { firstName, lastName, email, phone, listName },
  dataType: 'emails' | 'phones',
  recordCount: number,
  pricePerRecord: number,
  totalAmount: number
}

// Converts to Paddle format
{
  items: [{ quantity: recordCount, customData: {...} }],
  customer: { email, name },
  customData: { orderId, dataType, recordCount, listName },
  successUrl: '/success',
  closeUrl: '/failed'
}
```

## Features

- ✅ Sandbox environment for testing
- ✅ Secure payment processing
- ✅ Error handling and loading states
- ✅ Custom data tracking
- ✅ Success/failure redirects
- ✅ Responsive design

## Testing

To test the integration:
1. Fill out the form with test data
2. Upload a CSV file
3. Click "Proceed to Checkout"
4. Use Paddle's test payment methods

## Production Setup

For production, you'll need to:
1. Get a live Paddle client token (starts with `live_`)
2. Update the token in `src/lib/paddle.ts`
3. Change environment to `live`
4. Set up webhooks for payment processing
