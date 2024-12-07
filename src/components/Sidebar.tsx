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
  mapUrl: string | null;
  onMapUpload: (file: File) => void;
  onMapDelete: () => void;
  onClearWaypoints: () => void;
  onClearCategories: () => void;
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
  mapUrl,
  onMapUpload,
  onMapDelete,
  onClearWaypoints,
  onClearCategories,
}) => {
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [dialogPosition, setDialogPosition] = useState({ x: 0, y: 0 });
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const [mapDimensions, setMapDimensions] = useState<{ width: number; height: number } | null>(null);

  React.useEffect(() => {
    if (mapUrl) {
      const img = new Image();
      img.onload = () => {
        setMapDimensions({ width: img.width, height: img.height });
      };
      img.src = mapUrl;
    } else {
      setMapDimensions(null);
    }
  }, [mapUrl]);

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
              mapImage={mapDimensions}
              hasWaypoints={waypoints.length > 0}
              onReplaceImage={onMapUpload}
              onDeleteImage={onMapDelete}
              onClearWaypoints={onClearWaypoints}
              onClearCategories={onClearCategories}
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