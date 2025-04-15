
import { useState } from 'react';
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Layers, Package, FolderTree, ShoppingBag, Users, Settings, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Redirect if not logged in or not an admin
  if (!user) {
    return <Navigate to="/auth?redirect=/admin" replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: BarChart2 },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: FolderTree },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  ];
  
  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <div className={`${
        isMobileMenuOpen ? 'block' : 'hidden'
      } md:block md:flex-shrink-0 md:w-64 bg-white shadow`}>
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-center h-16 border-b">
            <Link to="/" className="text-xl font-bold text-primary">E-Shop Admin</Link>
          </div>
          
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center px-4 py-2 rounded-md ${
                      location.pathname === item.href
                        ? 'bg-primary text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            
            <div className="pt-8">
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">
                Account
              </div>
              <Link
                to="/admin/settings"
                className={`flex items-center px-4 py-2 rounded-md ${
                  location.pathname === '/admin/settings'
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Settings className="h-5 w-5 mr-3" />
                Settings
              </Link>
              
              <Link
                to="/"
                className="flex items-center px-4 py-2 mt-1 rounded-md text-gray-600 hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Layers className="h-5 w-5 mr-3" />
                Back to Store
              </Link>
            </div>
          </nav>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white shadow">
          <div className="px-4 sm:px-6 h-16 flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </Button>
            
            <div className="md:hidden text-xl font-semibold">
              Admin Panel
            </div>
            
            <div className="flex items-center">
              <div className="ml-3 relative flex items-center">
                <div className="text-sm font-medium text-gray-700 mr-4">
                  {user.email}
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
