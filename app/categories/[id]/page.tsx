'use client';

import { useCategory } from "@/hooks/useCategories";
import { useProductsByCategory } from "@/hooks/useProducts";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CategoryDetailPage({ params }: { params: { id: string | number } }) {
  const { id } = params;
  const { data: category, isLoading: categoryLoading } = useCategory(id);
  const { data: products, isLoading: productsLoading } = useProductsByCategory(id);
  const { addToCart } = useCart();
  const router = useRouter();

  const isLoading = categoryLoading || productsLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading category products...</span>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Category not found</h1>
        <p className="text-gray-500 mb-6">The category you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/categories">Back to Categories</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      <div className="mb-8">
        <div className="relative h-40 md:h-64 rounded-lg overflow-hidden mb-4">
          <img
            src={category.image || '/placeholder-category.jpg'}
            alt={category.name}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white">{category.name}</h1>
          </div>
        </div>
        <p className="text-gray-600">{category.description}</p>
      </div>
      
      {products?.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">No products in this category</h2>
          <Button asChild>
            <Link href="/products">Browse All Products</Link>
          </Button>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-6">Products in {category.name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products?.map((product) => (
              <Card key={product.id} className="flex flex-col h-full">
                <div className="relative aspect-square overflow-hidden">
                  <img 
                    src={product.images[0] || '/placeholder-product.jpg'} 
                    alt={product.name}
                    className="object-cover w-full h-full transition-transform hover:scale-105"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="line-clamp-1">{product.name}</CardTitle>
                  <p className="text-lg font-semibold text-primary">{formatCurrency(product.price)}</p>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-gray-500 line-clamp-2">{product.description}</p>
                </CardContent>
                <CardFooter className="pt-2 mt-auto flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    asChild
                  >
                    <Link href={`/products/${product.id}`}>View</Link>
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={() => addToCart(product)}
                    disabled={product.inventory_count < 1}
                  >
                    {product.inventory_count < 1 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
} 