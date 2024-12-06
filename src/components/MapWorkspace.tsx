import React from 'react';
import { Upload } from 'lucide-react';
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
    if (!isAddingWaypoint || !mapUrl) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    onWaypointAdd({ x, y });
  };

  return (
    <div 
      className="flex-1 bg-workspace p-4 overflow-hidden"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div 
        className="w-full h-full relative bg-white rounded-lg shadow-sm border border-border overflow-hidden"
        onClick={handleClick}
      >
        {!mapUrl ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-muted-foreground">
            <Upload className="w-12 h-12" />
            <p>Drag and drop your map image here or click to upload</p>
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
            <img 
              src={mapUrl} 
              alt="Venue Map" 
              className="w-full h-full object-contain"
            />
            {waypoints.map((waypoint) => (
              <div
                key={waypoint.id}
                className="absolute w-4 h-4 -ml-2 -mt-2 bg-blue-500 rounded-full border-2 border-white shadow-md cursor-pointer animate-fade-in"
                style={{ left: `${waypoint.x}%`, top: `${waypoint.y}%` }}
                title={waypoint.name}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};