'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, AlertCircle, CreditCard } from 'lucide-react';
import { InvoiceData } from '@/types';

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

  console.log('PayPalCheckoutButton rendered:', { 
    invoiceData, 
    isProcessing, 
    isApproved, 
    error 
  });

  const handlePayPalPayment = async () => {
    try {
      setIsProcessing(true);
      setError(null);

      console.log('Creating PayPal order...');
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      });

      const data = await response.json();
      console.log('PayPal order response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      // Redirect to PayPal for payment
      if (data.approvalUrl) {
        console.log('Redirecting to PayPal:', data.approvalUrl);
        window.location.href = data.approvalUrl;
      } else {
        throw new Error('No approval URL received from PayPal');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      console.error('PayPal payment error:', errorMessage);
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreditCardPayment = async () => {
    try {
      setIsProcessing(true);
      setError(null);

      console.log('Creating PayPal order for credit card...');
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...invoiceData,
          paymentMethod: 'credit_card'
        }),
      });

      const data = await response.json();
      console.log('PayPal credit card order response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      // For credit card, we'll redirect to PayPal's hosted page
      if (data.approvalUrl) {
        console.log('Redirecting to PayPal credit card form:', data.approvalUrl);
        window.location.href = data.approvalUrl;
      } else {
        throw new Error('No approval URL received from PayPal');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Credit card payment failed';
      console.error('Credit card payment error:', errorMessage);
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Payment Options</CardTitle>
        <p className="text-center text-sm text-gray-600">
          Choose your preferred payment method
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

        {/* Payment Buttons */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* PayPal Button */}
            <Button
              onClick={handlePayPalPayment}
              disabled={isProcessing}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isProcessing ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <img 
                  src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg" 
                  alt="PayPal" 
                  className="h-5 w-5 mr-2"
                />
              )}
              Pay with PayPal
            </Button>

            {/* Credit Card Button */}
            <Button
              onClick={handleCreditCardPayment}
              disabled={isProcessing}
              variant="outline"
              className="w-full h-12 border-2 border-gray-300 hover:border-gray-400"
            >
              {isProcessing ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <CreditCard className="h-5 w-5 mr-2" />
              )}
              Pay with Credit Card
            </Button>
          </div>
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
