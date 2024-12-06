import React, { useState, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CategoryDialog } from './dialogs/CategoryDialog';
import { WaypointsList } from './sidebar/WaypointsList';
import { CategoriesList } from './sidebar/CategoriesList';

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

  return (
    <div className="w-full border-r border-border bg-card">
      <Tabs defaultValue="waypoints" className="h-full flex flex-col">
        <TabsList className="justify-start px-4 pt-4 pb-2 h-auto bg-transparent border-0">
          <TabsTrigger 
            value="waypoints" 
            className="data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:font-medium data-[state=inactive]:text-muted-foreground bg-transparent px-2"
          >
            Waypoints
          </TabsTrigger>
          <TabsTrigger 
            value="categories" 
            className="data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:font-medium data-[state=inactive]:text-muted-foreground bg-transparent px-2"
          >
            Categories
          </TabsTrigger>
          <TabsTrigger 
            value="design" 
            className="data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:font-medium data-[state=inactive]:text-muted-foreground bg-transparent px-2"
          >
            Design
          </TabsTrigger>
          <TabsTrigger 
            value="settings" 
            className="data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:font-medium data-[state=inactive]:text-muted-foreground bg-transparent px-2"
          >
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="waypoints" className="flex-1 px-4 py-4 space-y-4">
          <WaypointsList
            waypoints={waypoints}
            categories={categories}
            onWaypointDelete={onWaypointDelete}
          />
        </TabsContent>

        <TabsContent value="categories" className="flex-1 px-4 py-4 space-y-4">
          <CategoriesList
            categories={categories}
            onCategoryDelete={onCategoryDelete}
            onAddClick={handleAddCategoryClick}
            addButtonRef={addButtonRef}
          />
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