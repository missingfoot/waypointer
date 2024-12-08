import React from 'react';
import { MapWorkspace } from '@/components/MapWorkspace';
import { Sidebar } from '@/components/Sidebar';
import { TopNav } from '@/components/TopNav';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { useTheme } from 'next-themes';
import { useMapState } from '@/hooks/useMapState';

const Index = () => {
  const { theme, setTheme } = useTheme();
  const {
    mapUrl,
    projectName,
    waypoints,
    categories,
    isAddingWaypoint,
    isDebugMode,
    setProjectName,
    setIsAddingWaypoint,
    setIsDebugMode,
    handlers
  } = useMapState();

  return (
    <div className="h-screen flex flex-col">
      <div className="order-none sm:order-last flex-1 flex overflow-hidden">
        <div className="flex-col w-full sm:hidden">
          <ResizablePanelGroup 
            direction="vertical"
            className="w-full [&>div]:flex-1"
            autoSaveId="workspace-layout-mobile"
          >
            <ResizablePanel 
              defaultSize={75} 
              minSize={30}
              maxSize={85}
            >
              <MapWorkspace
                onMapUpload={handlers.handleMapUpload}
                mapUrl={mapUrl}
                waypoints={waypoints}
                onWaypointAdd={handlers.handleWaypointAdd}
                onWaypointEdit={handlers.handleWaypointEdit}
                isAddingWaypoint={isAddingWaypoint}
                categories={categories}
                onCategoryAdd={handlers.handleCategoryAdd}
                isDebugMode={isDebugMode}
                setIsDebugMode={setIsDebugMode}
              />
            </ResizablePanel>
            <ResizableHandle className="relative h-0 -mb-2 z-30 bg-transparent hover:bg-transparent focus-visible:outline-none focus-visible:ring-0 after:hidden data-[panel-group-direction=vertical]:after:hidden">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-1 bg-border/40 hover:bg-border/60 rounded-full transition-colors cursor-row-resize" />
            </ResizableHandle>
            <ResizablePanel 
              defaultSize={25} 
              minSize={15} 
              maxSize={70}
              className="relative min-h-[240px] bg-card rounded-t-xl shadow-[0_-8px_16px_rgba(0,0,0,0.1)] z-20 -mt-2"
            >
              <div className="h-4" />
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#dddddd] dark:bg-[#444444] rounded-full" />
              <Sidebar
                waypoints={waypoints}
                categories={categories}
                onWaypointDelete={handlers.handleWaypointDelete}
                onCategoryAdd={handlers.handleCategoryAdd}
                onCategoryDelete={handlers.handleCategoryDelete}
                onToggleAddWaypoint={() => setIsAddingWaypoint(!isAddingWaypoint)}
                isAddingWaypoint={isAddingWaypoint}
                mapUrl={mapUrl}
                onMapUpload={handlers.handleMapUpload}
                onMapDelete={handlers.handleMapDelete}
                onClearWaypoints={handlers.handleClearWaypoints}
                onClearCategories={handlers.handleClearCategories}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
        <div className="hidden sm:flex w-full">
          <ResizablePanelGroup 
            direction="horizontal"
            className="w-full"
            autoSaveId="workspace-layout-desktop"
          >
            <ResizablePanel 
              defaultSize={20}
              minSize={20}
              maxSize={35}
              style={{ 
                minWidth: '280px',
                maxWidth: '400px',
                width: '280px'
              }}
            >
              <Sidebar
                waypoints={waypoints}
                categories={categories}
                onWaypointDelete={handlers.handleWaypointDelete}
                onCategoryAdd={handlers.handleCategoryAdd}
                onCategoryDelete={handlers.handleCategoryDelete}
                onToggleAddWaypoint={() => setIsAddingWaypoint(!isAddingWaypoint)}
                isAddingWaypoint={isAddingWaypoint}
                mapUrl={mapUrl}
                onMapUpload={handlers.handleMapUpload}
                onMapDelete={handlers.handleMapDelete}
                onClearWaypoints={handlers.handleClearWaypoints}
                onClearCategories={handlers.handleClearCategories}
              />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={80}>
              <MapWorkspace
                onMapUpload={handlers.handleMapUpload}
                mapUrl={mapUrl}
                waypoints={waypoints}
                onWaypointAdd={handlers.handleWaypointAdd}
                onWaypointEdit={handlers.handleWaypointEdit}
                isAddingWaypoint={isAddingWaypoint}
                categories={categories}
                onCategoryAdd={handlers.handleCategoryAdd}
                isDebugMode={isDebugMode}
                setIsDebugMode={setIsDebugMode}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
      <div className="order-last sm:order-none">
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
          onImport={handlers.handleImportWorkspace}
        />
      </div>
    </div>
  );
};

export default Index;