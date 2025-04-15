
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, DollarSign, Package, ShoppingCart, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOrders } from '@/hooks/useOrders';
import { useProducts } from '@/hooks/useProducts';
import { formatCurrency } from '@/lib/utils';

export default function AdminDashboardHome() {
  const { data: orders } = useOrders();
  const { data: products } = useProducts();
  const [salesData, setSalesData] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    lowStockProducts: 0,
  });

  useEffect(() => {
    if (orders) {
      // Calculate total sales and prepare chart data
      const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
      const totalOrders = orders.length;
      
      // Group sales by date for chart
      const salesByDate = orders.reduce((acc, order) => {
        const date = new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (!acc[date]) acc[date] = 0;
        acc[date] += order.total;
        return acc;
      }, {} as Record<string, number>);
      
      const chartData = Object.keys(salesByDate).map(date => ({
        date,
        sales: salesByDate[date]
      }));
      
      // Sort by date
      chartData.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });
      
      setSalesData(chartData.slice(-7)); // Last 7 days
      
      // Count low stock products
      const lowStockCount = products?.filter(p => p.inventory_count < 5).length || 0;
      
      setStats({
        totalSales,
        totalOrders,
        lowStockProducts: lowStockCount,
      });
    }
  }, [orders, products]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalSales)}</div>
            <p className="text-xs text-muted-foreground">
              +10% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              {orders?.filter(order => order.status === 'pending').length} pending
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats.lowStockProducts} low stock
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(orders?.map(order => order.user_id)).size || 0}
            </div>
            <div className="flex items-center pt-1">
              <ArrowUpRight className="h-4 w-4 text-green-500" />
              <span className="text-xs text-green-500">+5% new customers</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mt-6">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), 'Sales']}
                />
                <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {orders?.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">Order #{order.id.substring(0, 8)}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="ml-auto font-medium">
                    {formatCurrency(order.total)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
