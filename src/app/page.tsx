'use client';

import { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { UserDetailsForm } from '@/components/UserDetailsForm';
import { DataTypePicker } from '@/components/DataTypePicker';
import { CsvUploader } from '@/components/CsvUploader';
import { InvoiceCard } from '@/components/InvoiceCard';
import { CheckoutButton } from '@/components/CheckoutButton';
import Footer from '@/components/Footer';
import { UserDetails, DataType, CsvData, InvoiceData, Step } from '@/types';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

const STEPS: { key: Step; title: string; description: string }[] = [
  { key: 'details', title: 'Personal Details', description: 'Enter your contact information' },
  { key: 'dataType', title: 'Data Type', description: 'Choose what type of data you\'re uploading' },
  { key: 'upload', title: 'Upload CSV', description: 'Upload and review your data file' },
  { key: 'review', title: 'Review Invoice', description: 'Confirm your order details' },
  { key: 'checkout', title: 'Approve Order', description: 'Approve and request invoice' },
];

const PRICE_PER_RECORD = 0.25;

export default function Home() {
  const [currentStep, setCurrentStep] = useState<Step>('details');
  const [userDetails, setUserDetails] = useState<UserDetails>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    listName: '',
  });
  const [dataType, setDataType] = useState<DataType>('emails');
  const [csvData, setCsvData] = useState<CsvData | null>(null);
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);

  const currentStepIndex = STEPS.findIndex(step => step.key === currentStep);
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100;

  const handleUserDetailsSubmit = useCallback((details: UserDetails) => {
    setUserDetails(details);
    setCurrentStep('dataType');
  }, []);

  const handleDataTypeSelect = useCallback((type: DataType) => {
    setDataType(type);
    setCurrentStep('upload');
  }, []);

  const handleCsvUpload = useCallback((data: CsvData) => {
    setCsvData(data);
    const totalAmount = data.recordCount * PRICE_PER_RECORD;
    setInvoiceData({
      userDetails,
      dataType,
      recordCount: data.recordCount,
      pricePerRecord: PRICE_PER_RECORD,
      totalAmount,
    });
    setCurrentStep('review');
  }, [userDetails, dataType]);

  const handleCheckout = useCallback(() => {
    setCurrentStep('checkout');
    // The CheckoutButton component will handle the PayPal payment process
    // and redirect to success page after payment
  }, []);

  const goToPreviousStep = useCallback(() => {
    switch (currentStep) {
      case 'dataType':
        setCurrentStep('details');
        break;
      case 'upload':
        setCurrentStep('dataType');
        break;
      case 'review':
        setCurrentStep('upload');
        break;
      case 'checkout':
        setCurrentStep('review');
        break;
      default:
        break;
    }
  }, [currentStep]);

  const goToNextStep = useCallback(() => {
    switch (currentStep) {
      case 'details':
        if (userDetails.firstName && userDetails.lastName && userDetails.email && userDetails.phone && userDetails.listName) {
          setCurrentStep('dataType');
        }
        break;
      case 'dataType':
        setCurrentStep('upload');
        break;
      case 'upload':
        if (csvData) {
          const totalAmount = csvData.recordCount * PRICE_PER_RECORD;
          setInvoiceData({
            userDetails,
            dataType,
            recordCount: csvData.recordCount,
            pricePerRecord: PRICE_PER_RECORD,
            totalAmount,
          });
          setCurrentStep('review');
        }
        break;
      case 'review':
        setCurrentStep('checkout');
        break;
      default:
        break;
    }
  }, [currentStep, userDetails, dataType, csvData]);

  const canGoBack = useCallback(() => {
    return ['dataType', 'upload', 'review', 'checkout'].includes(currentStep);
  }, [currentStep]);

  const canGoForward = useCallback(() => {
    switch (currentStep) {
      case 'details':
        return userDetails.firstName && userDetails.lastName && userDetails.email && userDetails.phone && userDetails.listName;
      case 'dataType':
        return true;
      case 'upload':
        return csvData !== null;
      case 'review':
        return true;
      default:
        return false;
    }
  }, [currentStep, userDetails, csvData]);

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'details':
        return (
          <UserDetailsForm 
            onSubmit={handleUserDetailsSubmit} 
            initialData={userDetails}
            onBack={goToPreviousStep}
            canGoBack={canGoBack()}
          />
        );
      case 'dataType':
        return (
          <DataTypePicker 
            onSelect={handleDataTypeSelect} 
            selectedType={dataType}
            onBack={goToPreviousStep}
            canGoBack={canGoBack()}
          />
        );
      case 'upload':
        return (
          <CsvUploader 
            onUpload={handleCsvUpload} 
            dataType={dataType}
            onBack={goToPreviousStep}
            canGoBack={canGoBack()}
          />
        );
      case 'review':
        return invoiceData ? (
          <InvoiceCard 
            invoiceData={invoiceData} 
            onCheckout={handleCheckout}
            onBack={goToPreviousStep}
            canGoBack={canGoBack()}
          />
        ) : null;
      case 'checkout':
        console.log('Main page: Rendering checkout step', { invoiceData });
        return invoiceData ? (
          <CheckoutButton 
            invoiceData={invoiceData} 
            onCheckout={handleCheckout} 
          />
        ) : null;
      case 'success':
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-center text-green-600 flex items-center justify-center gap-2">
                <CheckCircle className="h-6 w-6" />
                Order Approved!
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-lg font-medium">Thank you for your order!</p>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Next Steps</h3>
                <p className="text-sm text-gray-600">
                  You will receive an invoice via email within 24 hours with payment instructions.
                  Once payment is received, we'll process your data and deliver the complete report within 24-48 hours.
                </p>
              </div>
              <p className="text-sm text-gray-600">
                Check your email for the invoice and payment details.
              </p>
            </CardContent>
          </Card>
        );
      case 'failed':
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-center text-red-600">Payment Failed</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p>There was an issue processing your payment.</p>
              <p className="mt-2 text-sm text-gray-600">
                Please try again or contact support.
              </p>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <img 
                src="/Logo for enreached.svg" 
                alt="ENRECHED Logo" 
                className="mx-auto h-24 w-auto"
              />
            </div>

            {currentStep !== 'success' && currentStep !== 'failed' && (
              <div className="mb-12">
                <div className="text-center text-sm text-gray-600 mb-4">
                  <span>{STEPS[currentStepIndex]?.title}</span>
                </div>
                <Progress 
                  value={progress} 
                  className="h-1"
                />
              </div>
            )}

            <div className="space-y-8">
              {renderCurrentStep()}
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer - only show on form steps */}
      {currentStep !== 'success' && currentStep !== 'failed' && <Footer />}
    </div>
  );
}