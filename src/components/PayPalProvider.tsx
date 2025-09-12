'use client';

import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { PAYPAL_CONFIG } from '@/lib/paypal-config';

interface PayPalProviderProps {
  children: React.ReactNode;
}

const paypalOptions = {
  clientId: PAYPAL_CONFIG.CLIENT_ID,
  currency: 'USD',
  intent: 'capture',
  components: 'buttons,marks,messages', // Keep all components since they're being used in the app
  enableFunding: 'card,venmo,paylater',
  disableFunding: 'credit',
  dataSdkIntegrationSource: 'integrationbuilder_ac',
  debug: false, // Disable debug mode to reduce console noise
  locale: 'en_US', // Set specific locale to avoid 404 errors
};

export function PayPalProvider({ children }: PayPalProviderProps) {
  return (
    <PayPalScriptProvider options={paypalOptions}>
      {children}
    </PayPalScriptProvider>
  );
}
