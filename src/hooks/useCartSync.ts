'use client';

import { useEffect } from 'react';
import { useSupabase } from '@/lib/supabase/supabase-provider';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/context/CartContext';
import { toast } from '@/hooks/use-toast';

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
  const { items, setItems, setError, setIsLoading } = useCart();

  // Sync with Supabase when user changes
  useEffect(() => {
    let isMounted = true;
    
    async function syncWithSupabase() {
      // Only proceed if the component is still mounted
      if (!isMounted) return;
      
      if (!user) {
        // Not logged in, we can just use localStorage cart
        console.log('User not logged in, using localStorage cart');
        setIsLoading(false);
        return;
      }

      try {
        console.log('User is logged in, syncing cart with Supabase...');
        setIsLoading(true);
        
        // Get cart items from Supabase
        const { data, error } = await supabase
          .from('cart_items')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching cart from Supabase:', error);
          setError('Failed to load your cart. Please try again.');
          return;
        }

        if (isMounted) {
          if (data && data.length > 0) {
            console.log('Found cart items in Supabase, merging with local cart');
            
            // Convert localStorage cart to a map for easier lookup
            const localItems = new Map(items.map(item => [item.id, item]));
            
            // Process Supabase items, keeping any local items with higher quantity
            const mergedItems = data.map((dbItem: CartItem) => {
              const localItem = localItems.get(dbItem.id);
              
              // If local quantity is higher, use it; otherwise use DB quantity
              if (localItem && localItem.quantity > dbItem.quantity) {
                return { ...dbItem, quantity: localItem.quantity };
              }
              
              return dbItem;
            });
            
            // Add any local items not in Supabase
            const dbItemIds = new Set(data.map((item: CartItem) => item.id));
            const localOnlyItems = items.filter(item => !dbItemIds.has(item.id));
            
            // Set the final merged cart
            setItems([...mergedItems, ...localOnlyItems]);
            
            // Upload any local-only items or quantity changes to Supabase
            if (localOnlyItems.length > 0 || items.some(item => {
              const dbItem = data.find((db: CartItem) => db.id === item.id);
              return dbItem && item.quantity > dbItem.quantity;
            })) {
              console.log('Syncing local cart changes to Supabase');
              syncLocalToSupabase([...mergedItems, ...localOnlyItems], user.id);
            }
          } else if (items.length > 0) {
            // No items in Supabase but we have local items - upload them
            console.log('No cart in Supabase, uploading local cart');
            syncLocalToSupabase(items, user.id);
          } else {
            console.log('No cart items in Supabase or localStorage');
          }
          
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error syncing cart with Supabase:', err);
        if (isMounted) {
          setError('Failed to sync your cart. Please try again.');
          setIsLoading(false);
        }
      }
    }
    
    async function syncLocalToSupabase(itemsToSync: CartItem[], userId: string) {
      try {
        // Format items for Supabase
        const formattedItems = itemsToSync.map(item => ({
          user_id: userId,
          ...item
        }));
        
        const { error } = await supabase.from('cart_items').upsert(
          formattedItems,
          { onConflict: 'user_id,id' }
        );
        
        if (error) {
          console.error('Error syncing cart to Supabase:', error);
          toast({
            title: 'Cart sync error',
            description: 'Failed to save your cart to the cloud',
            variant: 'destructive',
          });
        }
      } catch (err) {
        console.error('Error in syncLocalToSupabase:', err);
      }
    }

    syncWithSupabase();
    
    return () => {
      isMounted = false;
    };
  }, [user, supabase]);

  // Also sync when items change (if logged in)
  useEffect(() => {
    if (!user || items.length === 0) return;
    
    const syncCartChanges = async () => {
      try {
        console.log('Items changed, syncing to Supabase...');
        
        // Format items for Supabase
        const formattedItems = items.map(item => ({
          user_id: user.id,
          ...item
        }));
        
        // First delete any existing items for this user
        await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id);
        
        // Then insert the new cart state
        if (items.length > 0) {
          const { error } = await supabase
            .from('cart_items')
            .insert(formattedItems);
          
          if (error) {
            console.error('Error syncing cart to Supabase:', error);
          } else {
            console.log('Cart synced to Supabase successfully');
          }
        }
      } catch (err) {
        console.error('Error syncing cart changes:', err);
      }
    };
    
    // Use a debounce to avoid excessive Supabase calls
    const timeoutId = setTimeout(syncCartChanges, 1000);
    return () => clearTimeout(timeoutId);
  }, [items, user, supabase]);

  return null;
} 