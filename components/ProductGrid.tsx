'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
};

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
}

export default function ProductGrid({ products, isLoading }: ProductGridProps) {
  const { addToCart } = useCart();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array(8).fill(0).map((_, i) => (
          <Card key={i} className="overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200" />
            <CardContent className="pt-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden transition-all hover:shadow-md">
          <Link href={`/products/${product.id}`} className="block h-48 overflow-hidden relative">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
            ) : (
              <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                <span className="text-gray-500">No image</span>
              </div>
            )}
          </Link>
          
          <CardContent className="pt-4">
            <Link href={`/products/${product.id}`} className="hover:underline">
              <h3 className="font-medium truncate">{product.name}</h3>
            </Link>
            {product.description && (
              <p className="text-gray-500 text-sm line-clamp-2 mt-1">{product.description}</p>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <div className="font-bold">
              ${product.price.toFixed(2)}
            </div>
            <Button
              onClick={() => addToCart(product)}
              size="icon"
              className="rounded-full"
              variant="secondary"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}