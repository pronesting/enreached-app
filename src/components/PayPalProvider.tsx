'use client';

import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { PAYPAL_CONFIG } from '@/lib/paypal-config';
import { useMemo, useRef } from 'react';

interface PayPalProviderProps {
  children: React.ReactNode;
}

// Create stable options object outside component
const paypalOptions = {
  clientId: PAYPAL_CONFIG.CLIENT_ID,
  currency: 'USD',
  intent: 'capture',
  components: 'buttons',
};

// Create stable error handler outside component
const onError = (error: any) => {
  console.error('PayPal SDK Error:', error);
};

export function PayPalProvider({ children }: PayPalProviderProps) {
  const renderCount = useRef(0);
  renderCount.current += 1;
  
  console.log('PayPalProvider rendered #' + renderCount.current + ' with client ID:', PAYPAL_CONFIG.CLIENT_ID);

  // Only load PayPal if we have a valid client ID
  if (!PAYPAL_CONFIG.CLIENT_ID || PAYPAL_CONFIG.CLIENT_ID === '') {
    console.warn('PayPal Client ID not configured. Please update paypal-config.ts with your actual client ID.');
    return <>{children}</>;
  }

  // If we've rendered more than once, something is wrong
  if (renderCount.current > 1) {
    console.warn('PayPalProvider is re-rendering! This might cause issues.');
  }

  console.log('PayPalProvider: Rendering PayPalScriptProvider');
  return (
    <PayPalScriptProvider 
      options={paypalOptions} 
      onError={onError}
    >
      {children}
    </PayPalScriptProvider>
  );
}
