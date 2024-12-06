import React from 'react';
import { Button } from '@/components/ui/button';
import { ListChecks, Plus } from 'lucide-react';

interface CategoriesEmptyStateProps {
  onAddClick: () => void;
  addButtonRef: React.RefObject<HTMLButtonElement>;
}

export const CategoriesEmptyState: React.FC<CategoriesEmptyStateProps> = ({
  onAddClick,
  addButtonRef,
}) => {
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
};