import Layout from '@/components/Layout';
import { Providers } from './providers';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import './globals.css';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mystore",
  description: "Your one-stop destination for all your shopping needs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AuthProvider>
            <CartProvider>
              <Layout>
                {children}
                <Toaster />
              </Layout>
            </CartProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
} 