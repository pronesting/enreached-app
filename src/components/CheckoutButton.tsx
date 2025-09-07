'use client';

import { useState } from 'react';
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
      // Using your real Paddle product ID
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
          displayMode: 'overlay' as const,
          allowLogout: true,
        },
      };

      console.log('Opening Paddle checkout with data:', checkoutData);

      // Open real Paddle checkout
      await paddleService.openCheckout(checkoutData);
      
      // If we reach here, checkout was successful
      onCheckout();
      window.location.href = '/success';
      
    } catch (err) {
      console.error('Checkout error on Vercel:', err);
      
      const errorMessage = err instanceof Error ? err.message : 'Payment failed. Please try again.';
      
      // For Vercel deployment, show specific error message
      if (errorMessage.includes('400') || errorMessage.includes('domain')) {
        setError(`Domain approval needed for Vercel deployment. Please add ${window.location.origin} to your Paddle dashboard approved domains.`);
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsProcessing(false);
    }
  };

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
                {error.includes('Domain approval') && (
                  <div className="mt-2 text-xs">
                    <p className="font-semibold">To fix this:</p>
                    <ol className="list-decimal list-inside mt-1 space-y-1">
                      <li>Go to <a href="https://vendors.paddle.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Paddle Dashboard</a></li>
                      <li>Navigate to Settings → Checkout</li>
                      <li>Add <code className="bg-gray-100 px-1 rounded">{window.location.origin}</code> to Approved Domains</li>
                      <li>Refresh this page and try again</li>
                    </ol>
                  </div>
                )}
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
              Processing Payment...
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
  );
}


