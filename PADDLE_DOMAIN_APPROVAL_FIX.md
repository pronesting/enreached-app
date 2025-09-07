# 🚨 URGENT: Fix Paddle Domain Approval

## Current Issue
You're getting a **400 error** because your Vercel domain is not approved in Paddle dashboard.

## Error Details
```
sandbox-checkout-service.paddle.com/transaction-checkout:1  Failed to load resource: the server responded with a status of 400 ()
```

## ✅ IMMEDIATE FIX - Follow These Steps:

### Step 1: Go to Paddle Dashboard
1. Open [Paddle Dashboard](https://vendors.paddle.com/)
2. Log in with your Paddle account

### Step 2: Navigate to Domain Settings
1. Go to **Settings** → **Checkout**
2. Look for **"Website Approval"** or **"Approved Domains"** section

### Step 3: Add Your Vercel Domain
Add these domains to the approved list:
- `https://enreached-app.vercel.app` (main domain)
- `https://enreached-app-git-main.vercel.app` (if using preview deployments)

### Step 4: Set Default Checkout URL
In the same Checkout Settings page:
- Set **Default Payment Link** to: `https://enreached-app.vercel.app/success`

### Step 5: Save and Test
1. Save the settings
2. Go back to your Vercel app
3. Try the checkout button again

## 🔍 Alternative Path (if above doesn't work):

### Option A: Checkout Settings
1. Go to **Checkout** → **Website Approval**
2. Add your domain there instead

### Option B: Account Settings
1. Go to **Account** → **Settings**
2. Look for **Domain Approval** or **Website Settings**

## 📱 Quick Test
After adding the domain:
1. Refresh your Vercel app page
2. Fill out the form and upload CSV
3. Click "Proceed to Checkout"
4. The Paddle checkout should now open successfully

## 🆘 If Still Not Working:
1. **Check the exact domain** in your browser's address bar
2. **Make sure you're using HTTPS** (not HTTP)
3. **Try adding both with and without www**
4. **Contact Paddle support** if approval doesn't work

## Expected Result
After domain approval, you should see:
- ✅ Paddle checkout opens successfully
- ✅ No more 400 errors
- ✅ Payment form loads properly

---
**This is the most common cause of 400 errors with Paddle integration!**
