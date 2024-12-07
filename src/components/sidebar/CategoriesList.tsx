import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { CategoryItem } from './CategoryItem';
import { CategoriesSortControls } from './categories/CategoriesSortControls';
import { CategoriesEmptyState } from './categories/CategoriesEmptyState';

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
  const [filterText, setFilterText] = useState('');

  const handleSortClick = (newSortBy: SortOption) => {
    if (sortBy === newSortBy) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortDirection('asc');
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const sortedCategories = [...filteredCategories].sort((a, b) => {
    if (sortBy === 'alphabetical') {
      const comparison = a.name.localeCompare(b.name);
      return sortDirection === 'asc' ? comparison : -comparison;
    } else {
      const comparison = a.id.localeCompare(b.id);
      return sortDirection === 'asc' ? comparison : -comparison;
    }
  });

  if (categories.length === 0) {
    return (
      <CategoriesEmptyState
        onAddClick={onAddClick}
        addButtonRef={addButtonRef}
      />
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="flex-none space-y-2 mb-2">
        <Input
          placeholder="Filter categories..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="h-8"
        />
      </div>
      <div className="flex-none flex justify-between items-center mb-2 -mx-3">
        <CategoriesSortControls
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSortChange={handleSortClick}
        />
        <Button
          ref={addButtonRef}
          size="sm"
          variant="ghost"
          onClick={onAddClick}
          className="h-8 px-3"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto min-h-0">
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
      </div>
    </div>
  );
};