import Image from 'next/image';
import Link from 'next/link';
import { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const placeholderImage = '/images/placeholder-category.jpg';

  return (
    <Link 
      href={`/categories/${category.id}`}
      className="group relative overflow-hidden rounded-lg bg-white shadow-md transition-transform hover:scale-105"
    >
      <div className="aspect-square relative w-full overflow-hidden">
        <Image
          src={category.image || placeholderImage}
          alt={category.name}
          fill
          className="object-cover transition-transform group-hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = placeholderImage;
          }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-0 p-4 text-white">
        <h3 className="text-xl font-semibold">{category.name}</h3>
        {category.description && (
          <p className="mt-1 text-sm text-white/90">{category.description}</p>
        )}
      </div>
    </Link>
  );
} 