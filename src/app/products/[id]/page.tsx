'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useSupabase } from '@/context/SupabaseContext';
import { Product } from '@/types';
import { ArrowLeft, ShoppingCart } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { supabase } = useSupabase();
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('products')
          .select('*, categories(*)')
          .eq('id', productId)
          .single();
        
        if (error) {
          console.error('Error fetching product:', error);
          return;
        }
        
        console.log('Fetched product:', data);
        setProduct(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
    
    if (productId) {
      fetchProduct();
    }
  }, [productId, supabase]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/2 h-96 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="w-full md:w-1/2 space-y-4">
              <div className="h-10 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
              <div className="h-32 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded w-48 animate-pulse"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Product Not Found</h1>
          <p>The product you're looking for does not exist.</p>
          <Link href="/products" className="text-blue-600 hover:underline mt-4 inline-block">
            <ArrowLeft className="inline-block mr-2" size={16} />
            Back to Products
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Product images */}
          <div className="w-full md:w-1/2">
            <div className="relative aspect-square w-full mb-4 overflow-hidden rounded-lg border">
              <Image
                src={product.images?.[currentImageIndex] || '/product-placeholder.png'}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            
            {/* Thumbnail gallery */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`relative w-20 h-20 border-2 rounded overflow-hidden flex-shrink-0 ${
                      index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product details */}
          <div className="w-full md:w-1/2">
            <Link href="/products" className="text-blue-600 hover:underline mb-4 inline-block">
              <ArrowLeft className="inline-block mr-2" size={16} />
              Back to Products
            </Link>
            
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            
            <div className="text-2xl font-bold mb-4">
              ${product.price.toFixed(2)}
            </div>
            
            {product.inventory_count > 0 ? (
              <div className="text-green-600 mb-4">In Stock ({product.inventory_count} available)</div>
            ) : (
              <div className="text-red-600 mb-4">Out of Stock</div>
            )}
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-700">{product.description}</p>
            </div>
            
            <Button 
              onClick={() => addToCart(product)} 
              className="w-full md:w-auto"
              disabled={product.inventory_count <= 0}
            >
              <ShoppingCart className="mr-2" size={16} />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
} 