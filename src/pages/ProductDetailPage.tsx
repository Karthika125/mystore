
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProduct } from '@/hooks/useProducts';
import { useCategory } from '@/hooks/useCategories';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import Layout from '@/components/Layout';

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const { data: product, isLoading } = useProduct(productId);
  const { data: category } = useCategory(product?.category_id);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-96">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, Math.min(product.inventory_count, quantity + delta));
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <Layout>
      <div className="mb-6">
        <Link to="/products" className="inline-flex items-center text-sm text-gray-600 hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to products
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Product Images */}
        <div>
          <div className="aspect-square overflow-hidden rounded-lg border bg-gray-50 mb-4">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="h-full w-full object-cover object-center"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          {product.images && product.images.length > 1 && (
            <div className="flex space-x-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`relative h-16 w-16 rounded-md border overflow-hidden ${
                    activeImage === index ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="h-full w-full object-cover object-center"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div>
          {category && (
            <Link to={`/categories/${category.id}`} className="text-sm font-medium text-primary">
              {category.name}
            </Link>
          )}
          <h1 className="text-3xl font-bold mt-2">{product.name}</h1>
          <div className="mt-4 text-2xl font-bold">{formatCurrency(product.price)}</div>
          
          <div className="mt-6">
            <h3 className="text-sm font-medium">Description</h3>
            <p className="mt-2 text-gray-600">{product.description}</p>
          </div>

          <div className="mt-6">
            <div className="flex items-center">
              <div className="mr-5">
                <h3 className="text-sm font-medium">Quantity</h3>
              </div>
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="h-10 w-10 rounded-none"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-10 text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.inventory_count}
                  className="h-10 w-10 rounded-none"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Button
              onClick={handleAddToCart}
              size="lg"
              className="w-full"
              disabled={product.inventory_count <= 0}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {product.inventory_count <= 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            {product.inventory_count > 0 ? (
              <p className="flex items-center">
                <span className="mr-2 h-2 w-2 rounded-full bg-green-500"></span>
                {product.inventory_count > 10
                  ? "In stock, ready to ship"
                  : `Only ${product.inventory_count} left in stock`}
              </p>
            ) : (
              <p className="flex items-center">
                <span className="mr-2 h-2 w-2 rounded-full bg-red-500"></span>
                Out of stock
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
