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
  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-start pt-8 space-y-4 text-left">
        <ListChecks className="w-8 h-8 text-muted-foreground" />
        <p className="text-muted-foreground">
          Set up categories to organize your waypoints, or add them automatically as you create new waypoints
        </p>
        <Button
          ref={addButtonRef}
          onClick={onAddClick}
          variant="outline"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>
    );
  }

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