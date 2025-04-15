
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartItem as CartItemType } from '@/types';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItemComponent({ item }: CartItemProps) {
  const { product, quantity } = item;
  const { updateQuantity, removeFromCart } = useCart();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newQuantity = parseInt(e.target.value);
    updateQuantity(product.id, newQuantity);
  };

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      removeFromCart(product.id);
    }, 300);
  };

  return (
    <div className={`flex py-6 border-b transition-opacity ${isRemoving ? 'opacity-0' : 'opacity-100'}`}>
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover object-center"
          />
        ) : (
          <div className="h-full w-full bg-gray-200 flex items-center justify-center">
            <span className="text-xs text-gray-400">No image</span>
          </div>
        )}
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div className="flex justify-between">
          <Link to={`/products/${product.id}`} className="hover:text-primary">
            <h3 className="font-medium">{product.name}</h3>
          </Link>
          <p className="text-gray-900 font-medium">{formatCurrency(product.price * quantity)}</p>
        </div>

        <div className="mt-4 flex justify-between">
          <div className="flex items-center">
            <label htmlFor={`quantity-${product.id}`} className="mr-2 text-sm text-gray-600">
              Qty
            </label>
            <select
              id={`quantity-${product.id}`}
              name="quantity"
              value={quantity}
              onChange={handleQuantityChange}
              className="rounded border-gray-300 py-1 px-2 text-sm"
            >
              {Array.from({ length: Math.min(10, product.inventory_count) }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 flex items-center gap-1"
          >
            <Trash className="h-4 w-4" />
            <span className="text-sm">Remove</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
