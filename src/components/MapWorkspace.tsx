import React, { useRef, useState } from 'react';
import { toast } from 'sonner';
import { MapUploadInterface } from './map/MapUploadInterface';
import { MapContent } from './map/MapContent';
import { useMapControls } from '@/hooks/useMapControls';
import { WaypointDialog } from './dialogs/WaypointDialog';

interface MapWorkspaceProps {
  onMapUpload: (file: File) => void;
  mapUrl: string | null;
  waypoints: Array<{
    id: string;
    x: number;
    y: number;
    name: string;
    category: string;
  }>;
  onWaypointAdd: (point: { x: number; y: number; name: string; category: string }) => void;
  isAddingWaypoint: boolean;
  categories: Array<{ id: string; name: string; color: string }>;
  onCategoryAdd: (name: string, color: string) => void;
}

export const MapWorkspace: React.FC<MapWorkspaceProps> = ({
  onMapUpload,
  mapUrl,
  waypoints,
  onWaypointAdd,
  isAddingWaypoint,
  categories,
  onCategoryAdd,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [hasMouseMoved, setHasMouseMoved] = useState(false);
  const [mouseStartPosition, setMouseStartPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingPoint, setPendingPoint] = useState<{ x: number; y: number } | null>(null);
  const [dialogPosition, setDialogPosition] = useState({ x: 0, y: 0 });
  
  const {
    scale,
    position,
    isDragging,
    containerRef,
    handleZoomIn,
    handleZoomOut,
    handleZoomReset,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useMapControls();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onMapUpload(file);
    } else {
      toast.error('Please upload an image file', {
        position: 'top-right'
      });
    }
  };

  const handleMapMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setHasMouseMoved(false);
    setMouseStartPosition({ x: e.clientX, y: e.clientY });
    handleMouseDown(e);
    if (!isAddingWaypoint) {
      setIsPanning(true);
    }
  };

  const handleMapMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const deltaX = Math.abs(e.clientX - mouseStartPosition.x);
    const deltaY = Math.abs(e.clientY - mouseStartPosition.y);
    
    if (deltaX > 5 || deltaY > 5) {
      setHasMouseMoved(true);
      if (!isAddingWaypoint && isDragging) {
        setIsPanning(true);
      }
    }
    handleMouseMove(e);
  };

  const handleMapMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    handleMouseUp();
    
    if (!isAddingWaypoint || !mapUrl || hasMouseMoved) {
      setIsPanning(false);
      setHasMouseMoved(false);
      return;
    }

    const rect = mapContainerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left);
    const y = (e.clientY - rect.top);
    const adjustedX = (x - position.x) / scale;
    const adjustedY = (y - position.y) / scale;
    const percentX = (adjustedX / rect.width) * 100;
    const percentY = (adjustedY / rect.height) * 100;
    const gridX = Math.round(percentX / 10) * 10;
    const gridY = Math.round(percentY / 10) * 10;
    const boundedX = Math.max(0, Math.min(100, gridX));
    const boundedY = Math.max(0, Math.min(100, gridY));

    setPendingPoint({ x: boundedX, y: boundedY });
    setDialogPosition({ x: e.clientX, y: e.clientY });
    setDialogOpen(true);
    setHasMouseMoved(false);
    setIsPanning(false);
  };

  const handleWaypointSubmit = (name: string, category: string) => {
    if (pendingPoint) {
      onWaypointAdd({ ...pendingPoint, name, category });
      setPendingPoint(null);
    }
  };

  const getCursorStyle = () => {
    if (!mapUrl) return '';
    if (isDragging) return 'cursor-grabbing';
    if (isAddingWaypoint) {
      if (isPanning) return 'cursor-grabbing';
      return 'cursor-crosshair';
    }
    return 'cursor-grab';
  };

  return (
    <div 
      className="flex-1 bg-workspace p-4 h-full"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div 
        ref={containerRef}
        className={`w-full h-full relative rounded-lg shadow-sm border border-border overflow-hidden select-none ${
          mapUrl ? 'bg-[repeating-linear-gradient(45deg,#fafad2,#fafad2_10px,#fff_10px,#fff_20px)] dark:bg-[repeating-linear-gradient(45deg,#1a1f2c,#1a1f2c_10px,#2d3748_10px,#2d3748_20px)]' : 'bg-white dark:bg-gray-900'
        } ${getCursorStyle()}`}
        onMouseDown={handleMapMouseDown}
        onMouseMove={handleMapMouseMove}
        onMouseUp={handleMapMouseUp}
        onMouseLeave={() => {
          handleMouseUp();
          setIsPanning(false);
          setHasMouseMoved(false);
        }}
      >
        {!mapUrl ? (
          <MapUploadInterface onMapUpload={onMapUpload} />
        ) : (
          <div ref={mapContainerRef}>
            <MapContent
              mapUrl={mapUrl}
              position={position}
              scale={scale}
              isDragging={isDragging}
              waypoints={waypoints}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onZoomReset={handleZoomReset}
            />
          </div>
        )}
      </div>
      <WaypointDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleWaypointSubmit}
        categories={categories}
        onCategoryAdd={onCategoryAdd}
        position={dialogPosition}
      />
    </div>
  );
};