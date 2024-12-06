import React, { useRef } from 'react';
import { toast } from 'sonner';
import { MapUploadInterface } from './map/MapUploadInterface';
import { MapContent } from './map/MapContent';
import { useMapControls } from '@/hooks/useMapControls';

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
  onWaypointAdd: (point: { x: number; y: number }) => void;
  isAddingWaypoint: boolean;
}

export const MapWorkspace: React.FC<MapWorkspaceProps> = ({
  onMapUpload,
  mapUrl,
  waypoints,
  onWaypointAdd,
  isAddingWaypoint,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
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
      toast.error('Please upload an image file');
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAddingWaypoint || !mapUrl || isDragging) return;

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

    onWaypointAdd({ x: boundedX, y: boundedY });
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
          mapUrl ? 'bg-[repeating-linear-gradient(45deg,#fafad2,#fafad2_10px,#fff_10px,#fff_20px)]' : 'bg-white'
        } ${
          isAddingWaypoint ? 'cursor-crosshair' : 'cursor-grab'
        } ${isDragging ? 'cursor-grabbing' : ''}`}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
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
    </div>
  );
};