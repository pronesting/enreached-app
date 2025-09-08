'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, ChevronLeft } from 'lucide-react';
import { InvoiceData } from '@/types';
import { PayPalButtons, PayPalMarks, PayPalMessages } from '@paypal/react-paypal-js';

interface PayPalCheckoutButtonProps {
  invoiceData: InvoiceData;
  onSuccess: (orderId: string) => void;
  onError: (error: string) => void;
  onBack?: () => void;
  canGoBack?: boolean;
}

export function PayPalCheckoutButton({ 
  invoiceData, 
  onSuccess, 
  onError,
  onBack,
  canGoBack
}: PayPalCheckoutButtonProps) {
  const [isApproved, setIsApproved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log('PayPalCheckoutButton rendered:', { 
    invoiceData, 
    isApproved, 
    error 
  });

  const createOrder = async (data: any, actions: any) => {
    try {
      console.log('Creating PayPal order...');
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...invoiceData,
          paymentMethod: 'paypal'
        }),
      });

      const orderData = await response.json();
      console.log('PayPal order response:', orderData);

      if (!response.ok) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      return orderData.orderId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create order';
      console.error('Order creation error:', errorMessage);
      setError(errorMessage);
      onError(errorMessage);
      throw err;
    }
  };

  const onApprove = async (data: any, actions: any) => {
    try {
      console.log('Approving PayPal order:', data.orderID);
      
      const response = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: data.orderID
        }),
      });

      const captureData = await response.json();
      console.log('PayPal capture response:', captureData);

      if (!response.ok) {
        throw new Error(captureData.error || 'Failed to capture order');
      }

      console.log('Payment successful:', data.orderID);
      setIsApproved(true);
      onSuccess(data.orderID);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      console.error('Payment approval error:', errorMessage);
      setError(errorMessage);
      onError(errorMessage);
    }
  };

  const onPayPalError = (err: any) => {
    console.error('PayPal button error:', err);
    const errorMessage = err.message || 'Payment failed';
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

  return (
    <Card className="w-[90%] max-w-[600px] mx-auto">
      <CardHeader className="pb-4">
        <CardTitle className="text-center text-lg font-semibold text-gray-800">Complete Your Payment</CardTitle>
        <p className="text-center text-sm text-gray-600 mt-2">
          Secure payment powered by PayPal
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Order Summary */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-base mb-3">
            {invoiceData.dataType === 'emails' ? 'Email' : 'Phone'} Data Processing
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Processing {invoiceData.recordCount.toLocaleString()} {invoiceData.dataType} records
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Records:</span>
              <span>{invoiceData.recordCount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Price per record:</span>
              <span>${invoiceData.pricePerRecord.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-bold border-t pt-2">
              <span>Total:</span>
              <span className="text-green-600">${invoiceData.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Customer Details */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2 text-sm">Customer Information</h4>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Name:</span> {invoiceData.userDetails.firstName} {invoiceData.userDetails.lastName}</p>
            <p><span className="font-medium">Email:</span> {invoiceData.userDetails.email}</p>
            <p><span className="font-medium">Phone:</span> {invoiceData.userDetails.phone}</p>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div className="text-sm text-red-600">
                <p>{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Official PayPal Components */}
        <div className="space-y-4">
          <PayPalMarks />
          <PayPalMessages />
          <PayPalButtons
            createOrder={createOrder}
            onApprove={onApprove}
            onError={onPayPalError}
            style={{
              layout: 'vertical',
              color: 'blue',
              shape: 'rect',
              label: 'paypal',
              height: 45,
            }}
            fundingSource={undefined}
          />
        </div>

        {/* Back Button */}
        {canGoBack && onBack && (
          <div className="flex justify-start pt-4">
            <Button 
              variant="outline" 
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
