import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ListChecks, ArrowUpDown } from 'lucide-react';
import { CategoryItem } from './CategoryItem';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

type SortOption = 'alphabetical' | 'time';
type SortDirection = 'asc' | 'desc';

export const CategoriesList: React.FC<CategoriesListProps> = ({
  categories,
  onCategoryDelete,
  onAddClick,
  addButtonRef,
}) => {
  const [sortBy, setSortBy] = useState<SortOption>('time');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSortClick = (newSortBy: SortOption) => {
    if (sortBy === newSortBy) {
      // Toggle direction if clicking the same sort option
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      // Reset direction when changing sort option
      setSortBy(newSortBy);
      setSortDirection('asc');
    }
  };

  const sortedCategories = [...categories].sort((a, b) => {
    if (sortBy === 'alphabetical') {
      const comparison = a.name.localeCompare(b.name);
      return sortDirection === 'asc' ? comparison : -comparison;
    } else {
      // For time sorting, we'll use the id as a proxy since it's created sequentially
      const comparison = a.id.localeCompare(b.id);
      return sortDirection === 'asc' ? comparison : -comparison;
    }
  });

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
      <div className="flex justify-between items-center mb-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => handleSortClick('alphabetical')}>
              {`Sort Alphabetically ${sortBy === 'alphabetical' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}`}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSortClick('time')}>
              {`Sort by Time Added ${sortBy === 'time' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}`}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
        {sortedCategories.map((category) => (
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