'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Mail, FileText, Loader2 } from 'lucide-react';
import { InvoiceData } from '@/types';

interface CheckoutButtonProps {
  invoiceData: InvoiceData;
  onCheckout: () => void;
}

export function CheckoutButton({ invoiceData, onCheckout }: CheckoutButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApproval = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mark as approved
      setIsApproved(true);
      
      // Call the onCheckout callback
      onCheckout();
      
    } catch (err) {
      console.error('Approval error:', err);
      setError('Failed to process approval. Please try again.');
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
              <h3 className="font-semibold text-green-600 text-xl">Order Approved!</h3>
              <p className="text-sm text-gray-600 mt-2">
                Your order has been approved and will be processed shortly.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <Mail className="h-4 w-4" />
                <span className="text-sm font-medium">Invoice will be sent to:</span>
              </div>
              <p className="text-sm text-green-600 mt-1">{invoiceData.userDetails.email}</p>
            </div>
            <div className="text-xs text-gray-500">
              <p>You will receive an email with payment instructions within 24 hours.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center flex items-center justify-center gap-2">
          <FileText className="h-6 w-6" />
          Order Summary & Approval
        </CardTitle>
        <p className="text-center text-sm text-gray-600">
          Review your order details and approve to proceed
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Order Details */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-semibold text-sm text-gray-700">Data Type</h4>
              <p className="text-lg font-medium">{invoiceData.dataType}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-700">Records</h4>
              <p className="text-lg font-medium">{invoiceData.recordCount.toLocaleString()}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-700">List Name</h4>
              <p className="text-lg font-medium">{invoiceData.userDetails.listName}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-700">Price per Record</h4>
              <p className="text-lg font-medium">${invoiceData.pricePerRecord.toFixed(2)}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total Amount:</span>
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

        {/* Process Information */}
        <div className="p-4 bg-yellow-50 rounded-lg">
          <div className="flex items-start gap-2">
            <Mail className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-800">Manual Invoice Process</h4>
              <p className="text-sm text-yellow-700 mt-1">
                After approval, you will receive an email with payment instructions and invoice details.
                Payment can be made via bank transfer, PayPal, or other agreed methods.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="text-sm text-red-600">
                <p>{error}</p>
              </div>
            </div>
          </div>
        )}

        <Button 
          onClick={handleApproval}
          disabled={isProcessing}
          className="w-full h-12 text-lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Processing Approval...
            </>
          ) : (
            <>
              <CheckCircle className="h-5 w-5 mr-2" />
              Approve Order & Request Invoice
            </>
          )}
        </Button>

        <div className="text-xs text-gray-500 text-center">
          <p>By approving this order, you agree to our terms of service.</p>
          <p className="mt-1">
            You will receive an invoice via email within 24 hours.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}


