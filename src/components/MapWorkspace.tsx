import React, { useState, useRef } from 'react';
import { Upload, ZoomIn, ZoomOut, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface MapWorkspaceProps {
  onMapUpload: (file: File) => void;
  mapUrl: string | null;
  waypoints: Waypoint[];
  onWaypointAdd: (point: { x: number; y: number }) => void;
  isAddingWaypoint: boolean;
}

interface Waypoint {
  id: string;
  x: number;
  y: number;
  name: string;
  category: string;
}

export const MapWorkspace: React.FC<MapWorkspaceProps> = ({
  onMapUpload,
  mapUrl,
  waypoints,
  onWaypointAdd,
  isAddingWaypoint,
}) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

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

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    onWaypointAdd({ x, y });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };

  return (
    <div 
      className="flex-1 bg-workspace p-4 h-full"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div 
        ref={containerRef}
        className={`w-full h-full relative bg-[repeating-linear-gradient(45deg,#fafad2,#fafad2_10px,#fff_10px,#fff_20px)] rounded-lg shadow-sm border border-border overflow-hidden select-none ${
          isAddingWaypoint ? 'cursor-crosshair' : 'cursor-grab'
        } ${isDragging ? 'cursor-grabbing' : ''}`}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {!mapUrl ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-muted-foreground p-4">
            <Upload className="w-12 h-12" />
            <p className="text-center">Drag and drop your map image here or click to upload</p>
            <Button
              variant="outline"
              onClick={() => document.getElementById('map-upload')?.click()}
            >
              Upload Map
            </Button>
            <input
              id="map-upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onMapUpload(file);
              }}
            />
          </div>
        ) : (
          <>
            <div
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transformOrigin: '0 0',
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
              {waypoints.map((waypoint) => (
                <div
                  key={waypoint.id}
                  className="absolute w-4 h-4 -ml-2 -mt-2 bg-blue-500 rounded-full border-2 border-white shadow-md cursor-pointer animate-fade-in"
                  style={{ 
                    left: `${waypoint.x}%`, 
                    top: `${waypoint.y}%`,
                  }}
                  title={waypoint.name}
                />
              ))}
            </div>
            <div className="absolute bottom-4 right-4 flex flex-col gap-2">
              <Button
                variant="secondary"
                size="icon"
                onClick={handleZoomIn}
                className="h-8 w-8 shadow-lg"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={handleZoomOut}
                className="h-8 w-8 shadow-lg"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};