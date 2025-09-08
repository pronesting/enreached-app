'use client';

import { useState, useEffect } from 'react';
import { PayPalCheckoutButton } from '@/components/PayPalCheckoutButton';
import { InvoiceData } from '@/types';
import { Loader2 } from 'lucide-react';

export default function CheckoutPage() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get checkout data from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    
    try {
      const data: InvoiceData = {
        userDetails: {
          firstName: urlParams.get('firstName') || '',
          lastName: urlParams.get('lastName') || '',
          email: urlParams.get('email') || '',
          phone: urlParams.get('phone') || '',
          listName: urlParams.get('listName') || '',
        },
        dataType: (urlParams.get('dataType') as 'emails' | 'phones') || 'emails',
        recordCount: parseInt(urlParams.get('recordCount') || '0'),
        pricePerRecord: parseFloat(urlParams.get('pricePerRecord') || '0'),
        totalAmount: parseFloat(urlParams.get('totalAmount') || '0'),
      };

      // Validate required fields
      if (!data.userDetails.email || !data.totalAmount || data.recordCount === 0) {
        setError('Invalid checkout data. Please try again.');
        return;
      }

      setInvoiceData(data);
    } catch (err) {
      setError('Failed to load checkout data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSuccess = (orderId: string) => {
    // Redirect to success page with order ID
    window.location.href = `/success?orderId=${orderId}`;
  };

  const handleError = (error: string) => {
    setError(error);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (error || !invoiceData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Failed to load checkout data'}</p>
          <button 
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <PayPalCheckoutButton
        invoiceData={invoiceData}
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  );
}

