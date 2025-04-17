'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/types';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  // guaranteed to be a string
  const imageUrl = category.image || '/placeholder-category.jpg';

  return (
    <Link href={`/categories/${category.id}`} className="block">
      <div className="relative group overflow-hidden rounded-lg border bg-card text-card-foreground shadow h-48">
        <div className="relative h-full w-full">
          <Image
            src={imageUrl}
            alt={category.name}
            width={400}
            height={200}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        <div className="absolute bottom-0 w-full p-4 flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-lg text-white">{category.name}</h3>
            {category.description && (
              <p className="text-sm text-white/80 line-clamp-1">
                {category.description}
              </p>
            )}
          </div>
          <ArrowRight className="text-white h-5 w-5 opacity-0 transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
        </div>
      </div>
    </Link>
  );
}
