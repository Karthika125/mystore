'use client';

import Layout from '@/components/Layout';
import { CartProvider } from '@/context/CartContext';
import { Toaster } from '@/components/ui/toaster';
import SupabaseProvider from '@/lib/supabase/supabase-provider';
import { Providers } from '@/app/providers';
import { useCartSync } from '@/hooks/useCartSync';

function CartSyncWrapper({ children }: { children: React.ReactNode }) {
  useCartSync();
  return <>{children}</>;
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SupabaseProvider>
      <Providers>
        <CartProvider>
          <CartSyncWrapper>
            <Layout>{children}</Layout>
            <Toaster />
          </CartSyncWrapper>
        </CartProvider>
      </Providers>
    </SupabaseProvider>
  );
} 