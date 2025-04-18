'use client';

import { useEffect, useState } from 'react';
import { Star, ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';

// Sample new releases data
const NEW_RELEASES = [
  {
    id: '1',
    name: 'Handwoven Cotton Throw',
    price: 3499,
    image: '/images/placeholder.png',
    rating: 4.8,
    reviewCount: 12,
    releasedDate: '2 days ago',
    description: 'Luxurious handwoven cotton throw with intricate patterns.',
  },
  {
    id: '2',
    name: 'Ceramic Serving Bowl Set',
    price: 2799,
    image: '/images/placeholder.png',
    rating: 4.6,
    reviewCount: 8,
    releasedDate: '3 days ago',
    description: 'Set of 3 handcrafted ceramic serving bowls with natural glazing.',
  },
  {
    id: '3',
    name: 'Spice Box with 9 Compartments',
    price: 1999,
    image: '/images/placeholder.png',
    rating: 4.9,
    reviewCount: 15,
    releasedDate: '1 week ago',
    description: 'Traditional wooden spice box with 9 separate compartments and spoons.',
  },
  {
    id: '4',
    name: 'Handcrafted Leather Journal',
    price: 1599,
    image: '/images/placeholder.png',
    rating: 4.7,
    reviewCount: 21,
    releasedDate: '1 week ago',
    description: 'Genuine leather journal with handmade paper and embossed cover.',
  },
  {
    id: '5',
    name: 'Brass Table Lamp',
    price: 4999,
    image: '/images/placeholder.png',
    rating: 4.5,
    reviewCount: 6,
    releasedDate: '2 weeks ago',
    description: 'Elegant brass table lamp with adjustable shade and intricate detailing.',
  },
  {
    id: '6',
    name: 'Organic Cotton Bedsheet Set',
    price: 3299,
    image: '/images/placeholder.png',
    rating: 4.8,
    reviewCount: 9,
    releasedDate: '2 weeks ago',
    description: 'Premium organic cotton bedsheet set with two pillow covers.',
  }
];

export default function NewReleasesPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-4">New Releases</h1>
        <p>Loading new products...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <header className="mb-10">
        <div className="bg-gradient-to-r from-indigo-700 to-purple-700 rounded-xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-3">New Arrivals</h1>
          <p className="text-purple-100 max-w-2xl mb-6">
            Discover our latest products, handpicked for quality and uniqueness. Be the first to explore our newest additions.
          </p>
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span className="text-sm font-medium">Updated weekly with fresh new items</span>
          </div>
        </div>
      </header>

      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {NEW_RELEASES.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200 relative">
                {/* Placeholder for product image */}
                <div className="absolute top-0 left-0 bg-purple-600 text-white px-3 py-1 rounded-br-lg">
                  NEW
                </div>
              </div>
              
              <div className="p-5">
                <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {Array(5).fill(0).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < Math.floor(product.rating) 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-1">({product.reviewCount})</span>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">{product.releasedDate}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-gray-900">{formatCurrency(product.price)}</div>
                  
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    View Product
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="text-center">
        <Link href="/products">
          <Button variant="outline" className="inline-flex items-center border-purple-200 hover:bg-purple-50">
            <span>View All Products</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
} 