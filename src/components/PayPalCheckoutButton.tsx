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

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      setError(null);

      console.log('Creating PayPal order for credit card payment...');
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
      console.log('PayPal order response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      // Redirect to PayPal for credit card payment
      if (data.approvalUrl) {
        console.log('Redirecting to PayPal credit card form:', data.approvalUrl);
        window.location.href = data.approvalUrl;
      } else {
        throw new Error('No approval URL received from PayPal');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      console.error('Payment error:', errorMessage);
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
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader className="pb-4">
        <CardTitle className="text-center text-lg">Complete Your Payment</CardTitle>
        <p className="text-center text-xs text-gray-600">
          Secure payment powered by PayPal
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Order Summary */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-base mb-2">
            {invoiceData.dataType === 'emails' ? 'Email' : 'Phone'} Data Processing
          </h3>
          <p className="text-xs text-gray-600 mb-2">
            Processing {invoiceData.recordCount.toLocaleString()} {invoiceData.dataType} records
          </p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Records:</span>
              <span>{invoiceData.recordCount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Price per record:</span>
              <span>${invoiceData.pricePerRecord.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-bold border-t pt-1">
              <span>Total:</span>
              <span className="text-green-600">${invoiceData.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Customer Details */}
        <div className="p-3 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-1 text-sm">Customer Information</h4>
          <div className="space-y-1 text-xs">
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
          <Button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full max-w-xs h-12 bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
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
            {isProcessing ? 'Processing...' : 'Pay with Credit Card'}
          </Button>
        </div>

        <div className="text-xs text-gray-500 text-center">
          <p>🔒 Secure payment powered by PayPal • No account required</p>
        </div>
      </CardContent>
    </Card>
  );
}
