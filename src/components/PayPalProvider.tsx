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
  components: 'buttons,marks,messages',
  enableFunding: 'card,venmo,paylater',
  disableFunding: 'credit',
  dataSdkIntegrationSource: 'integrationbuilder_ac',
};

export function PayPalProvider({ children }: PayPalProviderProps) {
  return (
    <PayPalScriptProvider options={paypalOptions}>
      {children}
    </PayPalScriptProvider>
  );
}
