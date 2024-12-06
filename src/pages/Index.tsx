import React, { useState } from 'react';
import { MapWorkspace } from '@/components/MapWorkspace';
import { Sidebar } from '@/components/Sidebar';
import { TopNav } from '@/components/TopNav';
import { toast } from 'sonner';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

interface Waypoint {
  id: string;
  x: number;
  y: number;
  name: string;
  category: string;
}

interface Category {
  id: string;
  name: string;
}

const Index = () => {
  const [mapUrl, setMapUrl] = useState<string | null>(null);
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAddingWaypoint, setIsAddingWaypoint] = useState(false);

  const handleMapUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setMapUrl(url);
    toast.success('Map uploaded successfully', {
      position: 'top-right'
    });
  };

  const handleWaypointAdd = (point: { x: number; y: number; name: string; category: string }) => {
    const newWaypoint: Waypoint = {
      id: Math.random().toString(36).substr(2, 9),
      ...point,
    };

    setWaypoints([...waypoints, newWaypoint]);
    toast.success('Waypoint added successfully', {
      position: 'top-right'
    });
  };

  const handleWaypointDelete = (id: string) => {
    setWaypoints(waypoints.filter((wp) => wp.id !== id));
    toast.success('Waypoint deleted successfully', {
      position: 'top-right'
    });
  };

  const handleCategoryAdd = (name: string) => {
    if (categories.some(cat => cat.name === name)) {
      toast.error('Category already exists', {
        position: 'top-right'
      });
      return;
    }
    
    const newCategory: Category = {
      id: Math.random().toString(36).substr(2, 9),
      name,
    };
    setCategories([...categories, newCategory]);
    toast.success('Category added successfully', {
      position: 'top-right'
    });
  };

  const handleCategoryDelete = (id: string) => {
    setCategories(categories.filter((cat) => cat.id !== id));
    toast.success('Category deleted successfully', {
      position: 'top-right'
    });
  };

  return (
    <div className="h-screen flex flex-col">
      <TopNav 
        isAddingWaypoint={isAddingWaypoint}
        onToggleAddWaypoint={() => setIsAddingWaypoint(!isAddingWaypoint)}
      />
      <div className="flex-1 flex overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={20} minSize={15} maxSize={40}>
            <Sidebar
              waypoints={waypoints}
              categories={categories}
              onWaypointDelete={handleWaypointDelete}
              onCategoryAdd={handleCategoryAdd}
              onCategoryDelete={handleCategoryDelete}
              onToggleAddWaypoint={() => setIsAddingWaypoint(!isAddingWaypoint)}
              isAddingWaypoint={isAddingWaypoint}
            />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={80}>
            <MapWorkspace
              onMapUpload={handleMapUpload}
              mapUrl={mapUrl}
              waypoints={waypoints}
              onWaypointAdd={handleWaypointAdd}
              isAddingWaypoint={isAddingWaypoint}
              categories={categories}
              onCategoryAdd={handleCategoryAdd}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Index;