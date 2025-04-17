'use client';

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Layout from '@/components/Layout';
import { CartProvider } from '@/context/CartContext';
import { Toaster } from '@/components/ui/toaster';


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mystore",
  description: "Your one-stop shop for all your needs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <Providers>
            <Layout>{children}</Layout>
          </Providers>
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
} 