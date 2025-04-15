
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import ProductGrid from '@/components/ProductGrid';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Product } from '@/types';
import Layout from '@/components/Layout';
import { Search, SlidersHorizontal, X } from 'lucide-react';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || '';
  const searchQuery = searchParams.get('q') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const [search, setSearch] = useState(searchQuery);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [priceRange, setPriceRange] = useState({ min: minPrice, max: maxPrice });
  const [showFilters, setShowFilters] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const { data: products, isLoading: isLoadingProducts } = useProducts();
  const { data: categories, isLoading: isLoadingCategories } = useCategories();

  // Update URL parameters when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory) params.set('category', selectedCategory);
    if (search) params.set('q', search);
    if (priceRange.min) params.set('minPrice', priceRange.min);
    if (priceRange.max) params.set('maxPrice', priceRange.max);
    setSearchParams(params);
  }, [selectedCategory, search, priceRange, setSearchParams]);

  // Filter products based on selected filters
  useEffect(() => {
    if (products) {
      let filtered = [...products];

      // Filter by category
      if (selectedCategory) {
        filtered = filtered.filter(product => product.category_id === selectedCategory);
      }

      // Filter by search query
      if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower)
        );
      }

      // Filter by price range
      if (priceRange.min) {
        filtered = filtered.filter(product => product.price >= parseFloat(priceRange.min));
      }
      if (priceRange.max) {
        filtered = filtered.filter(product => product.price <= parseFloat(priceRange.max));
      }

      setFilteredProducts(filtered);
    }
  }, [products, selectedCategory, search, priceRange]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const searchValue = formData.get('search')?.toString() || '';
    setSearch(searchValue);
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSearch('');
    setPriceRange({ min: '', max: '' });
    setSearchParams({});
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-4">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex justify-between"
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </div>
            {(selectedCategory || search || priceRange.min || priceRange.max) && (
              <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                Active
              </span>
            )}
          </Button>
        </div>

        {/* Filters Sidebar */}
        <div className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0`}>
          <div className="bg-white rounded-lg p-6 border sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">Filters</h2>
              {(selectedCategory || search || priceRange.min || priceRange.max) && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearFilters}
                  className="h-8 px-2 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear all
                </Button>
              )}
            </div>

            <Separator className="my-4" />

            <div className="mb-6">
              <h3 className="font-medium mb-2">Categories</h3>
              {isLoadingCategories ? (
                <div className="space-y-2">
                  {Array(5).fill(0).map((_, i) => (
                    <div key={i} className="h-6 bg-gray-100 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {categories?.map(category => (
                    <div key={category.id} className="flex items-center">
                      <Button
                        variant="ghost"
                        className={`justify-start h-auto py-1 px-2 w-full text-left ${
                          selectedCategory === category.id ? 'bg-primary/10 text-primary font-medium' : ''
                        }`}
                        onClick={() => setSelectedCategory(
                          selectedCategory === category.id ? '' : category.id
                        )}
                      >
                        {category.name}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator className="my-4" />

            <div className="mb-6">
              <h3 className="font-medium mb-3">Price Range</h3>
              <div className="flex gap-2 items-center">
                <div className="w-full">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={e => setPriceRange({ ...priceRange, min: e.target.value })}
                    className="text-sm"
                  />
                </div>
                <span className="text-gray-400">-</span>
                <div className="w-full">
                  <Input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={e => setPriceRange({ ...priceRange, max: e.target.value })}
                    className="text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-6">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Input 
                type="text" 
                name="search"
                placeholder="Search products..." 
                defaultValue={search}
                className="pr-10"
              />
              <Button 
                type="submit" 
                variant="ghost" 
                size="icon"
                className="absolute right-0 top-0 h-full"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Results info */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
            </p>
          </div>

          <ProductGrid products={filteredProducts} isLoading={isLoadingProducts} />
        </div>
      </div>
    </Layout>
  );
}
