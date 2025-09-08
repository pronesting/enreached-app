'use client';

import { env } from '@/lib/env';

export function EnvDebug() {
  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded text-xs max-w-sm">
      <h3 className="font-bold mb-2">Environment Debug:</h3>
      <div className="space-y-1">
        <div>NODE_ENV: {process.env.NODE_ENV}</div>
        <div>PAYPAL_CLIENT_ID: {process.env.PAYPAL_CLIENT_ID ? 'SET' : 'NOT SET'}</div>
        <div>PAYPAL_CLIENT_ID length: {process.env.PAYPAL_CLIENT_ID?.length || 0}</div>
        <div>PAYPAL_MODE: {process.env.PAYPAL_MODE}</div>
        <div>VERCEL: {process.env.VERCEL}</div>
        <div>VERCEL_URL: {process.env.VERCEL_URL}</div>
      </div>
    </div>
  );
}
