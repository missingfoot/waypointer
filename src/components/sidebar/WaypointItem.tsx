import React from 'react';
import { Button } from '@/components/ui/button';

interface WaypointItemProps {
  id: string;
  name: string;
  category: string;
  categoryColor: string;
  x: number;
  y: number;
  onDelete: (id: string) => void;
}

export const WaypointItem: React.FC<WaypointItemProps> = ({
  id,
  name,
  category,
  categoryColor,
  onDelete,
}) => {
  return (
    <div className="flex items-center justify-between p-2 rounded-md bg-muted relative">
      <div
        className="absolute inset-y-2 left-2 w-1.5 rounded-[9999px]"
        style={{ backgroundColor: categoryColor }}
      />
      <div className="flex flex-col gap-1 pl-4">
        <p className="font-medium">{name}</p>
        <p className="text-sm text-muted-foreground">{category}</p>
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