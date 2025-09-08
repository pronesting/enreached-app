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
        <CardTitle className="text-center text-lg font-semibold text-gray-800">Complete Your Payment</CardTitle>
        <div className="flex items-center justify-center gap-2 mt-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-blue-600">
            <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.543-.676c-.608-.624-1.47-1.01-2.53-1.01H9.342a.641.641 0 0 0-.633.74l1.12 7.106c.082.518.526.9 1.05.9h2.19c4.298 0 7.664-1.747 8.647-6.797.03-.149.054-.294.077-.437.292-1.867-.002-3.137-1.012-4.287z"/>
            <path d="M17.73 6.24c.292-1.867-.002-3.137-1.012-4.287C15.608.327 13.6-.216 11.03-.216H3.57a.641.641 0 0 0-.633.74L4.944 20.597c.082.518.526.9 1.05.9h4.606L17.73 6.24z"/>
          </svg>
          <span className="text-sm text-gray-600 font-medium">Powered by PayPal</span>
        </div>
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
            <p><span className="font-medium">Phone:</span> {invoiceData.userDetails.phone}</p>
            <p><span className="font-medium">List:</span> {invoiceData.userDetails.listName}</p>
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
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full max-w-sm h-14 bg-[#0070ba] hover:bg-[#005ea6] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 px-6"
            style={{
              background: isProcessing 
                ? '#6c757d' 
                : 'linear-gradient(135deg, #0070ba 0%, #005ea6 100%)',
              boxShadow: '0 4px 8px rgba(0, 112, 186, 0.3)',
            }}
          >
            {isProcessing ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.543-.676c-.608-.624-1.47-1.01-2.53-1.01H9.342a.641.641 0 0 0-.633.74l1.12 7.106c.082.518.526.9 1.05.9h2.19c4.298 0 7.664-1.747 8.647-6.797.03-.149.054-.294.077-.437.292-1.867-.002-3.137-1.012-4.287z" 
                      fill="currentColor"
                    />
                    <path 
                      d="M17.73 6.24c.292-1.867-.002-3.137-1.012-4.287C15.608.327 13.6-.216 11.03-.216H3.57a.641.641 0 0 0-.633.74L4.944 20.597c.082.518.526.9 1.05.9h4.606L17.73 6.24z" 
                      fill="currentColor"
                    />
                  </svg>
                  <span className="text-lg font-bold">PayPal</span>
                </div>
                <div className="text-sm opacity-90">
                  {isProcessing ? 'Processing...' : 'Pay with PayPal'}
                </div>
              </>
            )}
          </button>
        </div>

        <div className="text-xs text-gray-500 text-center mt-3">
          <div className="flex items-center justify-center gap-2">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
            </svg>
            <span>Secured by PayPal</span>
            <span>•</span>
            <span>No PayPal account required</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
