# PayPal Integration Setup

This guide will help you set up PayPal checkout integration for your Enreached app.

## Prerequisites

1. A PayPal Developer Account
2. Your app deployed on Vercel (or running locally)

## Setup Steps

### 1. Create PayPal App

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/)
2. Log in with your PayPal account
3. Click "Create App" in the "My Apps & Credentials" section
4. Choose "Default Application" or create a new app
5. Select "Sandbox" for testing (or "Live" for production)
6. Note down your **Client ID** and **Client Secret**

### 2. Configure Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# PayPal Configuration
PAYPAL_CLIENT_ID=your_sandbox_client_id
PAYPAL_CLIENT_SECRET=your_sandbox_client_secret
PAYPAL_MODE=sandbox

# Application URL (for production)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Install Dependencies

The PayPal SDK packages are already installed:
- `@paypal/checkout-server-sdk` - Server-side PayPal integration
- `@paypal/react-paypal-js` - Client-side PayPal components

### 4. Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Go to your app and upload a CSV file
3. Fill in the user details
4. Click "Approve Order" - this will now redirect to PayPal checkout
5. Use PayPal sandbox test accounts to complete the payment

### 5. PayPal Sandbox Testing

1. Go to [PayPal Sandbox](https://developer.paypal.com/developer/accounts/)
2. Create test buyer and seller accounts
3. Use these accounts to test the payment flow

### 6. Deploy to Vercel

1. Add your environment variables in Vercel dashboard:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add all the variables from `.env.local`

2. Update `NEXT_PUBLIC_BASE_URL` to your Vercel domain:
   ```env
   NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
   ```

3. Deploy your app

## How It Works

1. **Dynamic Order Creation**: When a user uploads CSV data and fills in details, the app creates a unique PayPal order with:
   - Dynamic pricing based on record count
   - User-specific information
   - Custom order ID for tracking

2. **PayPal Checkout**: Users are redirected to PayPal's secure checkout page

3. **Payment Capture**: After successful payment, the order is captured and confirmed

4. **Success Handling**: Users are redirected to a success page with order confirmation

## Features

- ✅ Dynamic pricing based on CSV record count
- ✅ Sandbox mode for testing
- ✅ Secure payment processing
- ✅ Order tracking and confirmation
- ✅ Error handling and user feedback
- ✅ Mobile-responsive design

## Production Considerations

1. **Switch to Live Mode**: Change `PAYPAL_MODE=live` and use live credentials
2. **Database Integration**: Store order data in a database for tracking
3. **Webhook Handling**: Implement PayPal webhooks for payment notifications
4. **Error Logging**: Add proper error logging and monitoring
5. **Security**: Ensure all sensitive data is properly secured

## Troubleshooting

- **PayPal buttons not loading**: Check your Client ID and ensure it's correct
- **Order creation fails**: Verify your Client Secret and API credentials
- **Payment not capturing**: Check your return URLs and ensure they're accessible
- **Sandbox issues**: Make sure you're using sandbox test accounts

## Support

For PayPal-specific issues, refer to:
- [PayPal Developer Documentation](https://developer.paypal.com/docs/)
- [PayPal Checkout Integration Guide](https://developer.paypal.com/docs/checkout/)
