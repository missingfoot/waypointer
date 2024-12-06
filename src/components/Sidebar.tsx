import React, { useState, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CategoryDialog } from './dialogs/CategoryDialog';

interface SidebarProps {
  waypoints: Waypoint[];
  categories: Category[];
  onWaypointDelete: (id: string) => void;
  onCategoryAdd: (name: string, color: string) => void;
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
  color: string;
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
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [dialogPosition, setDialogPosition] = useState({ x: 0, y: 0 });
  const addButtonRef = useRef<HTMLButtonElement>(null);

  const handleAddCategoryClick = () => {
    const buttonRect = addButtonRef.current?.getBoundingClientRect();
    if (buttonRect) {
      setDialogPosition({
        x: buttonRect.left,
        y: buttonRect.bottom + 5
      });
    }
    setIsCategoryDialogOpen(true);
  };

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category?.color || '#9b87f5';
  };

  return (
    <div className="w-full border-r border-border bg-card">
      <Tabs defaultValue="waypoints" className="h-full flex flex-col">
        <TabsList className="justify-start px-4 pt-4 pb-0 h-auto bg-transparent border-b border-border">
          <TabsTrigger value="waypoints" className="data-[state=active]:bg-muted">
            Waypoints
          </TabsTrigger>
          <TabsTrigger value="categories" className="data-[state=active]:bg-muted">
            Categories
          </TabsTrigger>
          <TabsTrigger value="design" className="data-[state=active]:bg-muted">
            Design
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-muted">
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="waypoints" className="flex-1 px-4 py-4 space-y-4">
          <div className="space-y-2">
            {waypoints.map((waypoint) => (
              <div
                key={waypoint.id}
                className="flex items-center justify-between p-2 rounded-md bg-muted relative"
              >
                <div
                  className="absolute inset-y-2 left-2 w-6 rounded-md"
                  style={{ backgroundColor: getCategoryColor(waypoint.category) }}
                />
                <div className="flex items-center gap-2 pl-8">
                  <div>
                    <p className="font-medium">{waypoint.name}</p>
                    <p className="text-sm text-muted-foreground">{waypoint.category}</p>
                  </div>
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
          <div className="flex justify-end">
            <Button
              ref={addButtonRef}
              size="icon"
              variant="ghost"
              onClick={handleAddCategoryClick}
              className="h-8 w-8"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-2 rounded-md bg-muted relative"
              >
                <div
                  className="absolute inset-y-2 left-2 w-6 rounded-md"
                  style={{ backgroundColor: category.color }}
                />
                <div className="flex items-center gap-2 pl-8">
                  <span>{category.name}</span>
                </div>
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

      <CategoryDialog
        open={isCategoryDialogOpen}
        onOpenChange={setIsCategoryDialogOpen}
        onSubmit={onCategoryAdd}
        categories={categories}
        position={dialogPosition}
      />
    </div>
  );
};