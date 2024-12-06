import React, { useState, useRef } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { CategoryDialog } from './dialogs/CategoryDialog';
import { WaypointsList } from './sidebar/WaypointsList';
import { CategoriesList } from './sidebar/CategoriesList';
import { TabsHeader } from './sidebar/TabsHeader';
import { SettingsTab } from './sidebar/SettingsTab';

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
    <div className="w-full bg-card">
      <Tabs defaultValue="waypoints" className="h-full flex flex-col">
        <TabsHeader />

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

        <SettingsTab />
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