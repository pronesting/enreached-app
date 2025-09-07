'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { InvoiceData } from '@/types';
import { usePaddle } from '@/hooks/usePaddle';
import { PaddleCheckoutData } from '@/lib/paddle';

interface CheckoutButtonProps {
  invoiceData: InvoiceData;
  onCheckout: () => void;
}

export function CheckoutButton({ invoiceData, onCheckout }: CheckoutButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showInlineCheckout, setShowInlineCheckout] = useState(false);
  const { isLoaded, isLoading, error: paddleError, paddleService } = usePaddle();

  const handleCheckout = async () => {
    if (!paddleService) {
      setError('Paddle is not loaded yet. Please try again.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    
    try {
      // Convert InvoiceData to Paddle checkout format
      const checkoutData: PaddleCheckoutData = {
        items: [
          {
            quantity: invoiceData.recordCount,
            customData: {
              dataType: invoiceData.dataType,
              listName: invoiceData.userDetails.listName,
              pricePerRecord: invoiceData.pricePerRecord,
            }
          }
        ],
        customer: {
          email: invoiceData.userDetails.email,
          name: `${invoiceData.userDetails.firstName} ${invoiceData.userDetails.lastName}`,
        },
        customData: {
          orderId: `order_${Date.now()}`,
          dataType: invoiceData.dataType,
          recordCount: invoiceData.recordCount,
          listName: invoiceData.userDetails.listName,
          totalAmount: invoiceData.totalAmount,
        },
        successUrl: `${window.location.origin}/success`,
        closeUrl: `${window.location.origin}/failed`,
        settings: {
          theme: 'light' as const,
          displayMode: 'inline' as const,
          allowLogout: false,
          showAddDiscounts: false,
          showAddTaxId: false,
        },
      };

      console.log('Rendering Paddle inline checkout with data:', checkoutData);

      // Show inline checkout container
      setShowInlineCheckout(true);
      
      // Render inline checkout
      await paddleService.renderInlineCheckout(checkoutData, 'paddle-checkout-container');
      
    } catch (err) {
      console.error('Checkout error:', err);
      
      const errorMessage = err instanceof Error ? err.message : 'Payment failed. Please try again.';
      setError(errorMessage);
      setShowInlineCheckout(false);
    } finally {
      setIsProcessing(false);
    }
  };

  // Effect to handle checkout completion
  useEffect(() => {
    const handleCheckoutComplete = () => {
      console.log('Checkout completed successfully');
      onCheckout();
    };

    // Listen for checkout completion events
    window.addEventListener('checkout-completed', handleCheckoutComplete);
    
    return () => {
      window.removeEventListener('checkout-completed', handleCheckoutComplete);
    };
  }, [onCheckout]);

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="text-gray-600">Loading secure checkout...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (paddleError || !isLoaded) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto" />
            <div>
              <h3 className="font-semibold text-red-600">Checkout Unavailable</h3>
              <p className="text-sm text-gray-600 mt-1">
                {paddleError || 'Failed to load payment system'}
              </p>
            </div>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
              className="w-full"
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {!showInlineCheckout ? (
        <Card className="w-full max-w-md mx-auto">
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
            <div className="text-center space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-lg">Ready to Process</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Your data is ready for processing. Click below to complete your payment.
                </p>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <p>✓ Secure payment processing</p>
                <p>✓ SSL encrypted connection</p>
                <p>✓ PCI compliant checkout</p>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <div className="text-sm text-red-600">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            )}

            <Button 
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full h-12 text-lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Loading Checkout...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5 mr-2" />
                  Proceed to Checkout
                </>
              )}
            </Button>

            <div className="text-xs text-gray-500 text-center">
              <p>By completing this payment, you agree to our terms of service.</p>
              <p className="mt-1">
                Your payment information is secure and encrypted.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <CreditCard className="h-6 w-6" />
              Complete Your Payment
            </CardTitle>
            <p className="text-center text-sm text-gray-600">
              Fill out the form below to complete your secure payment
            </p>
          </CardHeader>
          <CardContent>
            <div 
              id="paddle-checkout-container" 
              className="w-full min-h-[600px] border border-gray-200 rounded-lg"
            >
              {isProcessing && (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">Loading secure checkout...</span>
                </div>
              )}
            </div>
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <div className="text-sm text-red-600">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}


