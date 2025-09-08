'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserDetails } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface UserDetailsFormProps {
  onSubmit: (details: UserDetails) => void;
  initialData?: UserDetails;
  onBack?: () => void;
  canGoBack?: boolean;
}

export function UserDetailsForm({ onSubmit, initialData, onBack, canGoBack }: UserDetailsFormProps) {
  const [formData, setFormData] = useState<UserDetails>(initialData || {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const [errors, setErrors] = useState<Partial<UserDetails>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<UserDetails> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof UserDetails, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Card className="w-full max-w-[400px] sm:max-w-[600px] mx-auto shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-center text-lg text-gray-800">Personal Details</CardTitle>
        <p className="text-center text-sm text-gray-600 mt-1">
          Please provide your contact information
        </p>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name *</Label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={`h-10 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name *</Label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className={`h-10 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`h-10 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`h-10 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>


          <div className="flex gap-3 pt-3">
            {canGoBack && onBack && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={onBack}
                className="flex items-center gap-2 h-10 px-4 border-gray-400 text-gray-700 hover:bg-gray-50"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
            )}
            <Button 
              type="submit" 
              className={`flex items-center gap-2 h-10 px-4 ${canGoBack ? 'flex-1' : 'w-full'} bg-gray-800 hover:bg-gray-900 text-white`}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}