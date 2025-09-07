'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, CheckCircle, X } from 'lucide-react';

export default function TestCheckoutPage() {
  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('');

  useEffect(() => {
    // Get checkout data from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const data = {
      title: urlParams.get('title') || 'Data Processing',
      description: urlParams.get('description') || 'Process your data',
      price: urlParams.get('price') || '0',
      currency: urlParams.get('currency') || 'USD',
      custom_data: urlParams.get('custom_data') || '{}',
      success_url: urlParams.get('success_url') || '/success',
      cancel_url: urlParams.get('cancel_url') || '/failed',
    };
    setCheckoutData(data);
  }, []);

  const handlePayment = async (method: string) => {
    setPaymentMethod(method);
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate success (90% success rate for testing)
    const isSuccess = Math.random() > 0.1;
    
    if (isSuccess) {
      // Redirect to success page
      window.location.href = checkoutData?.success_url || '/success';
    } else {
      // Redirect to failed page
      window.location.href = checkoutData?.cancel_url || '/failed';
    }
  };

  if (!checkoutData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  const price = (parseInt(checkoutData.price) / 100).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <CreditCard className="h-6 w-6" />
              Secure Checkout
            </CardTitle>
            <p className="text-center text-sm text-gray-600">
              Complete your payment to process your data
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Order Summary */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">{checkoutData.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{checkoutData.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-xl font-bold">${price} {checkoutData.currency}</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-3">
              <h3 className="font-semibold">Choose Payment Method:</h3>
              
              <Button
                onClick={() => handlePayment('apple-pay')}
                disabled={isProcessing}
                className="w-full h-12 bg-black text-white hover:bg-gray-800"
              >
                {isProcessing && paymentMethod === 'apple-pay' ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                ) : (
                  <CreditCard className="h-5 w-5 mr-2" />
                )}
                Apple Pay
              </Button>

              <Button
                onClick={() => handlePayment('google-pay')}
                disabled={isProcessing}
                className="w-full h-12 bg-blue-600 text-white hover:bg-blue-700"
              >
                {isProcessing && paymentMethod === 'google-pay' ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                ) : (
                  <CreditCard className="h-5 w-5 mr-2" />
                )}
                Google Pay
              </Button>

              <Button
                onClick={() => handlePayment('credit-card')}
                disabled={isProcessing}
                className="w-full h-12 bg-gray-800 text-white hover:bg-gray-900"
              >
                {isProcessing && paymentMethod === 'credit-card' ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                ) : (
                  <CreditCard className="h-5 w-5 mr-2" />
                )}
                Credit Card
              </Button>
            </div>

            {/* Security Notice */}
            <div className="text-xs text-gray-500 text-center">
              <p>This is a test checkout page for demonstration purposes.</p>
              <p className="mt-1">
                In production, this would redirect to Paddle's secure checkout.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
