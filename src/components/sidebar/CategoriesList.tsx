import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CategoryItem } from './CategoryItem';

interface CategoriesListProps {
  categories: Array<{ id: string; name: string; color: string }>;
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
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <Button
          ref={addButtonRef}
          variant="outline"
          size="sm"
          className="h-7"
          onClick={(e) => {
            const buttonRect = e.currentTarget.getBoundingClientRect();
            // Update the click handler to set position at the right side of the button
            const position = {
              x: buttonRect.right + 10, // 10px offset from the button
              y: buttonRect.top + (buttonRect.height / 2), // Centered vertically
            };
            onAddClick();
          }}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add category
        </Button>
      </div>

      {categories.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          No categories yet. Add one to get started.
        </div>
      ) : (
        <div className="space-y-1">
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
    </div>
  );
};