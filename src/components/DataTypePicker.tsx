'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataType } from '@/types';
import { Mail, Phone, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface DataTypePickerProps {
  onSelect: (type: DataType) => void;
  selectedType: DataType;
  onBack?: () => void;
  canGoBack?: boolean;
}

export function DataTypePicker({ onSelect, selectedType, onBack, canGoBack }: DataTypePickerProps) {
  const [showModal, setShowModal] = useState(false);
  const [localSelectedType, setLocalSelectedType] = useState<DataType>(selectedType);

  const dataTypes = [
    {
      type: 'emails' as DataType,
      title: 'Email Addresses',
      description: 'Upload a CSV file containing email addresses',
      icon: Mail,
      example: 'email@example.com',
    },
    {
      type: 'phones' as DataType,
      title: 'Phone Numbers',
      description: 'Upload a CSV file containing phone numbers',
      icon: Phone,
      example: '+1 (555) 123-4567',
    },
  ];

  const handleTypeSelect = (type: DataType) => {
    setLocalSelectedType(type);
  };

  const handleContinue = () => {
    setShowModal(true);
  };

  const proceedToUpload = () => {
    setShowModal(false);
    onSelect(localSelectedType);
  };

  return (
    <>
      <Card className="w-full max-w-[400px] sm:max-w-[600px] mx-auto shadow-lg">
        <CardHeader className="pb-6">
          <CardTitle className="text-center text-xl text-gray-800">Choose Data Type</CardTitle>
          <p className="text-center text-sm text-gray-600 mt-2">
            What type of data are you uploading?
          </p>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <div className="space-y-4">
            {dataTypes.map(({ type, title, description, icon: Icon, example }) => (
              <Button
                key={type}
                variant={localSelectedType === type ? 'default' : 'outline'}
                className={`w-full h-auto p-6 flex flex-col items-start text-left ${
                  localSelectedType === type 
                    ? 'bg-gray-800 text-white border-gray-800 hover:bg-gray-900' 
                    : 'border-gray-300 hover:border-gray-400 text-gray-700'
                }`}
                onClick={() => handleTypeSelect(type)}
              >
                <div className="flex items-center gap-4 w-full">
                  <Icon className="h-8 w-8 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{title}</h3>
                    <p className="text-sm opacity-80 mt-2">{description}</p>
                    <p className="text-xs opacity-60 mt-2">Example: {example}</p>
                  </div>
                </div>
              </Button>
            ))}
            
            <div className="flex gap-4 mt-8">
              {canGoBack && onBack && (
                <Button 
                  variant="outline" 
                  onClick={onBack}
                  className="flex items-center gap-2 h-12 px-6 border-gray-400 text-gray-700 hover:bg-gray-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Button>
              )}
              <Button 
                onClick={handleContinue} 
                className={`flex items-center gap-2 h-12 px-6 ${canGoBack ? 'flex-1' : 'w-full'} bg-gray-800 hover:bg-gray-900 text-white`}
                disabled={!localSelectedType}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>CSV format requirements</DialogTitle>
            <DialogDescription>
              Your CSV must include at least two columns: user name and {localSelectedType === 'emails' ? 'email' : 'phone'}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              <p>Accepted header variants are flexible. Common examples:</p>
              <ul className="list-disc list-inside mt-2">
                <li><strong>Name</strong>: name, full_name, first_name + last_name</li>
                <li><strong>{localSelectedType === 'emails' ? 'Email' : 'Phone'}</strong>: {localSelectedType === 'emails' ? 'email, email_address, user_email' : 'phone, phone_number, mobile, msisdn, tel'}</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Example CSV</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>name</TableHead>
                    <TableHead>{localSelectedType === 'emails' ? 'email' : 'phone'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Jane Doe</TableCell>
                    <TableCell>{localSelectedType === 'emails' ? 'jane@example.com' : '+1 415 555 2671'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>John Smith</TableCell>
                    <TableCell>{localSelectedType === 'emails' ? 'john@company.com' : '(020) 7946 0958'}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="text-xs text-gray-500">
              <p>Tips:</p>
              <ul className="list-disc list-inside mt-1">
                <li>First row must be headers</li>
                <li>No empty rows</li>
                <li>UTF-8 encoding recommended</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={proceedToUpload}>I understand, continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}