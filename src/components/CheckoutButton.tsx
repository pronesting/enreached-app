'use client';

import { useState } from 'react';
import { PayPalCheckoutButton } from './PayPalCheckoutButton';
import { InvoiceData } from '@/types';

interface CheckoutButtonProps {
  invoiceData: InvoiceData;
  onCheckout: () => void;
}

export function CheckoutButton({ invoiceData, onCheckout }: CheckoutButtonProps) {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSuccess = (orderId: string) => {
    console.log('Payment successful:', orderId);
    setIsCompleted(true);
    onCheckout();
  };

  const handleError = (error: string) => {
    console.error('Payment error:', error);
  };

  if (isCompleted) {
    return null; // Let the parent handle the success state
  }

  return (
    <PayPalCheckoutButton
      invoiceData={invoiceData}
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
}