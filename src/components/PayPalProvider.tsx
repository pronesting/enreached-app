'use client';

import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { env } from '@/lib/env';

interface PayPalProviderProps {
  children: React.ReactNode;
}

export function PayPalProvider({ children }: PayPalProviderProps) {
  // Debug logging - show ALL environment variables
  console.log('=== ENVIRONMENT DEBUG ===');
  console.log('All env vars:', Object.keys(process.env).sort());
  console.log('PayPal specific:', {
    PAYPAL_CLIENT_ID: env.PAYPAL_CLIENT_ID ? 'SET' : 'NOT SET',
    PAYPAL_CLIENT_ID_LENGTH: env.PAYPAL_CLIENT_ID?.length || 0,
    PAYPAL_MODE: env.PAYPAL_MODE,
    NODE_ENV: process.env.NODE_ENV,
    VERCEL: process.env.VERCEL,
    // Raw values
    RAW_PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
    RAW_NEXT_PUBLIC_PAYPAL_CLIENT_ID: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
    // All PayPal vars
    ALL_PAYPAL_VARS: Object.keys(process.env).filter(key => key.includes('PAYPAL')),
  });
  console.log('=== END DEBUG ===');

  // Only load PayPal if we have a valid client ID
  if (!env.PAYPAL_CLIENT_ID || env.PAYPAL_CLIENT_ID === '') {
    console.warn('PayPal Client ID not configured. PayPal features will be disabled.');
    return <>{children}</>;
  }

  const paypalOptions = {
    clientId: env.PAYPAL_CLIENT_ID,
    currency: 'USD',
    intent: 'capture',
    components: 'buttons',
  };

  return (
    <PayPalScriptProvider options={paypalOptions}>
      {children}
    </PayPalScriptProvider>
  );
}
