'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Layout } from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { Product, Category } from '@/types';
import { useSupabase } from '@/context/SupabaseContext';

export default function CategoryDetailPage() {
  const params = useParams();
  const categoryId = params.id as string;
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { supabase } = useSupabase();

  useEffect(() => {
    async function fetchCategoryAndProducts() {
      try {
        setLoading(true);
        
        // Fetch category details
        const { data: categoryData, error: categoryError } = await supabase
          .from('categories')
          .select('*')
          .eq('id', categoryId)
          .single();
        
        if (categoryError) {
          console.error('Error fetching category:', categoryError);
          return;
        }
        
        setCategory(categoryData);
        
        // Fetch products in this category
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', categoryId);
        
        if (productsError) {
          console.error('Error fetching products:', productsError);
          return;
        }
        
        setProducts(productsData || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
    
    if (categoryId) {
      fetchCategoryAndProducts();
    }
  }, [categoryId, supabase]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="h-10 w-1/3 bg-gray-200 rounded animate-pulse mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-gray-200 rounded-lg p-4 h-64 animate-pulse"></div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (!category) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Category Not Found</h1>
          <p>The category you're looking for does not exist.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{category.name}</h1>
        
        {category.description && (
          <p className="text-gray-600 mb-8">{category.description}</p>
        )}
        
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-xl text-center my-12">No products found in this category.</p>
        )}
      </div>
    </Layout>
  );
} 