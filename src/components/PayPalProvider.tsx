'use client';

import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { env } from '@/lib/env';

interface PayPalProviderProps {
  children: React.ReactNode;
}

export function PayPalProvider({ children }: PayPalProviderProps) {
  // Debug logging
  console.log('PayPal Provider Debug:', {
    PAYPAL_CLIENT_ID: env.PAYPAL_CLIENT_ID ? 'SET' : 'NOT SET',
    PAYPAL_CLIENT_ID_LENGTH: env.PAYPAL_CLIENT_ID?.length || 0,
    PAYPAL_MODE: env.PAYPAL_MODE,
    NODE_ENV: process.env.NODE_ENV,
    VERCEL: process.env.VERCEL,
  });

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
