import { Link } from 'react-router-dom';
import { ShoppingBag, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import CartItemComponent from '@/components/CartItem';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';

export default function CartPage() {
  const { cartItems, cartTotal, cartCount } = useCart();
  const { user } = useAuth();
  
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-lg font-medium">Your cart is empty</h2>
          <p className="mt-2 text-gray-500">Looks like you haven't added anything to your cart yet.</p>
          <div className="mt-8">
            <Link to="/products">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {/* Cart Items */}
            <div>
              {cartItems.map((item) => (
                <CartItemComponent key={item.product.id} item={item} />
              ))}
            </div>
          </div>
          
          <div>
            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-6 border">
              <h2 className="text-lg font-medium mb-4">Order Summary</h2>
              
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal ({cartCount} {cartCount === 1 ? 'item' : 'items'})</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatCurrency(cartTotal * 0.1)}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(cartTotal + (cartTotal * 0.1))}</span>
                </div>
              </div>
              
              {!user ? (
                <div className="mt-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
                    <div className="flex">
                      <AlertCircle className="h-5 w-5 text-yellow-400" />
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">Sign in to checkout</h3>
                        <p className="mt-1 text-sm text-yellow-700">You need to be logged in to complete your purchase.</p>
                      </div>
                    </div>
                  </div>
                  
                  <Link to="/auth?redirect=/checkout">
                    <Button className="w-full">Sign In to Continue</Button>
                  </Link>
                </div>
              ) : (
                <div className="mt-6">
                  <Link to="/checkout">
                    <Button className="w-full" size="lg">
                      Proceed to Checkout
                    </Button>
                  </Link>
                </div>
              )}
              
              <div className="mt-4">
                <Link to="/products">
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
