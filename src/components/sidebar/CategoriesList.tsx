import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CategoryItem } from './CategoryItem';

interface Category {
  id: string;
  name: string;
  color: string;
}

interface CategoriesListProps {
  categories: Category[];
  onCategoryDelete: (id: string) => void;
  onAddClick: () => void;
  addButtonRef: React.RefObject<HTMLButtonElement>;
}

export const CategoriesList: React.FC<CategoriesListProps> = ({
  categories,
  onCategoryDelete,
  onAddClick,
  addButtonRef,
}) => {
  return (
    <>
      <div className="flex justify-end">
        <Button
          ref={addButtonRef}
          size="icon"
          variant="ghost"
          onClick={onAddClick}
          className="h-8 w-8"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-2">
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            id={category.id}
            name={category.name}
            color={category.color}
            onDelete={onCategoryDelete}
          />
        ))}
      </div>
    </>
  );
};