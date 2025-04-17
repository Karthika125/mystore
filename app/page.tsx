'use client';

import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-4 space-y-4">
          <Skeleton className="aspect-square rounded-lg" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-light-pink/20">
      {/* Hero Section */}
      <div className="relative h-[500px] bg-gradient-to-r from-primary-pink to-accent-pink overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="modern-container relative h-full flex flex-col justify-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Discover Your Perfect Style
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl">
            Explore our curated collection of premium products, designed to elevate your lifestyle with quality and elegance.
          </p>
          <div className="flex gap-4">
            <Link 
              href="/products" 
              className="px-8 py-3 bg-white text-accent-pink rounded-full font-semibold hover:bg-light-pink transition-colors"
            >
              Explore Collection
            </Link>
            <Link 
              href="/categories" 
              className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition-colors"
            >
              Browse Categories
            </Link>
          </div>
        </div>
      </div>

      <div className="modern-container py-12 space-y-16">
        {/* Featured Categories */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-text-dark">Shop by Category</h2>
            <Link 
              href="/categories"
              className="text-accent-pink hover:text-dark-pink transition-colors flex items-center gap-2"
            >
              View All Categories
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {categoriesLoading ? (
            <LoadingSkeleton />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories?.slice(0, 4).map((category) => (
                <Link 
                  key={category.id}
                  href={`/categories/${category.id}`}
                  className="group block"
                >
                  <div className="relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-lg transition-all duration-300">
                    <div className="aspect-square relative">
                      <Image
                        src={category.image || '/placeholder-category.jpg'}
                        alt={category.name}
                        fill
                        className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-lg font-semibold text-white group-hover:text-primary-pink transition-colors">
                          {category.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Featured Products */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-text-dark">Featured Products</h2>
            <Link 
              href="/products"
              className="text-accent-pink hover:text-dark-pink transition-colors flex items-center gap-2"
            >
              View All Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {productsLoading ? (
            <LoadingSkeleton />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {products?.slice(0, 4).map((product) => (
                <Link 
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group block"
                >
                  <div className="relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 p-4">
                    <div className="aspect-square relative mb-4">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <h3 className="font-semibold text-text-dark group-hover:text-accent-pink transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-accent-pink font-semibold mt-2">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Special Offers Banner */}
        <section className="bg-gradient-to-r from-primary-pink to-accent-pink rounded-2xl overflow-hidden">
          <div className="px-8 py-12 md:py-16 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Special Offers</h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Discover amazing deals on our premium products. Limited time offers available now!
            </p>
            <Link 
              href="/products"
              className="inline-block px-8 py-3 bg-white text-accent-pink rounded-full font-semibold hover:bg-light-pink transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
} 