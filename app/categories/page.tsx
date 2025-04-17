'use client';

import { useCategories } from "@/hooks/useCategories";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CategoriesPage() {
  const { data: categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">No Categories Found</h2>
        <p className="text-gray-500">Check back later for new categories.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-light-pink">
      <div className="modern-container py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text-dark mb-4">Shop by Category</h1>
          <p className="text-text-light text-lg max-w-2xl mx-auto">
            Browse our carefully curated categories to find exactly what you're looking for.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              href={`/categories/${category.id}`}
              className="group block"
            >
              <div className="relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-primary-pink/20">
                <div className="absolute inset-0 bg-gradient-to-b from-primary-pink/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="aspect-[4/3] relative">
                  <Image
                    src={category.image || '/placeholder-category.jpg'}
                    alt={category.name}
                    fill
                    className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-primary-pink transition-colors duration-300">
                    {category.name}
                  </h3>
                  <p className="text-white/90 line-clamp-2 group-hover:text-white transition-colors duration-300">
                    {category.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 