'use client';

import { useState } from 'react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { InvoiceData } from '@/types';
import { PAYPAL_CONFIG } from '@/lib/paypal-config';

interface PayPalCheckoutButtonProps {
  invoiceData: InvoiceData;
  onSuccess: (orderId: string) => void;
  onError: (error: string) => void;
}

export function PayPalCheckoutButton({ 
  invoiceData, 
  onSuccess, 
  onError 
}: PayPalCheckoutButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [{ isPending }] = usePayPalScriptReducer();

  console.log('PayPalCheckoutButton rendered:', {
    invoiceData,
    isPending,
    isProcessing,
    isApproved,
    error,
    clientId: PAYPAL_CONFIG.CLIENT_ID
  });

  // Check if PayPal is configured
  if (!PAYPAL_CONFIG.CLIENT_ID || PAYPAL_CONFIG.CLIENT_ID === '') {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">PayPal Not Configured</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto" />
          <div>
            <h3 className="font-semibold text-yellow-600 text-xl">PayPal Integration Not Set Up</h3>
            <p className="text-sm text-gray-600 mt-2">
              Please configure your PayPal credentials to enable payment processing.
            </p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-700">
              Contact your administrator to set up PayPal integration.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const createOrder = async () => {
    try {
      setIsProcessing(true);
      setError(null);

      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      return data.orderId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create order';
      setError(errorMessage);
      onError(errorMessage);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  const onApprove = async (data: any) => {
    try {
      setIsProcessing(true);
      setError(null);

      const response = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId: data.orderID }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to capture payment');
      }

      setIsApproved(true);
      onSuccess(data.orderID);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayPalError = (err: any) => {
    console.error('PayPal error:', err);
    const errorMessage = 'Payment failed. Please try again.';
    setError(errorMessage);
    onError(errorMessage);
  };

  if (isApproved) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <div>
              <h3 className="font-semibold text-green-600 text-xl">Payment Successful!</h3>
              <p className="text-sm text-gray-600 mt-2">
                Your payment has been processed successfully.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-green-700">
                <p><strong>Order Total:</strong> ${invoiceData.totalAmount.toFixed(2)}</p>
                <p><strong>Records:</strong> {invoiceData.recordCount.toLocaleString()}</p>
                <p><strong>Data Type:</strong> {invoiceData.dataType}</p>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              <p>You will receive a confirmation email shortly.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isPending) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="text-gray-600">Loading PayPal...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">PayPal Checkout</CardTitle>
        <p className="text-center text-sm text-gray-600">
          Complete your payment securely with PayPal
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Order Summary */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">
            {invoiceData.dataType === 'emails' ? 'Email' : 'Phone'} Data Processing
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Processing {invoiceData.recordCount.toLocaleString()} {invoiceData.dataType} records
          </p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Records:</span>
              <span>{invoiceData.recordCount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Price per record:</span>
              <span>${invoiceData.pricePerRecord.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span className="text-green-600">${invoiceData.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Customer Details */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Customer Information</h4>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Name:</span> {invoiceData.userDetails.firstName} {invoiceData.userDetails.lastName}</p>
            <p><span className="font-medium">Email:</span> {invoiceData.userDetails.email}</p>
            <p><span className="font-medium">Company:</span> {invoiceData.userDetails.company}</p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div className="text-sm text-red-600">
                <p>{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* PayPal Button */}
        <div className="flex justify-center">
          <PayPalButtons
            createOrder={createOrder}
            onApprove={onApprove}
            onError={handlePayPalError}
            disabled={isProcessing}
            style={{
              layout: 'vertical',
              color: 'blue',
              shape: 'rect',
              label: 'paypal',
            }}
          />
        </div>

        <div className="text-xs text-gray-500 text-center">
          <p>Secure payment powered by PayPal</p>
          <p className="mt-1">
            You will be redirected to PayPal to complete your payment
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
