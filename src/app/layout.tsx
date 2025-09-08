import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PayPalProvider } from '@/components/PayPalProvider';
import { EnvDebug } from '@/components/EnvDebug';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Enreached - Data Processing",
  description: "Process your data with our secure approval system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PayPalProvider>
          {children}
          <EnvDebug />
        </PayPalProvider>
      </body>
    </html>
  );
}
