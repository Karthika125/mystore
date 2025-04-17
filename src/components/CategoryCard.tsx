import Image from 'next/image';
import Link from 'next/link';
import { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/categories/${category.id}`}>
      <div className="card hover-lift h-full p-4 fade-in">
        <div className="relative aspect-square w-full mb-3 overflow-hidden rounded-lg">
          <Image
            src={category.image || '/category-placeholder.png'}
            alt={category.name}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        
        <div className="space-y-2">
          <h3 className="font-semibold text-lg text-center">{category.name}</h3>
          {category.description && (
            <p className="text-text-light text-sm text-center line-clamp-2">
              {category.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
