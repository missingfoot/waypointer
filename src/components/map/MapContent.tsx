import React from 'react';
import { MapControls } from './MapControls';
import { MapGrid } from './MapGrid';

interface MapContentProps {
  mapUrl: string;
  position: { x: number; y: number };
  scale: number;
  isDragging: boolean;
  waypoints: Array<{
    id: string;
    x: number;
    y: number;
    name: string;
    category: string;
  }>;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
}

export const MapContent: React.FC<MapContentProps> = ({
  mapUrl,
  position,
  scale,
  isDragging,
  waypoints,
  onZoomIn,
  onZoomOut,
  onZoomReset,
}) => {
  return (
    <>
      <div
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: '50% 50%',
          transition: isDragging ? 'none' : 'transform 0.1s ease-out'
        }}
        className="absolute inset-0 bg-white"
      >
        <img 
          src={mapUrl} 
          alt="Venue Map" 
          className="w-full h-full object-contain pointer-events-none"
          draggable={false}
        />
        <MapGrid scale={scale} />
        {waypoints.map((waypoint) => (
          <div
            key={waypoint.id}
            className="absolute w-4 h-4 -ml-2 -mt-2 bg-blue-500 rounded-full border-2 border-white shadow-md cursor-pointer animate-fade-in"
            style={{ 
              left: `${waypoint.x}%`, 
              top: `${waypoint.y}%`,
              transform: `scale(${1/scale})`,
            }}
            title={waypoint.name}
          />
        ))}
      </div>
      <MapControls 
        onZoomIn={onZoomIn} 
        onZoomOut={onZoomOut} 
        onZoomReset={onZoomReset}
      />
    </>
  );
};