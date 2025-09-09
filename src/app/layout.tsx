import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";
import { PayPalProvider } from '@/components/PayPalProvider';
import { EnvDebug } from '@/components/EnvDebug';

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Enreached | Verified Phone & Email Enrichment for Real Estate Skip Tracing",
  description: "Turn skip-traced lists into ROI-ready data with Enreached. We verify, score, and enrich phone numbers and emails so you reach real sellers, cut wasted dials, and close more deals.",
  keywords: "real estate skip tracing, phone number verification, email enrichment, data verification, real estate leads, skip trace data, phone validation, email validation, real estate marketing",
  authors: [{ name: "Enreached" }],
  creator: "Enreached",
  publisher: "Enreached",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://app.enreached.co'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Enreached | Verified Phone & Email Enrichment for Real Estate Skip Tracing",
    description: "Turn skip-traced lists into ROI-ready data with Enreached. We verify, score, and enrich phone numbers and emails so you reach real sellers, cut wasted dials, and close more deals.",
    url: 'https://app.enreached.co',
    siteName: 'Enreached',
    images: [
      {
        url: '/Social img.png',
        width: 1200,
        height: 630,
        alt: 'Enreached - Verified Phone & Email Enrichment for Real Estate Skip Tracing',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Enreached | Verified Phone & Email Enrichment for Real Estate Skip Tracing",
    description: "Turn skip-traced lists into ROI-ready data with Enreached. We verify, score, and enrich phone numbers and emails so you reach real sellers, cut wasted dials, and close more deals.",
    images: ['/Social img.png'],
    creator: '@enreached',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Add your Google Search Console verification code
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/Favicon to vercel.png" type="image/png" />
        <link rel="apple-touch-icon" href="/Favicon to vercel.png" />
        <meta name="theme-color" content="#1976d2" />
      </head>
      <body
        className={`${urbanist.variable} antialiased`}
      >
        <PayPalProvider>
          {children}
          <EnvDebug />
        </PayPalProvider>
      </body>
    </html>
  );
}
