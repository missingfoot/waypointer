import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { WaypointItem } from './WaypointItem';
import { MapPin, Group } from 'lucide-react';
import { WaypointsSortControls } from './waypoints/WaypointsSortControls';
import { Button } from '@/components/ui/button';

interface Waypoint {
  id: string;
  name: string;
  category: string;
  x: number;
  y: number;
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
  onWaypointEdit: (id: string, updates: { name: string; category: string }) => void;
  onWaypointClick: (waypointId: string, screenPosition: { x: number; y: number }) => void;
}

type SortOption = 'alphabetical' | 'time';
type SortDirection = 'asc' | 'desc';

export const WaypointsList: React.FC<WaypointsListProps> = ({
  waypoints,
  categories,
  onWaypointDelete,
  onWaypointEdit,
  onWaypointClick,
}) => {
  const [filterText, setFilterText] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>(() => {
    const saved = localStorage.getItem('waypoints-sort-by');
    return (saved ? JSON.parse(saved) : 'time') as SortOption;
  });
  const [sortDirection, setSortDirection] = useState<SortDirection>(() => {
    const saved = localStorage.getItem('waypoints-sort-direction');
    return (saved ? JSON.parse(saved) : 'asc') as SortDirection;
  });
  const [groupByCategory, setGroupByCategory] = useState<boolean>(() => {
    const saved = localStorage.getItem('waypoints-group-by-category');
    return saved ? JSON.parse(saved) : false;
  });

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category?.color || '#9b87f5';
  };

  const handleSortClick = (newSortBy: SortOption) => {
    if (sortBy === newSortBy) {
      setSortDirection(prev => {
        const newDirection = prev === 'asc' ? 'desc' : 'asc';
        localStorage.setItem('waypoints-sort-direction', JSON.stringify(newDirection));
        return newDirection;
      });
    } else {
      setSortBy(newSortBy);
      setSortDirection('asc');
      localStorage.setItem('waypoints-sort-by', JSON.stringify(newSortBy));
      localStorage.setItem('waypoints-sort-direction', JSON.stringify('asc'));
    }
  };

  const toggleGrouping = () => {
    setGroupByCategory(prev => {
      const newValue = !prev;
      localStorage.setItem('waypoints-group-by-category', JSON.stringify(newValue));
      return newValue;
    });
  };

  const filteredWaypoints = waypoints.filter(waypoint =>
    waypoint.name.toLowerCase().includes(filterText.toLowerCase()) ||
    waypoint.category.toLowerCase().includes(filterText.toLowerCase())
  );

  const sortedWaypoints = [...filteredWaypoints].sort((a, b) => {
    if (sortBy === 'alphabetical') {
      const comparison = a.name.localeCompare(b.name);
      return sortDirection === 'asc' ? comparison : -comparison;
    } else {
      const comparison = a.id.localeCompare(b.id);
      return sortDirection === 'asc' ? comparison : -comparison;
    }
  });

  const groupedWaypoints = groupByCategory
    ? categories.reduce((acc, category) => {
        const categoryWaypoints = sortedWaypoints.filter(
          wp => wp.category === category.name
        );
        if (categoryWaypoints.length > 0) {
          acc.push({
            category: category.name,
            color: category.color,
            waypoints: categoryWaypoints,
          });
        }
        return acc;
      }, [] as Array<{ category: string; color: string; waypoints: Waypoint[] }>)
    : null;

  const handleWaypointEdit = (waypoint: { id: string; name: string; category: string; x: number; y: number }) => {
    onWaypointClick(waypoint.id, { x: 0, y: 0 });
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
    <div className="absolute inset-0 flex flex-col">
      <div className="flex-none space-y-2 mb-2">
        <Input
          placeholder="Filter waypoints..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="h-8"
        />
      </div>
      <div className="flex-none flex justify-between items-center mb-2 -mx-3">
        <WaypointsSortControls
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSortChange={handleSortClick}
        />
        <Button
          size="sm"
          variant="ghost"
          onClick={toggleGrouping}
          className="h-8 px-3"
        >
          {groupByCategory ? 'Ungroup' : 'Group'}
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className={`space-y-${groupByCategory ? '4' : '2'} pb-6`}>
          {groupByCategory && groupedWaypoints ? (
            groupedWaypoints.map(({ category, color, waypoints }) => (
              <div key={category} className="space-y-2">
                <div 
                  className="text-sm font-medium px-2 py-1 rounded-md"
                  style={{ backgroundColor: `${color}20` }}
                >
                  {category}
                </div>
                {waypoints.map((waypoint) => (
                  <WaypointItem
                    key={waypoint.id}
                    id={waypoint.id}
                    name={waypoint.name}
                    category={waypoint.category}
                    categoryColor={getCategoryColor(waypoint.category)}
                    x={waypoint.x}
                    y={waypoint.y}
                    onDelete={onWaypointDelete}
                    onEdit={handleWaypointEdit}
                    hideCategory={true}
                  />
                ))}
              </div>
            ))
          ) : (
            sortedWaypoints.map((waypoint) => (
              <WaypointItem
                key={waypoint.id}
                id={waypoint.id}
                name={waypoint.name}
                category={waypoint.category}
                categoryColor={getCategoryColor(waypoint.category)}
                x={waypoint.x}
                y={waypoint.y}
                onDelete={onWaypointDelete}
                onEdit={handleWaypointEdit}
                hideCategory={false}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};