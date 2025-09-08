'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function FailedPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-md mx-auto">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-center text-red-600 flex items-center justify-center gap-2">
                <AlertCircle className="h-6 w-6" />
                Payment Failed
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-lg font-medium">There was an issue processing your payment.</p>
              <div className="p-4 bg-red-50 rounded-lg">
                <h3 className="font-semibold text-red-800 mb-2">What happened?</h3>
                <p className="text-sm text-red-600">
                  Your payment could not be processed. This might be due to insufficient funds, 
                  incorrect card details, or a temporary issue with the payment system.
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Please try again or contact support if the problem persists.
                </p>
                <Link href="/">
                  <Button className="w-full">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
