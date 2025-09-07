'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-md mx-auto">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-center text-green-600 flex items-center justify-center gap-2">
                <CheckCircle className="h-6 w-6" />
                Payment Successful!
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-lg font-medium">Thank you for your order!</p>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">We're Working on It!</h3>
                <p className="text-sm text-gray-600">
                  Our team is processing your data and will deliver the complete report to your email within 24-48 hours.
                </p>
              </div>
              <p className="text-sm text-gray-600">
                You will receive a confirmation email shortly with your order details.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}