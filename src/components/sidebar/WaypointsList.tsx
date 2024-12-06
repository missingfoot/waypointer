import React from 'react';
import { WaypointItem } from './WaypointItem';

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