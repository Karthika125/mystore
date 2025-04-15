'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu, X, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const { user, isAdmin, signOut } = useAuth();
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b sticky top-0 z-10 bg-white">
        <div className="container mx-auto py-4 px-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold">E-Shop</Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className={`hover:text-primary ${pathname === '/' ? 'text-primary font-medium' : ''}`}>
              Home
            </Link>
            <Link href="/products" className={`hover:text-primary ${pathname === '/products' ? 'text-primary font-medium' : ''}`}>
              Products
            </Link>
            <Link href="/categories" className={`hover:text-primary ${pathname === '/categories' ? 'text-primary font-medium' : ''}`}>
              Categories
            </Link>
            {isAdmin && (
              <Link href="/admin" className={`hover:text-primary ${pathname.startsWith('/admin') ? 'text-primary font-medium' : ''}`}>
                Admin
              </Link>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="hidden md:flex items-center">
                <div className="relative group">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <UserCircle className="h-6 w-6" />
                  </Button>
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-1 z-20 hidden group-hover:block">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-medium truncate">{user.email}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                    <Link href="/account" className="block px-4 py-2 text-sm hover:bg-gray-100">
                      My Account
                    </Link>
                    {isAdmin && (
                      <Link href="/admin" className="block px-4 py-2 text-sm hover:bg-gray-100">
                        Admin Dashboard
                      </Link>
                    )}
                    <Link href="/orders" className="block px-4 py-2 text-sm hover:bg-gray-100">
                      My Orders
                    </Link>
                    <button 
                      onClick={() => signOut()} 
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/auth" className="hidden md:block">
                <Button variant="outline">Sign In</Button>
              </Link>
            )}
            
            <Link href="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
            
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden p-4 bg-gray-50 border-t">
            <div className="flex flex-col space-y-3">
              <Link 
                href="/" 
                className={`px-2 py-1 rounded-md ${pathname === '/' ? 'bg-gray-200' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/products" 
                className={`px-2 py-1 rounded-md ${pathname === '/products' ? 'bg-gray-200' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link 
                href="/categories" 
                className={`px-2 py-1 rounded-md ${pathname === '/categories' ? 'bg-gray-200' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              {user ? (
                <>
                  <Link 
                    href="/account" 
                    className={`px-2 py-1 rounded-md ${pathname === '/account' ? 'bg-gray-200' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Account
                  </Link>
                  <Link 
                    href="/orders" 
                    className={`px-2 py-1 rounded-md ${pathname === '/orders' ? 'bg-gray-200' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  {isAdmin && (
                    <Link 
                      href="/admin" 
                      className={`px-2 py-1 rounded-md ${pathname.startsWith('/admin') ? 'bg-gray-200' : ''}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button 
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    className="px-2 py-1 text-left text-red-600"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link 
                  href="/auth" 
                  className="px-2 py-1 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In / Register
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      
      <footer className="bg-gray-100 border-t">
        <div className="container mx-auto py-8 px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">E-Shop</h3>
              <p className="text-sm text-gray-600">Your one-stop shop for all your needs.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Shop</h3>
              <ul className="space-y-2">
                <li><Link href="/products" className="text-sm text-gray-600 hover:text-gray-900">All Products</Link></li>
                <li><Link href="/categories" className="text-sm text-gray-600 hover:text-gray-900">Categories</Link></li>
                <li><Link href="/cart" className="text-sm text-gray-600 hover:text-gray-900">Cart</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Account</h3>
              <ul className="space-y-2">
                <li><Link href="/account" className="text-sm text-gray-600 hover:text-gray-900">My Account</Link></li>
                <li><Link href="/orders" className="text-sm text-gray-600 hover:text-gray-900">My Orders</Link></li>
                {!user && <li><Link href="/auth" className="text-sm text-gray-600 hover:text-gray-900">Sign In / Register</Link></li>}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="text-sm text-gray-600">Email: info@e-shop.com</li>
                <li className="text-sm text-gray-600">Phone: +1 234 567 890</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t text-center">
            <p className="text-sm text-gray-600">© {new Date().getFullYear()} E-Shop. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 