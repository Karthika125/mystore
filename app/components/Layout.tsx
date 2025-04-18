'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Search, Menu, User, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const { items: cartItems } = useCart();
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  const cartCount = cartItems?.length || 0;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-gray-900 text-white shadow-lg">
        <div className="container mx-auto">
          {/* Upper Header */}
          <div className="flex items-center justify-between py-2 px-4">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold text-white hover:text-amber-400 transition-colors">
              MyStore
            </Link>

            {/* Delivery Location */}
            <button className="flex items-center space-x-1 text-sm hover:text-amber-400 transition-colors">
              <MapPin size={20} />
              <div className="flex flex-col items-start">
                <span className="text-gray-400 text-xs">Deliver to</span>
                <span className="font-bold">Kochi 682304</span>
              </div>
            </button>

            {/* Search Bar */}
            <div className="flex-1 max-w-3xl mx-4">
              <div className="flex">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-r-none bg-white text-black focus:ring-2 focus:ring-amber-500"
                />
                <Button className="rounded-l-none bg-amber-500 hover:bg-amber-600 transition-colors">
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Auth & Cart */}
            <div className="flex items-center space-x-6">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex flex-col items-start hover:text-amber-400 transition-colors">
                    <span className="text-xs">Hello, {user ? user.email : 'sign in'}</span>
                    <span className="font-bold">Account & Lists</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white">
                  {!user ? (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/auth/login" className="w-full hover:bg-gray-100">
                          Sign In
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/auth/register" className="w-full hover:bg-gray-100">
                          Create Account
                        </Link>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="hover:bg-gray-100">Your Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/orders" className="hover:bg-gray-100">Your Orders</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => signOut()} className="hover:bg-gray-100">
                        Sign Out
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <Link href="/cart" className="flex items-center hover:text-amber-400 transition-colors">
                <div className="relative">
                  <ShoppingCart size={24} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="ml-1 font-bold">Cart</span>
              </Link>
            </div>
          </div>

          {/* Lower Header - Navigation */}
          <nav className="flex items-center space-x-6 py-2 px-4 bg-gray-800">
            <button className="flex items-center space-x-1 hover:text-amber-400 transition-colors">
              <Menu size={20} />
              <span>All</span>
            </button>
            <Link href="/products" className="hover:text-amber-400 transition-colors">Products</Link>
            <Link href="/categories" className="hover:text-amber-400 transition-colors">Categories</Link>
            <Link href="/deals" className="hover:text-amber-400 transition-colors">Today's Deals</Link>
            <Link href="/new" className="hover:text-amber-400 transition-colors">New Releases</Link>
            <Link href="/customer-service" className="hover:text-amber-400 transition-colors">Customer Service</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4 text-lg">Get to Know Us</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="hover:text-amber-400 transition-colors">About Us</Link></li>
                <li><Link href="/careers" className="hover:text-amber-400 transition-colors">Careers</Link></li>
                <li><Link href="/press" className="hover:text-amber-400 transition-colors">Press Releases</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-lg">Connect with Us</h3>
              <ul className="space-y-2">
                <li><Link href="/facebook" className="hover:text-amber-400 transition-colors">Facebook</Link></li>
                <li><Link href="/twitter" className="hover:text-amber-400 transition-colors">Twitter</Link></li>
                <li><Link href="/instagram" className="hover:text-amber-400 transition-colors">Instagram</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-lg">Make Money with Us</h3>
              <ul className="space-y-2">
                <li><Link href="/sell" className="hover:text-amber-400 transition-colors">Sell on MyStore</Link></li>
                <li><Link href="/affiliate" className="hover:text-amber-400 transition-colors">Become an Affiliate</Link></li>
                <li><Link href="/advertise" className="hover:text-amber-400 transition-colors">Advertise Your Products</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-lg">Let Us Help You</h3>
              <ul className="space-y-2">
                <li><Link href="/help" className="hover:text-amber-400 transition-colors">Help Center</Link></li>
                <li><Link href="/returns" className="hover:text-amber-400 transition-colors">Returns</Link></li>
                <li><Link href="/shipping" className="hover:text-amber-400 transition-colors">Shipping Rates & Policies</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p>&copy; {new Date().getFullYear()} MyStore. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 