'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InvoiceData } from '@/types';
import { ArrowLeft, CreditCard, User, Mail, Phone, FileText, ChevronLeft, ChevronRight } from 'lucide-react';

interface InvoiceCardProps {
  invoiceData: InvoiceData;
  onCheckout: () => void;
  onBack?: () => void;
  canGoBack?: boolean;
}

export function InvoiceCard({ invoiceData, onCheckout, onBack, canGoBack }: InvoiceCardProps) {
  const { userDetails, dataType, recordCount, pricePerRecord, totalAmount } = invoiceData;
  const isMinimumPrice = recordCount < 100;

  return (
    <div className="w-[calc(100%-10px)] sm:w-[600px] mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            <FileText className="h-6 w-6" />
            Order Summary
          </CardTitle>
          <p className="text-center text-sm text-gray-600">
            Review your order details before proceeding to checkout
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{userDetails.firstName} {userDetails.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {userDetails.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {userDetails.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Order Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Data Type</span>
                <span className="font-medium capitalize">{dataType}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Number of Records</span>
                <span className="font-medium">{recordCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Price per Record</span>
                <span className="font-medium">${pricePerRecord.toFixed(2)}</span>
              </div>
              {isMinimumPrice && (
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Calculated Amount</span>
                  <span className="font-medium">${(recordCount * pricePerRecord).toFixed(2)}</span>
                </div>
              )}
              {isMinimumPrice && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-yellow-800">
                      <strong>Minimum Order:</strong> Orders with less than 100 records are charged a minimum of $15.00
                    </span>
                  </div>
                </div>
              )}
              <div className="flex justify-between items-center py-3 text-lg font-semibold bg-gray-50 px-4 rounded">
                <span>Total Amount</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {canGoBack && onBack && (
              <Button 
                variant="outline" 
                onClick={onBack}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
            )}
            <Button 
              onClick={onCheckout} 
              className={`flex items-center gap-2 ${canGoBack ? 'flex-1' : 'w-full'}`}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Proceed to Checkout
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
