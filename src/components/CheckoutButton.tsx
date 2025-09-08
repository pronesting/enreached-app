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

  console.log('CheckoutButton rendered:', { invoiceData, isCompleted });

  const handleSuccess = (orderId: string) => {
    console.log('Payment successful:', orderId);
    setIsCompleted(true);
    // Redirect to success page with order ID
    window.location.href = `/success?orderId=${orderId}`;
  };

  const handleError = (error: string) => {
    console.error('Payment error:', error);
  };

  if (isCompleted) {
    console.log('CheckoutButton: Payment completed, returning null');
    return null; // Let the parent handle the success state
  }

  console.log('CheckoutButton: Rendering PayPalCheckoutButton');
  return (
    <PayPalCheckoutButton
      invoiceData={invoiceData}
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
}