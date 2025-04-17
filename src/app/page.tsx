'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Product, Category } from '@/types';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState({
    products: true,
    categories: true
  });
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchData() {
      console.log('🔄 Starting data fetch...');
      try {
        // Fetch products
        console.log('📦 Fetching products...');
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (productsError) {
          console.error('❌ Error fetching products:', productsError);
          setError(productsError.message);
          toast({
            title: "Error",
            description: "Failed to load products. Please try again.",
            variant: "destructive",
          });
        } else {
          console.log('✅ Products fetched successfully:', productsData?.length || 0, 'items');
          setProducts(productsData || []);
        }

        // Fetch categories
        console.log('🗂️ Fetching categories...');
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .order('created_at', { ascending: false });

        if (categoriesError) {
          console.error('❌ Error fetching categories:', categoriesError);
          setError(categoriesError.message);
          toast({
            title: "Error",
            description: "Failed to load categories. Please try again.",
            variant: "destructive",
          });
        } else {
          console.log('✅ Categories fetched successfully:', categoriesData?.length || 0, 'items');
          setCategories(categoriesData || []);
        }
      } catch (error) {
        console.error('❌ Unexpected error:', error);
        setError(error instanceof Error ? error.message : 'An unexpected error occurred');
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading({
          products: false,
          categories: false
        });
        console.log('🏁 Data fetch complete');
      }
    }

    fetchData();
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Data</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button 
          onClick={() => window.location.reload()}
          className="bg-pink-600 hover:bg-pink-700 text-white"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link href="/products" className="text-pink-600 hover:text-pink-700">
            View All Products →
          </Link>
        </div>
        {loading.products ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-48">
                  <img
                    src={product.images?.[0] || '/placeholder.png'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-2">${product.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{product.description}</p>
                  <Button 
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Categories</h2>
          <Link href="/categories" className="text-pink-600 hover:text-pink-700">
            View All Categories →
          </Link>
        </div>
        {loading.categories ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.id}`}
                className="group relative h-32 overflow-hidden rounded-lg"
              >
                <img
                  src={category.image || '/placeholder.png'}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <h3 className="text-white text-xl font-semibold">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
} 