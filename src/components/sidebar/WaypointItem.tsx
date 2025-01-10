import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

interface WaypointItemProps {
  id: string;
  name: string;
  category: string;
  categoryColor: string;
  x: number;
  y: number;
  onDelete: (id: string) => void;
  onEdit: (waypoint: { id: string; name: string; category: string; x: number; y: number }) => void;
  hideCategory?: boolean;
}

export const WaypointItem: React.FC<WaypointItemProps> = ({
  id,
  name,
  category,
  categoryColor,
  x,
  y,
  onDelete,
  onEdit,
  hideCategory = false,
}) => {
  return (
    <div className="flex items-center justify-between p-2 rounded-md bg-muted relative">
      <div
        className="absolute inset-y-2 left-2 w-1.5 rounded-[9999px]"
        style={{ backgroundColor: categoryColor }}
      />
      <div className="flex flex-col gap-1 pl-4">
        <p className="font-medium">{name}</p>
        {!hideCategory && (
          <p className="text-sm text-muted-foreground">{category}</p>
        )}
      </div>
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit({ id, name, category, x, y })}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};