import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
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
  const [filterText, setFilterText] = useState('');

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category?.color || '#9b87f5';
  };

  const filteredWaypoints = waypoints.filter(waypoint =>
    waypoint.name.toLowerCase().includes(filterText.toLowerCase()) ||
    waypoint.category.toLowerCase().includes(filterText.toLowerCase())
  );

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
      <div className="space-y-2 mb-2">
        <Input
          placeholder="Filter waypoints..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="h-8"
        />
      </div>
      {filteredWaypoints.map((waypoint) => (
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