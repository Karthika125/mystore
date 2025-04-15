
import { Link } from 'react-router-dom';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };
  
  return (
    <Link 
      to={`/products/${product.id}`}
      className="group rounded-lg border overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="aspect-square bg-gray-100 relative overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-200">
            <span className="text-gray-400">No image</span>
          </div>
        )}
        
        {product.inventory_count <= 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            Out of Stock
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-medium line-clamp-1">{product.name}</h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
        
        <div className="mt-4 flex items-center justify-between">
          <span className="font-semibold">{formatCurrency(product.price)}</span>
          
          <Button 
            onClick={handleAddToCart} 
            size="sm" 
            disabled={product.inventory_count <= 0}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </Link>
  );
}
