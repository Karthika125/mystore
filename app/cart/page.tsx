'use client';

import { useEffect } from 'react';
import { useCart } from '@/hooks/useCart';
import CartItem from '@/components/CartItem';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { items, isLoading, error } = useCart();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold mb-4">Unable to load cart</h2>
        <p className="text-gray-600 mb-4">There was a problem loading your cart items.</p>
        <Button onClick={() => router.refresh()}>Try Again</Button>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <Button onClick={() => router.push('/products')}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      <div className="space-y-4">
        {items.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>
      <div className="mt-8 flex justify-between items-center">
        <div className="text-xl font-semibold">
          Total: ${items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}
        </div>
        <Button onClick={() => router.push('/checkout')}>
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
} 