# Vercel + Paddle Integration Setup

## Current Configuration
Your app is configured to work specifically with **Vercel deployment** for Paddle sandbox testing.

## Vercel Domain Configuration

### 1. Get Your Vercel Domain
Your app is deployed at: `https://enreached-app.vercel.app`

### 2. Add Domain to Paddle Dashboard

1. **Go to [Paddle Dashboard](https://vendors.paddle.com/)**
2. **Navigate to Settings → Checkout**
3. **Add these domains to "Approved Domains":**
   - `https://enreached-app.vercel.app` (main domain)
   - `https://enreached-app-git-main.vercel.app` (if using preview deployments)
   - `https://enreached-app-*.vercel.app` (for all preview branches)

### 3. Set Default Checkout URL
In the same Checkout Settings page:
- **Default Payment Link**: `https://enreached-app.vercel.app/success`

## Vercel-Specific Features

### Dynamic Domain Detection
The app automatically detects the current Vercel domain and uses it for:
- Success/close URLs
- Custom data tracking
- Debug logging

### Enhanced Debugging
- Debug mode is enabled for Vercel deployments
- All Paddle events are logged with Vercel context
- Domain information is included in custom data

### Error Handling
- Specific error messages for Vercel deployment issues
- Direct links to Paddle dashboard for domain approval
- Clear instructions for fixing domain approval issues

## Testing on Vercel

### 1. Deploy to Vercel
```bash
# Deploy your app
vercel --prod
```

### 2. Test the Integration
1. Visit your Vercel URL: `https://enreached-app.vercel.app`
2. Fill out the form and upload a CSV
3. Click "Proceed to Checkout"
4. The app will use the Vercel domain for Paddle checkout

### 3. Check Console Logs
Look for these Vercel-specific logs:
```
Current domain for Paddle: https://enreached-app.vercel.app
Paddle initialized successfully in sandbox mode for Vercel
Opening Paddle checkout with proper API for Vercel...
Using Vercel domain for checkout: https://enreached-app.vercel.app
```

## Troubleshooting

### If you get a 400 error:
1. **Check domain approval** - Make sure your Vercel domain is in Paddle's approved domains
2. **Check console logs** - Look for the exact domain being used
3. **Verify product ID** - Ensure `pro_01k4gbm9hqgtbz0462wxnjpdbk` is active in sandbox

### If checkout doesn't open:
1. **Check browser console** for JavaScript errors
2. **Verify Paddle script loading** - Look for "Paddle initialized successfully" message
3. **Check network tab** for failed requests

## Production Considerations

When ready for production:
1. **Get live Paddle token** (starts with `live_`)
2. **Update environment** from sandbox to live
3. **Add production domain** to approved domains
4. **Set up webhooks** for payment processing

## Support

- [Paddle Documentation](https://developer.paddle.com/)
- [Vercel Documentation](https://vercel.com/docs)
- [Paddle Domain Approval Guide](https://developer.paddle.com/getting-started/sandbox#domain-approval)
