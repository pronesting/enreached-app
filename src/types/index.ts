export interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export type DataType = 'emails' | 'phones';

export interface CsvData {
  file: File;
  recordCount: number;
  preview: any[];
}

export interface InvoiceData {
  userDetails: UserDetails;
  dataType: DataType;
  recordCount: number;
  pricePerRecord: number;
  totalAmount: number;
}

export type Step = 'details' | 'dataType' | 'upload' | 'review' | 'checkout' | 'success' | 'failed';

