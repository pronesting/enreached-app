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
