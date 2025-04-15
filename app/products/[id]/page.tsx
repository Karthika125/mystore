'use client';

import { useProduct } from "@/hooks/useProducts";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingCart, ArrowLeft } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { data: product, isLoading, error } = useProduct(id);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  const handleAddToCart = () => {
    if (product) {
      try {
        addToCart(product, quantity);
        toast({
          title: "Added to cart",
          description: `${quantity} x ${product.name} added to your cart`,
        });
      } catch (error) {
        console.error("Error adding to cart:", error);
        toast({
          title: "Error",
          description: "Could not add to cart. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading product details...</span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <p className="text-gray-500 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/products">Back to Products</Link>
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="aspect-square overflow-hidden rounded-lg border">
            <img 
              src={product.images[0] || '/placeholder-product.jpg'} 
              alt={product.name}
              className="object-cover w-full h-full"
            />
          </div>
          
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-4">
              {product.images.map((image, index) => (
                <div key={index} className="aspect-square overflow-hidden rounded-lg border">
                  <img 
                    src={image} 
                    alt={`${product.name} - Image ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-2xl font-semibold text-primary mb-4">{formatCurrency(product.price)}</p>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-600">{product.description}</p>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Availability</h2>
            <p className={`font-medium ${product.inventory_count > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.inventory_count > 0 
                ? `In Stock (${product.inventory_count} available)` 
                : 'Out of Stock'}
            </p>
          </div>
          
          {product.inventory_count > 0 && (
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20">
                <Input
                  type="number"
                  min="1"
                  max={product.inventory_count}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(parseInt(e.target.value) || 1, product.inventory_count)))}
                />
              </div>
              <Button onClick={handleAddToCart} className="flex-1">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          )}
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h2 className="text-sm font-semibold uppercase mb-2">Product Details</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">SKU</span>
                <span>{product.id.substring(0, 8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Category</span>
                <span>{product.category_id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 