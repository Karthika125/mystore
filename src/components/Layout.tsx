'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu, X, UserCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartCount } = useCart();
  const { user, isAdmin, signOut } = useAuth();
  const pathname = usePathname();

  const cartItemCount = cartCount;

  const isActive = (path: string) => pathname === path;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-primary-pink to-accent-pink">
          <div className="modern-container py-3">
            <div className="flex items-center justify-between gap-4">
              <Link href="/" className="text-2xl font-bold text-white hover:opacity-90 transition-opacity">
                Mystore
              </Link>
              
              <div className="flex-1 max-w-2xl">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for products..."
                    suppressHydrationWarning
                    className="w-full px-6 py-2 rounded-full border-2 border-white focus:border-white focus:ring-2 focus:ring-white/20 outline-none transition-all duration-300 bg-white/10 text-white placeholder-white/70"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                    <Search className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>

              <nav className="hidden md:flex items-center space-x-6">
                {user ? (
                  <div className="relative group">
                    <button className="flex items-center gap-2 text-white hover:opacity-90 transition-opacity">
                      <UserCircle className="h-5 w-5" />
                      <span>Account</span>
                    </button>
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 border border-primary-pink/10">
                      <div className="px-4 py-2 border-b border-primary-pink/10">
                        <p className="text-sm font-medium text-text-dark truncate">{user.email}</p>
                        <p className="text-xs text-text-light capitalize">{user.role}</p>
                      </div>
                      <Link href="/account" className="block px-4 py-2 text-sm text-text-dark hover:bg-light-pink transition-colors">
                        My Account
                      </Link>
                      {isAdmin && (
                        <Link href="/admin" className="block px-4 py-2 text-sm text-text-dark hover:bg-light-pink transition-colors">
                          Admin Dashboard
                        </Link>
                      )}
                      <Link href="/orders" className="block px-4 py-2 text-sm text-text-dark hover:bg-light-pink transition-colors">
                        My Orders
                      </Link>
                      <button 
                        onClick={() => signOut()} 
                        className="block w-full text-left px-4 py-2 text-sm text-accent-pink hover:bg-light-pink transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link href="/auth" className="text-white hover:opacity-90 transition-opacity">
                    Sign In
                  </Link>
                )}
                
                <Link
                  href="/cart"
                  className="relative text-white hover:opacity-90 transition-opacity"
                >
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    <span>Cart</span>
                    {cartItemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-white text-accent-pink text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </div>
                </Link>
              </nav>
              
              <button
                className="md:hidden text-white hover:opacity-90 transition-opacity"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        <div className="border-b border-primary-pink/10">
          <div className="modern-container py-2">
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className={`nav-link ${isActive('/') ? 'text-accent-pink' : ''}`}
              >
                Home
              </Link>
              <Link
                href="/products"
                className={`nav-link ${isActive('/products') ? 'text-accent-pink' : ''}`}
              >
                Products
              </Link>
              <Link
                href="/categories"
                className={`nav-link ${isActive('/categories') ? 'text-accent-pink' : ''}`}
              >
                Categories
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className={`nav-link ${pathname?.startsWith('/admin') ? 'text-accent-pink' : ''}`}
                >
                  Admin
                </Link>
              )}
            </nav>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-primary-pink/10">
            <nav className="modern-container py-4 flex flex-col space-y-4">
              <Link 
                href="/" 
                className={`nav-link px-2 py-1 rounded-lg ${isActive('/') ? 'bg-light-pink text-accent-pink' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/products" 
                className={`nav-link px-2 py-1 rounded-lg ${isActive('/products') ? 'bg-light-pink text-accent-pink' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link 
                href="/categories" 
                className={`nav-link px-2 py-1 rounded-lg ${isActive('/categories') ? 'bg-light-pink text-accent-pink' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              {user ? (
                <>
                  <Link 
                    href="/account" 
                    className={`nav-link px-2 py-1 rounded-lg ${isActive('/account') ? 'bg-light-pink text-accent-pink' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Account
                  </Link>
                  <Link 
                    href="/orders" 
                    className={`nav-link px-2 py-1 rounded-lg ${isActive('/orders') ? 'bg-light-pink text-accent-pink' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  {isAdmin && (
                    <Link 
                      href="/admin" 
                      className={`nav-link px-2 py-1 rounded-lg ${pathname?.startsWith('/admin') ? 'bg-light-pink text-accent-pink' : ''}`}
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
                    className="text-left px-2 py-1 text-accent-pink hover:bg-light-pink rounded-lg transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link 
                  href="/auth" 
                  className="button-primary w-full justify-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>
      
      <main className="flex-grow">
        {children}
      </main>
      
      <footer className="bg-gradient-to-b from-white to-light-pink border-t border-primary-pink/10">
        <div className="modern-container py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-xl font-bold mb-4 text-text-dark">Mystore</h3>
              <p className="text-text-light">Your one-stop destination for all your shopping needs.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-text-dark">Shop</h3>
              <nav className="flex flex-col space-y-3">
                <Link href="/products" className="nav-link">All Products</Link>
                <Link href="/categories" className="nav-link">Categories</Link>
                <Link href="/cart" className="nav-link">Cart</Link>
              </nav>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-text-dark">Account</h3>
              <nav className="flex flex-col space-y-3">
                <Link href="/account" className="nav-link">My Account</Link>
                <Link href="/orders" className="nav-link">My Orders</Link>
                {!user && <Link href="/auth" className="nav-link">Sign In</Link>}
              </nav>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-text-dark">Contact</h3>
              <div className="space-y-3 text-text-light">
                <p>Email: support@mystore.com</p>
                <p>Phone: +1 234 567 890</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-primary-pink/10 text-center text-text-light">
            <p>© {new Date().getFullYear()} Mystore. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
