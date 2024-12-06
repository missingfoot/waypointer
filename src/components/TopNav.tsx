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
  const [isMoving, setIsMoving] = React.useState(false);

  const handleWaypointClick = () => {
    if (isMoving) setIsMoving(false);
    onToggleAddWaypoint();
  };

  const handleMoveClick = () => {
    if (isAddingWaypoint) onToggleAddWaypoint();
    setIsMoving(!isMoving);
  };

  return (
    <div className="h-14 border-b border-border px-4 flex items-center bg-card">
      <Button variant="ghost">
        Dashboard
      </Button>
      
      <div className="flex-1 flex justify-center gap-2">
        <Button 
          variant={isAddingWaypoint ? "default" : "ghost"} 
          size="icon"
          onClick={handleWaypointClick}
          className={`w-9 h-9 ${isAddingWaypoint ? 'bg-blue-500 hover:bg-blue-600' : ''}`}
        >
          <MapPin className="h-4 w-4" />
        </Button>
        <Button 
          variant={isMoving ? "default" : "ghost"}
          size="icon"
          onClick={handleMoveClick}
          className={`w-9 h-9 ${isMoving ? 'bg-blue-500 hover:bg-blue-600' : ''}`}
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