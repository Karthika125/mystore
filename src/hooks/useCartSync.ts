'use client';

import { useEffect } from 'react';
import { useSupabase } from '@/lib/supabase/supabase-provider';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/context/CartContext';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export function useCartSync() {
  const { supabase } = useSupabase();
  const { user } = useAuth();
  const { items, setItems } = useCart();

  // Sync with Supabase when user logs in
  useEffect(() => {
    async function syncWithSupabase() {
      if (!user) return;

      try {
        // Get cart items from Supabase
        const { data, error } = await supabase
          .from('cart_items')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;

        // Merge local cart with Supabase cart
        if (data && data.length > 0) {
          const mergedItems = [...items];
          data.forEach((dbItem: CartItem) => {
            const existingItem = mergedItems.find(item => item.id === dbItem.id);
            if (!existingItem) {
              mergedItems.push(dbItem);
            }
          });
          setItems(mergedItems);
        } else {
          // Upload local cart to Supabase
          if (items.length > 0) {
            const { error: upsertError } = await supabase
              .from('cart_items')
              .upsert(
                items.map(item => ({
                  user_id: user.id,
                  ...item
                }))
              );
            if (upsertError) throw upsertError;
          }
        }
      } catch (err) {
        console.error('Error syncing cart with Supabase:', err);
      }
    }

    syncWithSupabase();
  }, [user, supabase, items, setItems]);

  return null;
} 