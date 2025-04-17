'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Product as ProductType } from '@/types';
import { useToast } from '../hooks/use-toast';  // Adjust based on your folder structure


interface ProductGridProps {
  products: ProductType[];
  isLoading: boolean;
}

export default function ProductGrid({ products, isLoading }: ProductGridProps) {
  const { addToCart } = useCart();

  // 1) Loading skeletons
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="animate-pulse overflow-hidden">
            <div className="h-48 bg-gray-200" />
            <CardContent className="pt-4">
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-8 w-8 bg-gray-200 rounded-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  // 2) No products
  if (!products.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No products found.</p>
      </div>
    );
  }

  // 3) The real grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => {
        // Safe image URL
        const imageUrl =
          Array.isArray(product.images) && product.images.length
            ? product.images[0]
            : '/placeholder-product.jpg';

        // Safe, integer rating between 0 and 5
        const safeRating = Math.min(
          5,
          Math.max(0, Math.round(product.rating ?? 0))
        );

        return (
          <Card
            key={product.id}
            className="overflow-hidden transition-shadow hover:shadow-md"
          >
            <Link
              href={`/products/${product.id}`}
              className="block h-48 overflow-hidden relative"
            >
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                className="object-cover transition-transform hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
            </Link>

            <CardContent className="pt-4">
              <Link
                href={`/products/${product.id}`}
                className="hover:underline"
              >
                <h3 className="font-medium truncate">{product.name}</h3>
              </Link>
              {product.description && (
                <p className="text-gray-500 text-sm line-clamp-2 mt-1">
                  {product.description}
                </p>
              )}
              <div className="text-sm text-yellow-500 mt-1">
                {'★'.repeat(safeRating)}
                {'☆'.repeat(5 - safeRating)}
              </div>
            </CardContent>

            <CardFooter className="flex justify-between items-center">
              <span className="font-bold">${product.price.toFixed(2)}</span>
              <Button
                size="icon"
                variant="secondary"
                className="rounded-full"
                onClick={() => addToCart(product)}
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
