import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PaddleProvider } from "@/components/PaddleProvider";

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
  description: "Process your data with secure payment processing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Paddle.js script - loaded early for better performance */}
        <script 
          src="https://cdn.paddle.com/paddle/v2/paddle.js" 
          async
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PaddleProvider>
          {children}
        </PaddleProvider>
      </body>
    </html>
  );
}
