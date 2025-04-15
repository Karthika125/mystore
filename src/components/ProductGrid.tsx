
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';
import { Loader2 } from 'lucide-react';

interface ProductGridProps {
  products: Product[] | undefined;
  isLoading: boolean;
}

export default function ProductGrid({ products, isLoading }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-center p-4">
        <h3 className="text-xl font-semibold mb-2">No products found</h3>
        <p className="text-gray-500">Try adjusting your filters or check back later.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
