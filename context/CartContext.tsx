'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase, verifyDatabaseSetup } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

type CartItem = {
  id: string;
  quantity: number;
  price: number;
  name: string;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  isLoading: boolean;
  cartCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Calculate cart count
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  // Load cart data when component mounts or user changes
  useEffect(() => {
    let isMounted = true;
    
    const loadCart = async () => {
      if (!isMounted) return;
      
      setIsLoading(true);
      console.log('Loading cart, auth state:', user ? 'authenticated' : 'guest');
      
      try {
        if (user) {
          // Load from Supabase if user is logged in
          const { data, error } = await supabase
            .from('cart_items')
            .select('*')
            .eq('user_id', user.id);
          
          if (error) {
            console.error('Supabase error:', error);
            throw error;
          }
          
          console.log('Cart data from Supabase:', data);
          
          if (data) {
            const transformedData = data.map(item => ({
              id: item.product_id,
              name: item.name,
              price: item.price,
              quantity: item.quantity
            }));
            
            if (isMounted) {
              console.log('Setting cart items:', transformedData);
              setItems(transformedData);
            }
          } else {
            if (isMounted) setItems([]);
          }
        } else {
          // Load from localStorage if guest
          const savedCart = localStorage.getItem('guestCart');
          console.log('Guest cart from localStorage:', savedCart);
          
          if (savedCart) {
            const parsedCart = JSON.parse(savedCart);
            if (Array.isArray(parsedCart) && isMounted) {
              console.log('Setting guest cart items:', parsedCart);
              setItems(parsedCart);
            }
          } else if (isMounted) {
            setItems([]);
          }
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        if (isMounted) {
          setItems([]);
          toast({
            title: "Error loading cart",
            description: "There was a problem loading your cart. Please try again.",
            variant: "destructive"
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCart();
    
    return () => {
      isMounted = false;
    };
  }, [user]);

  const saveCartData = async (newItems: CartItem[]) => {
    console.log('Saving cart data:', { user: user?.id, items: newItems });
    
    try {
      if (user) {
        // Delete existing items
        const { error: deleteError } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id);

        if (deleteError) {
          console.error('Error deleting cart items:', deleteError);
          throw deleteError;
        }

        // Insert new items if any
        if (newItems.length > 0) {
          const { error: insertError } = await supabase
            .from('cart_items')
            .insert(
              newItems.map(item => ({
                user_id: user.id,
                product_id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity
              }))
            );

          if (insertError) {
            console.error('Error inserting cart items:', insertError);
            throw insertError;
          }
        }
        
        console.log('Cart saved to Supabase successfully');
      } else {
        localStorage.setItem('guestCart', JSON.stringify(newItems));
        console.log('Cart saved to localStorage successfully');
      }
      
      setItems(newItems);
    } catch (error) {
      console.error('Error saving cart:', error);
      toast({
        title: "Error saving cart",
        description: "There was a problem saving your cart items.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const addItem = async (item: CartItem) => {
    try {
      console.log('Adding item to cart:', item);
      
      const newItems = [...items];
      const existingItemIndex = newItems.findIndex(i => i.id === item.id);
      
      if (existingItemIndex >= 0) {
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + (item.quantity || 1)
        };
      } else {
        newItems.push({ ...item, quantity: item.quantity || 1 });
      }
      
      await saveCartData(newItems);
      
      toast({
        title: "Added to cart",
        description: `${item.name} has been added to your cart.`
      });
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast({
        title: "Error adding item",
        description: "There was a problem adding the item to your cart.",
        variant: "destructive"
      });
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      setItems(currentItems => {
        const newItems = currentItems.filter(item => item.id !== itemId);
        saveCartData(newItems);
        return newItems;
      });

      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart."
      });
    } catch (error) {
      console.error('Error removing item from cart:', error);
      toast({
        title: "Error removing item",
        description: "There was a problem removing the item from your cart.",
        variant: "destructive"
      });
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      setItems(currentItems => {
        const newItems = currentItems.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        );
        saveCartData(newItems);
        return newItems;
      });

      toast({
        title: "Cart updated",
        description: "Item quantity has been updated."
      });
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast({
        title: "Error updating quantity",
        description: "There was a problem updating the item quantity.",
        variant: "destructive"
      });
    }
  };

  const clearCart = async () => {
    try {
      setItems([]);
      await saveCartData([]);
      
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart."
      });
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast({
        title: "Error clearing cart",
        description: "There was a problem clearing your cart.",
        variant: "destructive"
      });
    }
  };

  return (
    <CartContext.Provider value={{ 
      items, 
      addItem, 
      removeItem, 
      clearCart, 
      updateQuantity,
      isLoading,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 