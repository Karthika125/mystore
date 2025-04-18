import { useState, useEffect } from 'react';
import { useSupabase } from '@/lib/supabase/supabase-provider';
import { useAuth } from '@/hooks/useAuth';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { supabase } = useSupabase();
  const { user } = useAuth();

  // Load cart items
  useEffect(() => {
    async function loadCartItems() {
      try {
        setIsLoading(true);
        setError(null);

        if (!user) {
          // Load from localStorage for guest users
          const savedCart = localStorage.getItem('guestCart');
          if (savedCart) {
            setItems(JSON.parse(savedCart));
          }
          setIsLoading(false);
          return;
        }

        // Load from database for logged-in users
        const { data, error } = await supabase
          .from('cart_items')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;

        setItems(data || []);
      } catch (err) {
        console.error('Error loading cart:', err);
        setError(err instanceof Error ? err : new Error('Failed to load cart'));
      } finally {
        setIsLoading(false);
      }
    }

    loadCartItems();
  }, [user, supabase]);

  // Save cart items
  const saveCartItems = async (newItems: CartItem[]) => {
    try {
      if (!user) {
        // Save to localStorage for guest users
        localStorage.setItem('guestCart', JSON.stringify(newItems));
        return;
      }

      // Save to database for logged-in users
      const { error } = await supabase
        .from('cart_items')
        .upsert(
          newItems.map(item => ({
            user_id: user.id,
            ...item
          }))
        );

      if (error) throw error;
    } catch (err) {
      console.error('Error saving cart:', err);
      throw err;
    }
  };

  // Add item to cart
  const addItem = async (item: CartItem) => {
    try {
      const existingItem = items.find(i => i.id === item.id);
      const newItems = existingItem
        ? items.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...items, { ...item, quantity: 1 }];

      setItems(newItems);
      await saveCartItems(newItems);
    } catch (err) {
      console.error('Error adding item:', err);
      setError(err instanceof Error ? err : new Error('Failed to add item'));
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      if (quantity < 1) return;
      
      const newItems = items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );

      setItems(newItems);
      await saveCartItems(newItems);
    } catch (err) {
      console.error('Error updating quantity:', err);
      setError(err instanceof Error ? err : new Error('Failed to update quantity'));
    }
  };

  // Remove item from cart
  const removeItem = async (itemId: string) => {
    try {
      const newItems = items.filter(item => item.id !== itemId);
      
      setItems(newItems);
      await saveCartItems(newItems);

      if (user) {
        // Also remove from database if user is logged in
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id)
          .eq('id', itemId);

        if (error) throw error;
      }
    } catch (err) {
      console.error('Error removing item:', err);
      setError(err instanceof Error ? err : new Error('Failed to remove item'));
    }
  };

  return {
    items,
    isLoading,
    error,
    addItem,
    updateQuantity,
    removeItem
  };
} 