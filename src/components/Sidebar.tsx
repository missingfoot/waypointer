import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Folder, Paintbrush, Settings } from 'lucide-react';

interface SidebarProps {
  waypoints: Waypoint[];
  categories: Category[];
  onWaypointDelete: (id: string) => void;
  onCategoryAdd: (name: string) => void;
  onCategoryDelete: (id: string) => void;
  onToggleAddWaypoint: () => void;
  isAddingWaypoint: boolean;
}

interface Waypoint {
  id: string;
  name: string;
  category: string;
}

interface Category {
  id: string;
  name: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  waypoints,
  categories,
  onWaypointDelete,
  onCategoryAdd,
  onCategoryDelete,
  onToggleAddWaypoint,
  isAddingWaypoint,
}) => {
  const [newCategory, setNewCategory] = React.useState('');

  return (
    <div className="w-80 border-r border-border bg-card">
      <Tabs defaultValue="waypoints" className="h-full flex flex-col">
        <TabsList className="justify-start px-4 pt-4 pb-0 h-auto bg-transparent border-b border-border">
          <TabsTrigger value="waypoints" className="gap-2 data-[state=active]:bg-muted">
            <MapPin className="w-4 h-4" />
            Waypoints
          </TabsTrigger>
          <TabsTrigger value="categories" className="gap-2 data-[state=active]:bg-muted">
            <Folder className="w-4 h-4" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="design" className="gap-2 data-[state=active]:bg-muted">
            <Paintbrush className="w-4 h-4" />
            Design
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2 data-[state=active]:bg-muted">
            <Settings className="w-4 h-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="waypoints" className="flex-1 px-4 py-4 space-y-4">
          <div className="space-y-2">
            <Button
              onClick={onToggleAddWaypoint}
              variant={isAddingWaypoint ? "secondary" : "default"}
              className="w-full"
            >
              {isAddingWaypoint ? 'Cancel Adding Waypoint' : 'Add New Waypoint'}
            </Button>
          </div>
          <div className="space-y-2">
            {waypoints.map((waypoint) => (
              <div
                key={waypoint.id}
                className="flex items-center justify-between p-2 rounded-md bg-muted"
              >
                <div>
                  <p className="font-medium">{waypoint.name}</p>
                  <p className="text-sm text-muted-foreground">{waypoint.category}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onWaypointDelete(waypoint.id)}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="flex-1 px-4 py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-category">New Category</Label>
            <div className="flex gap-2">
              <Input
                id="new-category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Category name"
              />
              <Button
                onClick={() => {
                  if (newCategory.trim()) {
                    onCategoryAdd(newCategory.trim());
                    setNewCategory('');
                  }
                }}
              >
                Add
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-2 rounded-md bg-muted"
              >
                <span>{category.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onCategoryDelete(category.id)}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="design" className="flex-1 p-4">
          <p className="text-muted-foreground">Design settings coming soon...</p>
        </TabsContent>

        <TabsContent value="settings" className="flex-1 p-4">
          <p className="text-muted-foreground">Additional settings coming soon...</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};