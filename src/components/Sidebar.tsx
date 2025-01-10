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
  onWaypointEdit: (id: string, updates: { name: string; category: string }) => void;
  onWaypointDelete: (id: string) => void;
  onCategoryAdd: (name: string, color: string) => void;
  onCategoryDelete: (id: string) => void;
  mapImage: { width: number; height: number } | null;
  hasWaypoints: boolean;
  onReplaceImage: (file: File) => void;
  onDeleteImage: () => void;
  onClearWaypoints: () => void;
  onClearCategories: () => void;
  onLoadExample: () => void;
  onWaypointClick: (waypointId: string, screenPosition: { x: number; y: number }) => void;
}

interface Waypoint {
  id: string;
  x: number;
  y: number;
  name: string;
  category: string;
  timestamp: number;
  sequence: number;
}

interface Category {
  id: string;
  name: string;
  color: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  waypoints,
  categories,
  onWaypointEdit,
  onWaypointDelete,
  onCategoryAdd,
  onCategoryDelete,
  mapImage,
  hasWaypoints,
  onReplaceImage,
  onDeleteImage,
  onClearWaypoints,
  onClearCategories,
  onLoadExample,
  onWaypointClick,
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
    <div className="w-full bg-card h-full flex flex-col">
      <Tabs defaultValue="waypoints" className="h-full flex flex-col">
        <TabsHeader className="flex-none" />

        <div className="flex-1 px-4 pt-4 min-h-0">
          <TabsContent value="waypoints" className="mt-0 h-full relative">
            <WaypointsList
              waypoints={waypoints}
              categories={categories}
              onWaypointDelete={onWaypointDelete}
              onWaypointEdit={onWaypointEdit}
              onWaypointClick={onWaypointClick}
            />
          </TabsContent>

          <TabsContent value="categories" className="mt-0 h-full relative">
            <CategoriesList
              categories={categories}
              onCategoryDelete={onCategoryDelete}
              onAddClick={handleAddCategoryClick}
              addButtonRef={addButtonRef}
            />
          </TabsContent>

          <TabsContent value="settings" className="mt-0 h-full relative">
            <SettingsTab
              mapImage={mapImage}
              hasWaypoints={hasWaypoints}
              onReplaceImage={onReplaceImage}
              onDeleteImage={onDeleteImage}
              onClearWaypoints={onClearWaypoints}
              onClearCategories={onClearCategories}
              onLoadExample={onLoadExample}
            />
          </TabsContent>
        </div>
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