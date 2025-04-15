
import { Link } from 'react-router-dom';
import { useUserOrders } from '@/hooks/useOrders';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency, formatDate } from '@/lib/utils';
import Layout from '@/components/Layout';
import { Package, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OrdersPage() {
  const { user } = useAuth();
  const { data: orders, isLoading } = useUserOrders(user?.id);

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !orders || orders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-lg font-medium">No orders yet</h2>
          <p className="mt-2 text-gray-500">Once you place an order, it will appear here.</p>
          <div className="mt-8">
            <Link to="/products">
              <Button>Start Shopping</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">
                    Order placed <time dateTime={order.created_at}>{formatDate(order.created_at)}</time>
                  </p>
                  <p className="text-sm font-medium">Order #{order.id.substring(0, 8)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="font-medium">{formatCurrency(order.total)}</p>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className={`inline-block h-2 w-2 rounded-full mr-2 ${
                      order.status === 'delivered' ? 'bg-green-500' : 
                      order.status === 'shipped' ? 'bg-blue-500' : 
                      order.status === 'processing' ? 'bg-yellow-500' : 
                      order.status === 'cancelled' ? 'bg-red-500' : 'bg-gray-500'
                    }`}></span>
                    <span className="font-medium capitalize">{order.status}</span>
                  </div>
                </div>
                
                <div className="divide-y">
                  {order.items.map((item) => (
                    <div key={item.product_id} className="py-4 flex justify-between">
                      <div>
                        <p className="font-medium">{item.product_name}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <p>{formatCurrency(item.product_price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
