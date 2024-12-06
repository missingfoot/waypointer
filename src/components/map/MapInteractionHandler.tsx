import React, { useRef, useCallback } from 'react';
import { MapContent } from './MapContent';

interface MapInteractionHandlerProps {
  mapUrl: string;
  waypoints: Array<{
    id: string;
    x: number;
    y: number;
    name: string;
    category: string;
  }>;
  isAddingWaypoint: boolean;
  onCoordinateSelect: (normalized: { x: number; y: number }, screenPosition: { x: number; y: number }) => void;
  imageRef: React.RefObject<HTMLImageElement>;
  onImageLoad: (dimensions: { width: number; height: number }) => void;
}

export const MapInteractionHandler: React.FC<MapInteractionHandlerProps> = ({
  mapUrl,
  waypoints,
  isAddingWaypoint,
  onCoordinateSelect,
  imageRef,
  onImageLoad,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAddingWaypoint || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Ensure coordinates are within bounds
    if (x >= 0 && x <= 1 && y >= 0 && y <= 1) {
      onCoordinateSelect(
        { x, y },
        { x: e.clientX, y: e.clientY }
      );
    }
  }, [isAddingWaypoint, imageRef, onCoordinateSelect]);

  return (
    <div 
      ref={containerRef}
      className={`w-full h-full relative select-none ${
        mapUrl ? 'bg-[repeating-linear-gradient(45deg,#fafad2,#fafad2_10px,#fff_10px,#fff_20px)] dark:bg-[repeating-linear-gradient(45deg,#1a1f2c,#1a1f2c_10px,#2d3748_10px,#2d3748_20px)]' : 'bg-white dark:bg-gray-900'
      } ${isAddingWaypoint ? 'cursor-crosshair' : 'cursor-grab'}`}
      onClick={handleClick}
    >
      <MapContent
        mapUrl={mapUrl}
        waypoints={waypoints}
        imageRef={imageRef}
        onImageLoad={onImageLoad}
      />
    </div>
  );
}; 