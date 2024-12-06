import React from 'react';
import { Button } from '@/components/ui/button';

interface CategoryItemProps {
  id: string;
  name: string;
  color: string;
  onDelete: (id: string) => void;
}

export const CategoryItem: React.FC<CategoryItemProps> = ({
  id,
  name,
  color,
  onDelete,
}) => {
  return (
    <div className="flex items-center justify-between p-2 rounded-md bg-muted relative">
      <div
        className="absolute inset-y-2 left-2 w-1.5 rounded-[9999px]"
        style={{ backgroundColor: color }}
      />
      <div className="flex items-center gap-2 pl-4">
        <span>{name}</span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(id)}
      >
        Delete
      </Button>
    </div>
  );
};