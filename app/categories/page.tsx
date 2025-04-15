'use client';

import { useCategories } from "@/hooks/useCategories";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function CategoriesPage() {
  const { data: categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading categories...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Product Categories</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories?.map((category) => (
          <Link key={category.id} href={`/categories/${category.id}`} className="block">
            <Card className="overflow-hidden transition-transform hover:scale-[1.02]">
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={category.image || '/placeholder-category.jpg'}
                  alt={category.name}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-black/40 flex items-end p-6">
                  <h2 className="text-white text-xl font-bold">{category.name}</h2>
                </div>
              </div>
              <CardContent className="p-4">
                <p className="text-gray-600 line-clamp-2">{category.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
} 