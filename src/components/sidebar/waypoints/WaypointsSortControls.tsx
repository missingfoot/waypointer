import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type SortOption = 'alphabetical' | 'time';
type SortDirection = 'asc' | 'desc';

interface WaypointsSortControlsProps {
  sortBy: SortOption;
  sortDirection: SortDirection;
  onSortChange: (newSortBy: SortOption) => void;
}

export const WaypointsSortControls: React.FC<WaypointsSortControlsProps> = ({
  sortBy,
  sortDirection,
  onSortChange,
}) => {
  const getSortLabel = () => {
    return sortBy === 'alphabetical' ? 'Name' : 'Time added';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 px-3"
        >
          {getSortLabel()}
          {sortDirection === 'asc' ? (
            <ArrowUp className="h-4 w-4 ml-1" />
          ) : (
            <ArrowDown className="h-4 w-4 ml-1" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => onSortChange('alphabetical')}>
          Sort by name {sortBy === 'alphabetical' && (sortDirection === 'asc' ? <ArrowUp className="h-4 w-4 ml-1" /> : <ArrowDown className="h-4 w-4 ml-1" />)}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSortChange('time')}>
          Sort by time added {sortBy === 'time' && (sortDirection === 'asc' ? <ArrowUp className="h-4 w-4 ml-1" /> : <ArrowDown className="h-4 w-4 ml-1" />)}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};