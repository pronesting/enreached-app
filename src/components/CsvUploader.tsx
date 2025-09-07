'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataType, CsvData } from '@/types';
import { Upload, CheckCircle, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import Papa from 'papaparse';

interface CsvUploaderProps {
  onUpload: (data: CsvData) => void;
  dataType: DataType;
  onBack?: () => void;
  canGoBack?: boolean;
}

export function CsvUploader({ onUpload, dataType, onBack, canGoBack }: CsvUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [recordCount, setRecordCount] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [detectedColumn, setDetectedColumn] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const normalizeKey = (key: string) => key.toLowerCase().replace(/[^a-z0-9]/g, '');

  const emailAliases = new Set([
    'email', 'emails', 'e_mail', 'eemails', 'mail', 'emailaddress', 'emailid', 'useremail', 'contactemail'
  ].map(normalizeKey));

  const phoneAliases = new Set([
    'phone','phones','phonenumber','phone_no','phoneno','mobile','mobilephone','cell','cellphone','msisdn','tel','telephone','whatsapp','whatsappnumber','contact','contactnumber','contactno'
  ].map(normalizeKey));

  const looksLikeEmail = (value: unknown): boolean => {
    if (typeof value !== 'string') return false;
    const v = value.trim();
    if (!v) return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(v);
  };

  const looksLikePhone = (value: unknown): boolean => {
    if (value == null) return false;
    const digits = String(value).replace(/\D/g, '');
    return digits.length >= 7; // lenient threshold
  };

  const inferBestColumn = (rows: any[], type: DataType, headers: string[]): string | null => {
    // 1) Try alias match on headers
    const normalized = headers.map(h => ({ raw: h, norm: normalizeKey(h) }));
    const aliasSet = type === 'emails' ? emailAliases : phoneAliases;
    const aliasHit = normalized.find(h => aliasSet.has(h.norm));
    if (aliasHit) return aliasHit.raw;

    // 2) Heuristic by scanning first N rows for values
    const sampleCount = Math.min(rows.length, 50);
    let bestHeader: { header: string; hits: number } | null = null;

    for (const { raw } of normalized) {
      let hits = 0;
      for (let i = 0; i < sampleCount; i++) {
        const val = rows[i]?.[raw];
        if (type === 'emails' ? looksLikeEmail(val) : looksLikePhone(val)) {
          hits++;
        }
      }
      if (!bestHeader || hits > bestHeader.hits) {
        bestHeader = { header: raw, hits };
      }
    }

    if (bestHeader && bestHeader.hits > 0) return bestHeader.header;
    return null;
  };

  const handleFileSelect = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please select a CSV file');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSelectedFile(file);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setIsProcessing(false);
        
        if (results.errors.length > 0) {
          setError('Error parsing CSV file. Please check the format.');
          return;
        }

        const data = (results.data as any[]).filter(Boolean);
        const count = data.length;
        
        if (count === 0) {
          setError('CSV file appears to be empty or has no valid data');
          return;
        }

        const headers: string[] = Array.isArray((results as any).meta?.fields)
          ? (results as any).meta.fields
          : Object.keys(data[0] ?? {});

        const detected = inferBestColumn(data, dataType, headers);
        if (!detected) {
          setError(`CSV file should contain a column with ${dataType} data`);
          setDetectedColumn(null);
          return;
        }

        setDetectedColumn(detected);
        setRecordCount(count);
        setPreview(data.slice(0, 5));
      },
      error: (error) => {
        setIsProcessing(false);
        setError('Error reading file: ' + error.message);
      }
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleConfirm = () => {
    if (recordCount > 0 && selectedFile) {
      onUpload({
        file: selectedFile,
        recordCount,
        preview,
      });
    }
  };

  const resetUpload = () => {
    setError(null);
    setPreview([]);
    setRecordCount(0);
    setDetectedColumn(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Upload CSV File</CardTitle>
        <p className="text-center text-sm text-gray-600">
          Upload your {dataType} data file for processing
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {!recordCount ? (
          <div className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragOver 
                  ? 'border-black bg-gray-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Drop your CSV file here</h3>
              <p className="text-gray-600 mb-4">or click to browse</p>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Choose File'}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>
            
            {/* Back button for upload step */}
            {canGoBack && onBack && (
              <div className="flex justify-start">
                <Button 
                  variant="outline" 
                  onClick={onBack}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-800">File Uploaded Successfully</h3>
                <p className="text-sm text-green-600">
                  Found {recordCount.toLocaleString()} {dataType} records{detectedColumn ? ` (column: ${detectedColumn})` : ''}
                </p>
              </div>
            </div>

            {preview.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Preview (first 5 rows):</h4>
                <div className="border rounded-lg overflow-hidden">
                  <div className="max-h-40 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          {Object.keys(preview[0]).map((key) => (
                            <th key={key} className="px-3 py-2 text-left font-medium">
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {preview.map((row, index) => (
                          <tr key={index} className="border-t">
                            {Object.values(row).map((value: any, cellIndex) => (
                              <td key={cellIndex} className="px-3 py-2">
                                {String(value).substring(0, 50)}
                                {String(value).length > 50 ? '...' : ''}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
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
              <Button onClick={handleConfirm} className="flex-1">
                Next ({recordCount.toLocaleString()} records)
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
              <Button variant="outline" onClick={resetUpload}>
                Upload Different File
              </Button>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-6 w-6 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-800">Upload Error</h3>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>File requirements:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>CSV format (.csv extension)</li>
            <li>First row should contain column headers</li>
            <li>Must contain a column with {dataType} data</li>
            <li>Maximum file size: 10MB</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
