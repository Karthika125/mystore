'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  // Load cart items from localStorage
  useEffect(() => {
    try {
      setIsLoading(true);
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (err) {
      console.error('Error loading cart:', err);
      setError(err instanceof Error ? err : new Error('Failed to load cart'));
      toast({
        title: "Error loading cart",
        description: "There was a problem loading your cart items.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Save cart items to localStorage
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem('cart', JSON.stringify(items));
      } catch (err) {
        console.error('Error saving cart:', err);
        setError(err instanceof Error ? err : new Error('Failed to save cart'));
        toast({
          title: "Error saving cart",
          description: "There was a problem saving your cart items.",
          variant: "destructive",
        });
      }
    }
  }, [items, isLoading, toast]);

  // Add item to cart
  const addToCart = async (product: any) => {
    try {
      const cartItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.images?.[0]
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
    } catch (err) {
      console.error('Error adding item:', err);
      setError(err instanceof Error ? err : new Error('Failed to add item'));
      toast({
        title: "Error adding item",
        description: "There was a problem adding the item to your cart.",
        variant: "destructive",
      });
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
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
    } catch (err) {
      console.error('Error updating quantity:', err);
      setError(err instanceof Error ? err : new Error('Failed to update quantity'));
      toast({
        title: "Error updating quantity",
        description: "There was a problem updating the item quantity.",
        variant: "destructive",
      });
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId: string) => {
    try {
      const itemToRemove = items.find(item => item.id === itemId);
      setItems(items.filter(item => item.id !== itemId));
      
      if (itemToRemove) {
        toast({
          title: "Item removed",
          description: `${itemToRemove.name} removed from cart`,
        });
      }
    } catch (err) {
      console.error('Error removing item:', err);
      setError(err instanceof Error ? err : new Error('Failed to remove item'));
      toast({
        title: "Error removing item",
        description: "There was a problem removing the item from your cart.",
        variant: "destructive",
      });
    }
  };

  // Clear cart
  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cart');
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    });
  };

  return {
    items,
    setItems,
    isLoading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
  };
} 