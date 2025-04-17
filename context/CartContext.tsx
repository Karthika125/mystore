'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product } from "@/types";
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  // Generate storage key based on user ID or use guest key
  const storageKey = user ? `cart_${user.id}` : 'cart_guest';

  // Load cart from localStorage on initial load and when user changes
  useEffect(() => {
    const loadCart = () => {
      const savedCart = localStorage.getItem(storageKey);
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          setCartItems(parsedCart);
          console.log('Loaded cart:', { storageKey, items: parsedCart });
        } catch (error) {
          console.error('Failed to parse cart from localStorage:', error);
          localStorage.removeItem(storageKey);
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
    };

    loadCart();
  }, [storageKey]); // Re-run when user changes (storageKey changes)

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    console.log('Saving cart:', { storageKey, items: cartItems });
    localStorage.setItem(storageKey, JSON.stringify(cartItems));
  }, [cartItems, storageKey]);

  // Transfer guest cart to user cart on login
  useEffect(() => {
    if (user) {
      const guestCart = localStorage.getItem('cart_guest');
      if (guestCart) {
        try {
          const parsedGuestCart = JSON.parse(guestCart);
          if (parsedGuestCart.length > 0) {
            setCartItems(prevItems => {
              // Merge guest cart with user cart, avoiding duplicates
              const newItems = [...prevItems];
              parsedGuestCart.forEach((guestItem: CartItem) => {
                const existingItemIndex = newItems.findIndex(
                  item => item.product.id === guestItem.product.id
                );
                if (existingItemIndex >= 0) {
                  newItems[existingItemIndex].quantity += guestItem.quantity;
                } else {
                  newItems.push(guestItem);
                }
              });
              return newItems;
            });
            // Clear guest cart after merging
            localStorage.removeItem('cart_guest');
          }
        } catch (error) {
          console.error('Failed to merge guest cart:', error);
        }
      }
    }
  }, [user]);

  const addToCart = (product: Product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.inventory_count) {
          toast({
            title: "Inventory limit reached",
            description: `Sorry, only ${product.inventory_count} items available`,
            variant: "destructive"
          });
          return prevItems;
        }
        
        const updatedItems = prevItems.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: newQuantity }
            : item
        );
        return updatedItems;
      } else {
        if (quantity > product.inventory_count) {
          toast({
            title: "Inventory limit reached",
            description: `Sorry, only ${product.inventory_count} items available`,
            variant: "destructive"
          });
          return prevItems;
        }
        
        toast({
          title: "Added to cart",
          description: `${product.name} added to your cart`,
        });
        return [...prevItems, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId));
    toast({
      title: "Removed from cart",
      description: "Item removed from your cart",
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCartItems(prevItems => {
      return prevItems.map(item => {
        if (item.product.id === productId) {
          // Check inventory before updating
          if (quantity > item.product.inventory_count) {
            toast({
              title: "Inventory limit reached",
              description: `Sorry, only ${item.product.inventory_count} items available`,
              variant: "destructive"
            });
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
} 