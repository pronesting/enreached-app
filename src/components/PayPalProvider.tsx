'use client';

interface PayPalProviderProps {
  children: React.ReactNode;
}

export function PayPalProvider({ children }: PayPalProviderProps) {
  // Using direct PayPal integration (no SDK)
  return <>{children}</>;
}
