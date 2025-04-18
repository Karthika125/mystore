import Link from 'next/link';
import { useCategories } from '@/hooks/useCategories';
import CategoryCard from '@/components/CategoryCard';
import Layout from '@/components/Layout';
import { Loader2 } from 'lucide-react';

export default function CategoriesPage() {
  const { data: categories, isLoading } = useCategories();

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8">Categories</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !categories || categories.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-lg font-medium">No categories found</h2>
          <p className="mt-2 text-gray-500">Check back later for new categories.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </Layout>
  );
}
