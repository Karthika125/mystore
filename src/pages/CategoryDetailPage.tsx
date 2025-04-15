
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCategory } from '@/hooks/useCategories';
import { useProducts } from '@/hooks/useProducts';
import ProductGrid from '@/components/ProductGrid';
import Layout from '@/components/Layout';

export default function CategoryDetailPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { data: category, isLoading: isLoadingCategory } = useCategory(categoryId);
  const { data: products, isLoading: isLoadingProducts } = useProducts(categoryId);

  return (
    <Layout>
      <div className="mb-6">
        <Link to="/categories" className="inline-flex items-center text-sm text-gray-600 hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to categories
        </Link>
      </div>

      {isLoadingCategory ? (
        <div className="h-24 max-w-md animate-pulse bg-gray-100 rounded-md"></div>
      ) : !category ? (
        <div className="text-center py-16">
          <h2 className="text-lg font-medium">Category Not Found</h2>
          <p className="mt-2 text-gray-500">The category you're looking for doesn't exist or has been removed.</p>
          <div className="mt-8">
            <Link to="/categories">
              <Button>View All Categories</Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold">{category.name}</h1>
            {category.description && (
              <p className="mt-2 text-gray-600">{category.description}</p>
            )}
          </div>

          <ProductGrid products={products} isLoading={isLoadingProducts} />
        </>
      )}
    </Layout>
  );
}
