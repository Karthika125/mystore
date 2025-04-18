'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

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
  const { user } = useAuth();

  // Load cart items on mount and when user changes
  useEffect(() => {
    const loadCart = async () => {
      try {
        setIsLoading(true);
        console.log('🔍 Loading cart items...');

        if (user) {
          // Load from Supabase if user is logged in
          console.log('👤 User is logged in, fetching cart from Supabase...');
          const { data, error } = await supabase
            .from('cart_items')
            .select('*')
            .eq('user_id', user.id);

          if (error) throw error;

          setItems(data || []);
          console.log('✅ Loaded', data?.length || 0, 'items from Supabase cart');
        } else {
          // Load from localStorage if user is not logged in
          console.log('👤 No user logged in, loading from localStorage...');
          const savedCart = localStorage.getItem('cart');
          if (savedCart) {
            setItems(JSON.parse(savedCart));
            console.log('✅ Loaded', JSON.parse(savedCart).length, 'items from localStorage');
          }
        }
      } catch (err) {
        console.error('❌ Error loading cart:', err);
        setError(err instanceof Error ? err : new Error('Failed to load cart'));
        toast({
          title: "Error loading cart",
          description: "There was a problem loading your cart items.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, [user]);

  // Save cart items when they change
  useEffect(() => {
    const saveCart = async () => {
      if (isLoading) return;

      try {
        console.log('💾 Saving cart items...');
        if (user) {
          // Save to Supabase if user is logged in
          console.log('👤 User is logged in, saving to Supabase...');
          
          // First, clear existing items
          await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', user.id);

          // Then insert new items
          if (items.length > 0) {
            const { error } = await supabase
              .from('cart_items')
              .insert(items.map(item => ({
                ...item,
                user_id: user.id
              })));

            if (error) throw error;
          }
          
          console.log('✅ Saved', items.length, 'items to Supabase cart');
        } else {
          // Save to localStorage if user is not logged in
          console.log('👤 No user logged in, saving to localStorage...');
          localStorage.setItem('cart', JSON.stringify(items));
          console.log('✅ Saved', items.length, 'items to localStorage');
        }
      } catch (err) {
        console.error('❌ Error saving cart:', err);
        toast({
          title: "Error saving cart",
          description: "There was a problem saving your cart items.",
          variant: "destructive",
        });
      }
    };

    saveCart();
  }, [items, user, isLoading]);

  const addToCart = async (product: any) => {
    try {
      console.log('➕ Adding item to cart:', product.name);
      const cartItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image
      };

      const existingItem = items.find(i => i.id === cartItem.id);
      const newItems = existingItem
        ? items.map(i => i.id === cartItem.id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...items, cartItem];

      setItems(newItems);
      toast({
        title: existingItem ? "Quantity updated" : "Item added",
        description: existingItem 
          ? `Increased quantity of ${cartItem.name}`
          : `${cartItem.name} added to cart`,
      });
      console.log('✅ Successfully added/updated item in cart');
    } catch (err) {
      console.error('❌ Error adding item:', err);
      setError(err instanceof Error ? err : new Error('Failed to add item'));
      toast({
        title: "Error adding item",
        description: "There was a problem adding the item to your cart.",
        variant: "destructive",
      });
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      console.log('🔄 Updating quantity for item:', itemId);
      if (quantity < 1) {
        setItems(items.filter(item => item.id !== itemId));
        return;
      }
      
      setItems(items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      ));

      const updatedItem = items.find(item => item.id === itemId);
      if (updatedItem) {
        toast({
          title: "Quantity updated",
          description: `Updated quantity of ${updatedItem.name} to ${quantity}`,
        });
      }
      console.log('✅ Successfully updated quantity');
    } catch (err) {
      console.error('❌ Error updating quantity:', err);
      setError(err instanceof Error ? err : new Error('Failed to update quantity'));
      toast({
        title: "Error updating quantity",
        description: "There was a problem updating the item quantity.",
        variant: "destructive",
      });
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      console.log('🗑️ Removing item from cart:', itemId);
      const itemToRemove = items.find(item => item.id === itemId);
      setItems(items.filter(item => item.id !== itemId));
      
      if (itemToRemove) {
        toast({
          title: "Item removed",
          description: `${itemToRemove.name} removed from cart`,
        });
      }
      console.log('✅ Successfully removed item from cart');
    } catch (err) {
      console.error('❌ Error removing item:', err);
      setError(err instanceof Error ? err : new Error('Failed to remove item'));
      toast({
        title: "Error removing item",
        description: "There was a problem removing the item from your cart.",
        variant: "destructive",
      });
    }
  };

  const clearCart = () => {
    console.log('🧹 Clearing cart...');
    setItems([]);
    if (!user) {
      localStorage.removeItem('cart');
    }
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    });
    console.log('✅ Cart cleared successfully');
  };

  // Calculate the total number of items in the cart
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);
  
  // Calculate the total price of all items in the cart
  const cartTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  return {
    items,
    setItems,
    isLoading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartCount,
    cartTotal
  };
} 