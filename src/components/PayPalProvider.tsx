'use client';

interface PayPalProviderProps {
  children: React.ReactNode;
}

export function PayPalProvider({ children }: PayPalProviderProps) {
  console.log('PayPalProvider: Using direct PayPal integration (no SDK)');
  return <>{children}</>;
}
