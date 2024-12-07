import React from 'react';
import { MapWorkspace } from '@/components/MapWorkspace';
import { Sidebar } from '@/components/Sidebar';
import { TopNav } from '@/components/TopNav';
import { toast } from 'sonner';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { useTheme } from 'next-themes';

const Index = () => {
  const [mapUrl, setMapUrl] = React.useState<string | null>(null);
  const [projectName, setProjectName] = React.useState("My Project");
  const [waypoints, setWaypoints] = React.useState<Array<{
    id: string;
    x: number;
    y: number;
    name: string;
    category: string;
  }>>([]);
  const [categories, setCategories] = React.useState<Array<{
    id: string;
    name: string;
    color: string;
  }>>([]);
  const [isAddingWaypoint, setIsAddingWaypoint] = React.useState(false);
  const [isDebugMode, setIsDebugMode] = React.useState(false);
  const { theme, setTheme } = useTheme();

  const handleMapUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setMapUrl(url);
    toast.success('Map uploaded successfully', {
      position: 'top-right'
    });
  };

  const handleMapDelete = () => {
    setMapUrl(null);
    toast.success('Map deleted successfully', {
      position: 'top-right'
    });
  };

  const handleClearWaypoints = () => {
    setWaypoints([]);
    toast.success('All waypoints cleared', {
      position: 'top-right'
    });
  };

  const handleClearCategories = () => {
    setCategories([]);
    // Also clear category assignments from waypoints
    setWaypoints(waypoints.map(wp => ({ ...wp, category: '' })));
    toast.success('All categories cleared', {
      position: 'top-right'
    });
  };

  const handleWaypointAdd = (point: { x: number; y: number; name: string; category: string }) => {
    const newWaypoint = {
      id: Math.random().toString(36).substr(2, 9),
      ...point,
    };

    setWaypoints([...waypoints, newWaypoint]);
    
    if (!categories.some(cat => cat.name === point.category)) {
      const categoryColors = ['#9b87f5', '#F97316', '#0EA5E9', '#D946EF', '#33C3F0', '#FEC6A1', '#E5DEFF', '#D3E4FD', '#8B5CF6', '#1EAEDB'];
      const color = categoryColors[categories.length % categoryColors.length];
      const newCategory = {
        id: Math.random().toString(36).substr(2, 9),
        name: point.category,
        color: color,
      };
      setCategories(prevCategories => [...prevCategories, newCategory]);
    }
    
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

  const handleCategoryAdd = (name: string, color: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    
    if (categories.some(cat => cat.name.toLowerCase() === trimmedName.toLowerCase())) {
      toast.error('Category already exists', {
        position: 'top-right'
      });
      return;
    }
    
    const newCategory = {
      id: Math.random().toString(36).substr(2, 9),
      name: trimmedName,
      color: color,
    };
    setCategories(prevCategories => [...prevCategories, newCategory]);
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

  const handleImportWorkspace = (imageUrl: string, importedWaypoints: Array<any>, importedCategories: Array<any>) => {
    console.log('Handling import in Index:', { imageUrl, importedWaypoints, importedCategories });
    setMapUrl(imageUrl);
    setWaypoints(importedWaypoints);
    setCategories(importedCategories);
  };

  return (
    <div className="h-screen flex flex-col">
      <TopNav
        isAddingWaypoint={isAddingWaypoint}
        onToggleAddWaypoint={() => setIsAddingWaypoint(!isAddingWaypoint)}
        theme={theme as 'light' | 'dark' | 'system'}
        onToggleTheme={setTheme}
        isDebugMode={isDebugMode}
        setIsDebugMode={setIsDebugMode}
        projectName={projectName}
        onProjectNameChange={setProjectName}
        mapUrl={mapUrl}
        waypoints={waypoints}
        categories={categories}
        onImport={handleImportWorkspace}
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
              mapUrl={mapUrl}
              onMapUpload={handleMapUpload}
              onMapDelete={handleMapDelete}
              onClearWaypoints={handleClearWaypoints}
              onClearCategories={handleClearCategories}
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
              isDebugMode={isDebugMode}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Index;