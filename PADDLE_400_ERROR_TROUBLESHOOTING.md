# 🚨 Paddle 400 Error - Complete Troubleshooting Guide

## Current Error
```
POST https://sandbox-checkout-service.paddle.com/transaction-checkout 400 (Bad Request)
```

## ✅ Step-by-Step Fix

### 1. **Domain Approval (Most Common Cause)**
1. Go to [Paddle Dashboard](https://vendors.paddle.com/)
2. Navigate to **Settings** → **Checkout**
3. Look for **"Website Approval"** or **"Approved Domains"**
4. Add: `https://enreached-app.vercel.app`
5. Set **Default Payment Link** to: `https://enreached-app.vercel.app/success`

### 2. **Check Product Configuration**
1. Go to **Catalog** → **Products**
2. Find product with ID: `pro_01k4gbm9hqgtbz0462wxnjpdbk`
3. Ensure it's **Active** and properly configured
4. Check that the price is set correctly

### 3. **Verify Client Token**
- Your current token: `test_ebdda6dcc37ac553c3e8bc3683d`
- Make sure it's a valid sandbox token (starts with `test_`)
- Ensure it matches your Paddle account

### 4. **Check Environment Settings**
1. In Paddle Dashboard, go to **Settings** → **General**
2. Ensure you're in **Sandbox** mode
3. Verify the environment matches your token

### 5. **Test with Minimal Data**
Try with a smaller quantity to see if it's a data issue:
- Change quantity from 749 to 1
- Test with minimal customer data

## 🔍 Alternative Solutions

### Option A: Use Different Product ID
If the current product ID doesn't work:
1. Create a new product in Paddle Dashboard
2. Get the new price ID
3. Update the code with the new ID

### Option B: Check API Limits
- Verify you haven't exceeded API rate limits
- Check if there are any account restrictions

### Option C: Contact Paddle Support
If none of the above work:
1. Go to [Paddle Support](https://paddle.com/support/)
2. Provide the error details and your domain
3. Ask for domain approval assistance

## 🧪 Testing Steps

### After Each Fix:
1. **Clear browser cache**
2. **Refresh the page**
3. **Try checkout again**
4. **Check console for new errors**

### Expected Success:
- ✅ No 400 errors
- ✅ Paddle checkout opens
- ✅ Payment form loads

## 📞 Quick Checklist

- [ ] Domain added to Paddle approved domains
- [ ] Product is active in Paddle dashboard
- [ ] Client token is correct
- [ ] Environment is set to sandbox
- [ ] Default checkout URL is set
- [ ] Browser cache cleared

## 🆘 Emergency Fallback

If Paddle continues to fail, we can temporarily use the test checkout page:
1. The app will automatically redirect to `/test-checkout`
2. This allows you to continue testing the flow
3. We can fix Paddle integration later

---
**The 400 error is almost always domain approval or product configuration!**
