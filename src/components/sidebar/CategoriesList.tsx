import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ListChecks } from 'lucide-react';
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
      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[200px] text-center space-y-4 text-muted-foreground">
          <ListChecks className="w-8 h-8" />
          <p>
            Set up categories to organize your waypoints, or add them automatically as you create new waypoints
          </p>
        </div>
      ) : (
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
      )}
    </>
  );
};