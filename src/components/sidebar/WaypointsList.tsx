import React from 'react';
import { WaypointItem } from './WaypointItem';
import { MapPin } from 'lucide-react';

interface Waypoint {
  id: string;
  name: string;
  category: string;
}

interface Category {
  id: string;
  name: string;
  color: string;
}

interface WaypointsListProps {
  waypoints: Waypoint[];
  categories: Category[];
  onWaypointDelete: (id: string) => void;
}

export const WaypointsList: React.FC<WaypointsListProps> = ({
  waypoints,
  categories,
  onWaypointDelete,
}) => {
  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category?.color || '#9b87f5';
  };

  if (waypoints.length === 0) {
    return (
      <div className="flex flex-col items-start pt-8 space-y-4 text-left">
        <MapPin className="w-8 h-8 text-muted-foreground" />
        <p className="text-muted-foreground">
          After adding a map image, select the waypoints tool <MapPin className="w-4 h-4 inline-block mx-1" /> and click on the map to add waypoints
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {waypoints.map((waypoint) => (
        <WaypointItem
          key={waypoint.id}
          id={waypoint.id}
          name={waypoint.name}
          category={waypoint.category}
          categoryColor={getCategoryColor(waypoint.category)}
          onDelete={onWaypointDelete}
        />
      ))}
    </div>
  );
};