'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useUserOrders } from '@/hooks/useOrders';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

export default function OrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { data: orders, isLoading } = useUserOrders(user?.id);

  useEffect(() => {
    if (!user) {
      router.push('/auth');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading your orders...</span>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>

      {orders && orders.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">No orders found</h2>
          <p className="text-gray-500 mb-6">You haven't placed any orders yet</p>
          <button 
            onClick={() => router.push('/products')}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders?.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50 px-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Order placed on {new Date(order.created_at).toLocaleDateString()}</p>
                    <CardTitle className="text-lg mt-1">Order #{order.id.substring(0, 8)}</CardTitle>
                  </div>
                  <Badge className={`capitalize ${getStatusColor(order.status)}`}>
                    {order.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-4 py-2 border-b last:border-0">
                      <div className="flex-1">
                        <h3 className="font-medium">{item.product_name}</h3>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <div className="font-medium">{formatCurrency(item.product_price)}</div>
                    </div>
                  ))}
                  <div className="flex justify-between pt-4 border-t">
                    <span className="font-bold">Total</span>
                    <span className="font-bold">{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 