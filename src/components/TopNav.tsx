import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Move, Home, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TopNavProps {
  isAddingWaypoint: boolean;
  onToggleAddWaypoint: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  isAddingWaypoint,
  onToggleAddWaypoint,
  theme,
  onToggleTheme,
}) => {
  const [isMoving, setIsMoving] = React.useState(true);

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
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Home className="h-4 w-4" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              My Project
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem className="py-3 px-4 text-sm cursor-pointer">
              Project Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="py-3 px-4 text-sm cursor-pointer">
              Rename Project
            </DropdownMenuItem>
            <DropdownMenuItem className="py-3 px-4 text-sm cursor-pointer">
              Duplicate Project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
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