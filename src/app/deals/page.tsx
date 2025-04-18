'use client';

import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';
import { useSupabase } from '@/context/SupabaseContext';

export default function DealsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { supabase } = useSupabase();

  useEffect(() => {
    async function fetchDeals() {
      try {
        setLoading(true);
        // Fetch products with discount (you can adjust this query based on your data structure)
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching deals:', error);
          return;
        }

        // For demo purposes, just consider the first 6 products as deals
        // In a real app, you would have a discount field or similar
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching deals:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDeals();
  }, [supabase]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Today's Deals</h1>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-gray-200 rounded-lg p-4 h-64 animate-pulse"></div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-xl text-center my-12">No deals available at the moment. Check back soon!</p>
        )}
      </div>
    </Layout>
  );
} 