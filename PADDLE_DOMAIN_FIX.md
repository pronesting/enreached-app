# Paddle Domain Approval Fix

## Current Issue
You're getting a 400 error when trying to open Paddle checkout. This is most likely due to domain approval issues.

## Error Details
```
sandbox-checkout-service.paddle.com/transaction-checkout:1  Failed to load resource: the server responded with a status of 400 ()
```

## Solution Steps

### 1. Add Domain to Paddle Dashboard

1. Go to [Paddle Dashboard](https://vendors.paddle.com/)
2. Navigate to **Settings** → **Checkout**
3. Find **Approved Domains** section
4. Add the following domains:
   - `http://localhost:3000` (for development)
   - `https://enreached-app.vercel.app` (for production)
   - `http://localhost:3001` (if using different port)

### 2. Set Default Checkout URL

1. In the same **Checkout Settings** page
2. Set **Default Payment Link** to: `https://enreached-app.vercel.app/success`

### 3. Verify Product Configuration

1. Go to **Catalog** → **Products**
2. Find your product with ID: `pro_01k4gbm9hqgtbz0462wxnjpdbk`
3. Ensure it's active and properly configured
4. Check that the price is set correctly

### 4. Test the Integration

After making these changes:

1. Clear your browser cache
2. Restart your development server
3. Try the checkout process again

## Fallback Solution

If you can't access the Paddle dashboard immediately, the app now includes a fallback mechanism:

- When Paddle checkout fails with a 400 error, it automatically redirects to the test checkout page
- This allows you to continue testing the complete flow
- The test checkout simulates the payment process

## Additional Debugging

If the issue persists, check:

1. **Network Tab**: Look for any CORS errors
2. **Console**: Check for additional error messages
3. **Paddle Dashboard**: Verify the client token is correct
4. **Environment**: Ensure you're using sandbox mode

## Production Considerations

For production deployment:

1. Use a live Paddle client token (starts with `live_`)
2. Add your production domain to approved domains
3. Set up webhooks for payment processing
4. Test with real payment methods

## Support

- [Paddle Documentation](https://developer.paddle.com/)
- [Paddle Support](https://paddle.com/support/)
- [Domain Approval Guide](https://developer.paddle.com/getting-started/sandbox#domain-approval)
