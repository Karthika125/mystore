
import { Link } from 'react-router-dom';
import { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link 
      to={`/categories/${category.id}`}
      className="group block rounded-lg border overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="p-6 flex flex-col items-center text-center">
        <h3 className="text-lg font-medium group-hover:text-primary transition-colors">
          {category.name}
        </h3>
        {category.description && (
          <p className="mt-2 text-sm text-gray-500">{category.description}</p>
        )}
      </div>
    </Link>
  );
}
