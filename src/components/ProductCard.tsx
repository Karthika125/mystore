import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import { useState } from 'react';
import { Loader2, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleAddToCart = async () => {
    setIsLoading(true);
    await addToCart(product);
    setIsLoading(false);
  };
  
  return (
    <div className="group relative overflow-hidden bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-primary-pink/20">
      <div className="absolute inset-0 bg-gradient-to-b from-primary-pink/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <Link href={`/products/${product.id}`} className="block aspect-square overflow-hidden">
        <div className="relative h-full">
          <Image
            src={product.images[0]}
            alt={product.name}
            width={500}
            height={500}
            className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>
      
      <div className="p-6">
        <Link href={`/products/${product.id}`} className="block">
          <h3 className="text-lg font-semibold text-text-dark group-hover:text-accent-pink transition-colors duration-300 line-clamp-1">
            {product.name}
          </h3>
          <p className="mt-2 text-text-light line-clamp-2 group-hover:text-text-dark transition-colors duration-300">
            {product.description}
          </p>
        </Link>
        
        <div className="mt-6 flex items-center justify-between">
          <p className="text-xl font-bold text-accent-pink">
            ${product.price.toFixed(2)}
          </p>
          <button
            onClick={handleAddToCart}
            disabled={isLoading}
            className="px-6 py-2.5 bg-primary-pink text-text-dark font-medium rounded-full hover:bg-dark-pink hover:text-white transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <span className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Adding...</span>
              </span>
            ) : (
              <span className="flex items-center space-x-2">
                <ShoppingCart className="h-4 w-4" />
                <span>Add to Cart</span>
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
