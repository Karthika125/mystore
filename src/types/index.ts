
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category_id: string;
  created_at: string;
  inventory_count: number;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  created_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  product_price: number;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'customer';
}
