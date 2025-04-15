
import { useState } from 'react';
import { Loader2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useOrders, useUpdateOrderStatus } from '@/hooks/useOrders';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Order } from '@/types';

export default function AdminOrders() {
  const { data: orders, isLoading } = useOrders();
  const updateOrderStatus = useUpdateOrderStatus();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [search, setSearch] = useState('');

  const handleViewOrder = (order: Order) => {
    setCurrentOrder(order);
    setIsDialogOpen(true);
  };

  const handleUpdateStatus = (status: Order['status']) => {
    if (currentOrder) {
      updateOrderStatus.mutate({
        orderId: currentOrder.id,
        status
      });
    }
  };

  const filteredOrders = orders?.filter(order => 
    order.id.includes(search.toLowerCase())
  );

  const getStatusBadgeColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-green-600 text-white';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Order Management</h1>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <Input
            placeholder="Search by order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />
        </div>
        
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !filteredOrders || filteredOrders.length === 0 ? (
            <div className="text-center p-8 text-gray-500">
              No orders found.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{order.id.substring(0, 8)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatDate(order.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(order.total)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="ghost" size="sm" onClick={() => handleViewOrder(order)}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      
      {/* Order Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Order Details - #{currentOrder?.id.substring(0, 8)}</DialogTitle>
            <DialogDescription>
              Placed on {currentOrder && formatDate(currentOrder.created_at)}
            </DialogDescription>
          </DialogHeader>
          
          {currentOrder && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-900">
                    Order Status
                  </p>
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(currentOrder.status)}`}>
                    {currentOrder.status.charAt(0).toUpperCase() + currentOrder.status.slice(1)}
                  </div>
                </div>
                
                <Select
                  value={currentOrder.status}
                  onValueChange={(value: Order['status']) => handleUpdateStatus(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Update status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Order Items</h4>
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentOrder.items.map((item) => (
                        <tr key={item.product_id}>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {item.product_name}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {formatCurrency(item.product_price)}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {item.quantity}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {formatCurrency(item.product_price * item.quantity)}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-50">
                        <th scope="row" colSpan={3} className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                          Total
                        </th>
                        <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                          {formatCurrency(currentOrder.total)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <div>
                  <p className="font-medium text-gray-900">Customer</p>
                  <p className="text-gray-500">ID: {currentOrder.user_id}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
