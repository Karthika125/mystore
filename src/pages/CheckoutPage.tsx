import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postalCode: z.string().min(5, 'Postal code is required'),
  country: z.string().min(2, 'Country is required'),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: user?.email || '',
    },
  });

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const onSubmit = async (data: CheckoutFormValues) => {
    setIsProcessing(true);
    
    try {
      // Create a payment session
      const { data: paymentData, error: paymentError } = await supabase.functions.invoke('create-payment', {
        body: {
          amount: cartTotal + (cartTotal * 0.1),
          items: cartItems.map(item => ({
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity
          }))
        },
      });
      
      if (paymentError) {
        throw new Error(paymentError.message);
      }
      
      if (paymentData?.url) {
        // Redirect to Stripe Checkout
        window.location.href = paymentData.url;
      } else {
        // For this demonstration, we'll simulate a successful payment and show the success step
        setStep(2);
        setTimeout(() => {
          setStep(3);
          clearCart();
        }, 2000);
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Failed',
        description: 'There was an error processing your payment.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
              step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {step > 1 ? <Check className="h-5 w-5" /> : '1'}
            </div>
            <span className="ml-2 font-medium">Shipping Information</span>
          </div>
          <div className="h-0.5 flex-1 mx-4 bg-gray-200">
          </div>
          <div className="flex items-center">
            <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
              step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {step > 2 ? <Check className="h-5 w-5" /> : '2'}
            </div>
            <span className="ml-2 font-medium">Payment</span>
          </div>
          <div className="h-0.5 flex-1 mx-4 bg-gray-200">
          </div>
          <div className="flex items-center">
            <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
              step >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {step > 3 ? <Check className="h-5 w-5" /> : '3'}
            </div>
            <span className="ml-2 font-medium">Confirmation</span>
          </div>
        </div>
      </div>
      
      {step === 1 && (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg p-6 border">
              <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium mb-1">
                    Full Name
                  </label>
                  <Input 
                    id="fullName"
                    {...register('fullName')} 
                    error={!!errors.fullName}
                  />
                  {errors.fullName && (
                    <p className="text-sm text-red-500 mt-1">{errors.fullName.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email Address
                  </label>
                  <Input 
                    id="email"
                    type="email"
                    {...register('email')} 
                    error={!!errors.email}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium mb-1">
                    Street Address
                  </label>
                  <Input 
                    id="address"
                    {...register('address')} 
                    error={!!errors.address}
                  />
                  {errors.address && (
                    <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium mb-1">
                      City
                    </label>
                    <Input 
                      id="city"
                      {...register('city')} 
                      error={!!errors.city}
                    />
                    {errors.city && (
                      <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium mb-1">
                      State / Province
                    </label>
                    <Input 
                      id="state"
                      {...register('state')} 
                      error={!!errors.state}
                    />
                    {errors.state && (
                      <p className="text-sm text-red-500 mt-1">{errors.state.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium mb-1">
                      Postal Code
                    </label>
                    <Input 
                      id="postalCode"
                      {...register('postalCode')} 
                      error={!!errors.postalCode}
                    />
                    {errors.postalCode && (
                      <p className="text-sm text-red-500 mt-1">{errors.postalCode.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium mb-1">
                      Country
                    </label>
                    <Input 
                      id="country"
                      {...register('country')} 
                      error={!!errors.country}
                    />
                    {errors.country && (
                      <p className="text-sm text-red-500 mt-1">{errors.country.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button type="submit" className="w-full" disabled={isProcessing} size="lg">
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing
                      </>
                    ) : (
                      'Continue to Payment'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
          
          <div>
            <div className="bg-gray-50 rounded-lg p-6 border sticky top-20">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex justify-between">
                    <div>
                      <span className="font-medium">{item.quantity}x </span>
                      <span className="text-gray-600">{item.product.name}</span>
                    </div>
                    <span>{formatCurrency(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Tax (10%)</span>
                  <span>{formatCurrency(cartTotal * 0.1)}</span>
                </div>
                
                <div className="flex justify-between text-base font-semibold pt-2">
                  <span>Total</span>
                  <span>{formatCurrency(cartTotal + (cartTotal * 0.1))}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {step === 2 && (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <h2 className="text-xl font-semibold">Processing Your Payment</h2>
          <p className="text-gray-500 mt-2">Please wait while we process your payment.</p>
        </div>
      )}
      
      {step === 3 && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="rounded-full bg-green-100 p-3 mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold">Payment Successful!</h2>
          <p className="text-gray-500 mt-2 mb-8 text-center">
            Thank you for your purchase. Your order has been confirmed.
          </p>
          <div className="flex gap-4">
            <Button onClick={() => navigate('/orders')}>
              View Your Orders
            </Button>
            <Button variant="outline" onClick={() => navigate('/products')}>
              Continue Shopping
            </Button>
          </div>
        </div>
      )}
    </Layout>
  );
}
