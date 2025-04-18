'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Layout } from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { Product, Category } from '@/types';
import { useSupabase } from '@/context/SupabaseContext';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const categoryId = searchParams.get('category') || '';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { supabase } = useSupabase();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name');
        
        if (error) {
          console.error('Error fetching categories:', error);
          return;
        }
        
        setCategories(data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
    
    fetchCategories();
  }, [supabase]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        console.log('Fetching products with query:', query, 'categoryId:', categoryId);
        
        let queryBuilder = supabase
          .from('products')
          .select('*');
        
        // Apply category filter if specified
        if (categoryId) {
          queryBuilder = queryBuilder.eq('category_id', categoryId);
        }
        
        // Apply search query if specified
        if (query) {
          queryBuilder = queryBuilder.ilike('name', `%${query}%`);
        }
        
        const { data, error } = await queryBuilder.order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching products:', error);
          return;
        }
        
        console.log('Fetched products:', data?.length);
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProducts();
  }, [query, categoryId, supabase]);

  // Function to handle category selection
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const url = new URL(window.location.href);
    
    if (value) {
      url.searchParams.set('category', value);
    } else {
      url.searchParams.delete('category');
    }
    
    // Maintain search query if present
    if (query) {
      url.searchParams.set('query', query);
    }
    
    window.history.pushState({}, '', url.toString());
    // Force a rerender to trigger the useEffect
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Products</h1>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-64">
              <select
                className="w-full border rounded-md p-2"
                value={categoryId}
                onChange={handleCategoryChange}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <form 
              className="relative w-full sm:w-64"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const searchQuery = formData.get('search') as string;
                
                const url = new URL(window.location.href);
                if (searchQuery) {
                  url.searchParams.set('query', searchQuery);
                } else {
                  url.searchParams.delete('query');
                }
                
                // Maintain category if present
                if (categoryId) {
                  url.searchParams.set('category', categoryId);
                }
                
                window.history.pushState({}, '', url.toString());
                // Force a rerender to trigger the useEffect
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
            >
              <input
                type="text"
                name="search"
                placeholder="Search products..."
                className="w-full border rounded-md p-2"
                defaultValue={query}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                🔍
              </button>
            </form>
          </div>
        </div>
        
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
          <div className="text-center my-12">
            <p className="text-xl mb-4">No products found.</p>
            <p className="text-gray-600">
              {query && 'Try a different search term or '}
              {categoryId && 'Try a different category or '}
              {(query || categoryId) && 'view all products.'}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
} 