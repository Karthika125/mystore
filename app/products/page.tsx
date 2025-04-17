'use client';

import { useState, useEffect } from 'react';
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { Search } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from '@/lib/supabase';
import { Product } from '@/types';

export default function ProductsPage() {
  const { data: products, isLoading: productsLoading, error: productsError } = useProducts();
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useCategories();
  const { addToCart } = useCart();
  
  // Debug logging
  useEffect(() => {
    const checkConnection = async () => {
      try {
        console.log('Checking Supabase connection...');
        const { data, error } = await supabase.from('products').select('count');
        console.log('Connection test result:', { data, error });
      } catch (error) {
        console.error('Supabase connection error:', error);
      }
    };

    checkConnection();
  }, []);

  useEffect(() => {
    console.log('Products state:', { products, productsLoading, productsError });
    console.log('Categories state:', { categories, categoriesLoading, categoriesError });
  }, [products, productsLoading, productsError, categories, categoriesLoading, categoriesError]);
  
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  useEffect(() => {
    if (products) {
      let filtered = [...products];
      console.log('Filtering products:', { 
        totalProducts: products.length,
        searchQuery,
        selectedCategory,
        sortBy
      });
      
      // Apply search filter
      if (searchQuery) {
        filtered = filtered.filter(product => 
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // Apply category filter
      if (selectedCategory && selectedCategory !== 'all') {
        filtered = filtered.filter(product => 
          product.category_id?.toString() === selectedCategory
        );
      }
      
      // Apply sorting
      switch (sortBy) {
        case 'newest':
          filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          break;
        case 'price-low':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'name-az':
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default:
          break;
      }
      
      console.log('Filtered products:', { 
        filteredCount: filtered.length,
        filtered
      });
      
      setFilteredProducts(filtered);
    }
  }, [products, searchQuery, selectedCategory, sortBy]);

  // Show error states
  if (productsError || categoriesError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-white to-light-pink/20">
        <div className="modern-container py-6">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-text-dark mb-2">Error loading data</h2>
            <p className="text-text-light mb-6">
              {productsError?.message || categoriesError?.message || 'An error occurred while loading the data'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-accent-pink text-white rounded-full hover:bg-dark-pink transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-4 space-y-4">
          <Skeleton className="aspect-square rounded-lg" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-light-pink/20">
      <div className="modern-container py-6">
        {/* Categories Quick Nav */}
        <div className="flex overflow-x-auto gap-4 mb-8 pb-2 scrollbar-hide">
          <button 
            className={`px-4 py-2 whitespace-nowrap rounded-full transition-all ${
              selectedCategory === 'all' 
                ? 'bg-accent-pink text-white' 
                : 'bg-white border border-primary-pink/20 hover:border-accent-pink'
            }`}
            onClick={() => setSelectedCategory('all')}
          >
            All Products
          </button>
          {categories?.map((category) => (
            <button
              key={category.id}
              className={`px-4 py-2 whitespace-nowrap rounded-full transition-all $image.png{
                selectedCategory === category.id.toString()
                  ? 'bg-accent-pink text-white'
                  : 'bg-white border border-primary-pink/20 hover:border-accent-pink'
              }`}
              onClick={() => setSelectedCategory(category.id.toString())}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="w-full md:w-96">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-3 rounded-full border border-primary-pink/20 focus:border-accent-pink focus:ring-2 focus:ring-accent-pink/20 outline-none transition-all duration-300"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-light">
                <Search className="h-5 w-5" />
              </div>
            </div>
          </div>

          <select 
            className="px-6 py-3 rounded-full border border-primary-pink/20 focus:border-accent-pink focus:ring-2 focus:ring-accent-pink/20 outline-none transition-all duration-300 bg-white"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Sort by: Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name-az">Name: A to Z</option>
          </select>
        </div>

        {productsLoading ? (
          <LoadingSkeleton />
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-text-dark mb-2">No products found</h2>
            <p className="text-text-light mb-6">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-6 py-2 bg-accent-pink text-white rounded-full hover:bg-dark-pink transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 