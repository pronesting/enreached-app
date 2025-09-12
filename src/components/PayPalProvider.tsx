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
  components: 'buttons', // Remove 'marks,messages' to reduce warnings
  enableFunding: 'card,venmo,paylater',
  disableFunding: 'credit',
  dataSdkIntegrationSource: 'integrationbuilder_ac',
  debug: false, // Disable debug mode to reduce console noise
};

export function PayPalProvider({ children }: PayPalProviderProps) {
  return (
    <PayPalScriptProvider options={paypalOptions}>
      {children}
    </PayPalScriptProvider>
  );
}
