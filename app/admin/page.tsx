'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/src/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  PackageIcon, 
  UsersIcon, 
  ShoppingBagIcon, 
  TagIcon, 
  TrendingUpIcon, 
  DollarSignIcon 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentOrders: [],
    lowStockProducts: []
  });

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/auth');
    }
  }, [isAdmin, loading, router]);

  useEffect(() => {
    if (isAdmin) {
      const fetchDashboardData = async () => {
        try {
          // Get total products
          const { count: productsCount } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true });

          // Get total orders
          const { count: ordersCount } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true });

          // Get total users
          const { count: usersCount } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true });

          // Get recent orders
          const { data: recentOrders } = await supabase
            .from('orders')
            .select(`
              id,
              user_id,
              status,
              total,
              created_at,
              profiles(email)
            `)
            .order('created_at', { ascending: false })
            .limit(5);

          // Get products with low stock
          const { data: lowStockProducts } = await supabase
            .from('products')
            .select('id, name, inventory_count')
            .lt('inventory_count', 10)
            .order('inventory_count')
            .limit(5);

          // Calculate total revenue
          const { data: orders } = await supabase
            .from('orders')
            .select('total');

          const totalRevenue = orders?.reduce((sum, order) => sum + order.total, 0) || 0;

          setStats({
            totalProducts: productsCount || 0,
            totalOrders: ordersCount || 0,
            totalUsers: usersCount || 0,
            totalRevenue,
            recentOrders: recentOrders || [],
            lowStockProducts: lowStockProducts || []
          });
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        }
      };

      fetchDashboardData();
    }
  }, [isAdmin]);

  if (loading || !isAdmin) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-500">Manage your store data and settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <PackageIcon className="mr-2 h-5 w-5 text-primary" />
              Products
            </CardTitle>
            <CardDescription>Manage your product inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Add, edit, or remove products from your store.</p>
            <Button asChild className="w-full">
              <Link href="/admin/products">Manage Products</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <TagIcon className="mr-2 h-5 w-5 text-blue-600" />
              Categories
            </CardTitle>
            <CardDescription>Organize your product catalog</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Create and manage product categories.</p>
            <Button asChild className="w-full">
              <Link href="/admin/categories">Manage Categories</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <ShoppingBagIcon className="mr-2 h-5 w-5 text-green-600" />
              Orders
            </CardTitle>
            <CardDescription>Track customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">View and update order statuses.</p>
            <Button asChild className="w-full">
              <Link href="/admin/orders">Manage Orders</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <UsersIcon className="mr-2 h-5 w-5 text-violet-600" />
              Users
            </CardTitle>
            <CardDescription>Manage user accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">View and manage customer accounts.</p>
            <Button asChild className="w-full">
              <Link href="/admin/users">Manage Users</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recent-orders">
        <TabsList>
          <TabsTrigger value="recent-orders">Recent Orders</TabsTrigger>
          <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recent-orders" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Order ID</th>
                      <th className="text-left py-3 px-4">Customer</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Amount</th>
                      <th className="text-left py-3 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentOrders.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-4 text-gray-500">No recent orders found</td>
                      </tr>
                    ) : (
                      stats.recentOrders.map((order: any) => (
                        <tr key={order.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{order.id.substring(0, 8)}</td>
                          <td className="py-3 px-4">{order.profiles?.email || 'Unknown'}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs uppercase ${
                              order.status === 'completed' ? 'bg-green-100 text-green-800' :
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">${order.total.toFixed(2)}</td>
                          <td className="py-3 px-4">{new Date(order.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="low-stock" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Low Stock Products</CardTitle>
              <CardDescription>Products that need restocking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Product ID</th>
                      <th className="text-left py-3 px-4">Name</th>
                      <th className="text-left py-3 px-4">Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.lowStockProducts.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="text-center py-4 text-gray-500">No low stock products found</td>
                      </tr>
                    ) : (
                      stats.lowStockProducts.map((product: any) => (
                        <tr key={product.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{product.id.substring(0, 8)}</td>
                          <td className="py-3 px-4">{product.name}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              product.inventory_count <= 3 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {product.inventory_count} left
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 