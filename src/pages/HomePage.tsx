
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import ProductGrid from '@/components/ProductGrid';
import CategoryCard from '@/components/CategoryCard';
import Layout from '@/components/Layout';

export default function HomePage() {
  const { data: featuredProducts, isLoading: isLoadingProducts } = useProducts();
  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  const [displayedProducts, setDisplayedProducts] = useState([]);

  useEffect(() => {
    if (featuredProducts) {
      // Get 8 random products for the featured section
      const shuffled = [...featuredProducts].sort(() => 0.5 - Math.random());
      setDisplayedProducts(shuffled.slice(0, 8));
    }
  }, [featuredProducts]);

  return (
    <Layout>
      {/* Hero Banner */}
      <div className="relative bg-gray-900 text-white rounded-lg overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10"></div>
        <div className="relative z-20 p-8 md:p-16 flex flex-col items-start justify-center h-96">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Shop the Latest Trends</h1>
          <p className="text-lg md:text-xl mb-8 max-w-md">Discover our collection of high-quality products at unbeatable prices.</p>
          <Link to="/products">
            <Button size="lg" className="font-semibold">
              Shop Now
            </Button>
          </Link>
        </div>
      </div>

      {/* Categories Section */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Shop by Category</h2>
          <Link to="/categories" className="text-primary flex items-center gap-1 hover:underline">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoadingCategories ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-24 rounded-lg bg-gray-100 animate-pulse"></div>
            ))
          ) : (
            categories?.slice(0, 8).map(category => (
              <CategoryCard key={category.id} category={category} />
            ))
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link to="/products" className="text-primary flex items-center gap-1 hover:underline">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <ProductGrid products={displayedProducts} isLoading={isLoadingProducts} />
      </section>

      {/* Promo Sections */}
      <section className="mb-16 grid md:grid-cols-2 gap-6">
        <div className="bg-blue-50 rounded-lg p-8 flex flex-col items-start">
          <h3 className="text-xl font-bold mb-2">Free Shipping</h3>
          <p className="mb-4 text-gray-600">On orders over $50. Don't miss out!</p>
          <Link to="/products">
            <Button variant="outline">Shop Now</Button>
          </Link>
        </div>
        
        <div className="bg-amber-50 rounded-lg p-8 flex flex-col items-start">
          <h3 className="text-xl font-bold mb-2">New Arrivals</h3>
          <p className="mb-4 text-gray-600">Check out our latest collection.</p>
          <Link to="/products">
            <Button variant="outline">Explore</Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
