import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Move } from 'lucide-react';

interface TopNavProps {
  isAddingWaypoint: boolean;
  onToggleAddWaypoint: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  isAddingWaypoint,
  onToggleAddWaypoint,
}) => {
  return (
    <div className="h-14 border-b border-border px-4 flex items-center bg-card">
      <Button variant="ghost">
        Dashboard
      </Button>
      
      <div className="flex-1 flex justify-center gap-2">
        <Button 
          variant={isAddingWaypoint ? "secondary" : "ghost"} 
          size="icon"
          onClick={onToggleAddWaypoint}
          className="w-9 h-9"
        >
          <MapPin className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          className="w-9 h-9"
        >
          <Move className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost">
          Profile
        </Button>
        <Button>
          Publish
        </Button>
      </div>
    </div>
  );
};