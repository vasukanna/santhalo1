import React from 'react';
import { Sprout, Apple, Fish, Beef, Wrench, Package } from 'lucide-react';
import { normalizeCategoryId, DEFAULT_CATEGORIES } from '../data/categories';

export interface CategoryIconProps {
  name?: string;
  categoryId?: string;
  className?: string;
  useLucideFallback?: boolean;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  name,
  categoryId = '',
  className = 'w-6 h-6',
  useLucideFallback = false
}) => {
  const norm = normalizeCategoryId(name || categoryId);
  const cat = DEFAULT_CATEGORIES.find((c) => c.id === norm);

  if (!useLucideFallback && cat?.imageUrl) {
    return (
      <img
        src={cat.imageUrl}
        alt={cat.name}
        className={`${className} object-contain`}
        loading="lazy"
      />
    );
  }

  switch (norm) {
    case 'paddy_rice':
      return <Sprout className={`${className} text-emerald-600`} />;
    case 'vegetables_fruits':
      return <Apple className={`${className} text-orange-500`} />;
    case 'aqua':
      return <Fish className={`${className} text-sky-500`} />;
    case 'livestock':
      return <Beef className={`${className} text-amber-700`} />;
    case 'other':
      return <Wrench className={`${className} text-emerald-700`} />;
    default:
      return <Package className={`${className} text-emerald-600`} />;
  }
};
