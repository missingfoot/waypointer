import React, { useRef, useState } from 'react';
import { toast } from 'sonner';
import { MapUploadInterface } from './map/MapUploadInterface';
import { MapInteractionHandler } from './map/MapInteractionHandler';
import { DebugOverlay } from './map/DebugOverlay';
import { WaypointDialog } from './dialogs/WaypointDialog';

interface MapWorkspaceProps {
  onMapUpload: (file: File) => void;
  mapUrl: string | null;
  waypoints: Array<{
    id: string;
    x: number;  // percentage (0-100)
    y: number;  // percentage (0-100)
    name: string;
    category: string;
  }>;
  onWaypointAdd: (point: { x: number; y: number; name: string; category: string }) => void;
  isAddingWaypoint: boolean;
  categories: Array<{ id: string; name: string; color: string }>;
  onCategoryAdd: (name: string, color: string) => void;
  isDebugMode: boolean;
}

export const MapWorkspace: React.FC<MapWorkspaceProps> = ({
  onMapUpload,
  mapUrl,
  waypoints,
  onWaypointAdd,
  isAddingWaypoint,
  categories,
  onCategoryAdd,
  isDebugMode,
}) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingPoint, setPendingPoint] = useState<{ x: number; y: number } | null>(null);
  const [dialogPosition, setDialogPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [clickHistory, setClickHistory] = useState<Array<{
    id: number;
    pixels: { x: number; y: number };
    percent: { x: number; y: number };
    scale: number;
  }>>([]);
  const [waypointHistory, setWaypointHistory] = useState<Array<{
    id: number;
    pixels: { x: number; y: number };
    percent: { x: number; y: number };
    scale: number;
  }>>([]);

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

  const handleImageLoad = (dimensions: { width: number; height: number }) => {
    setImageDimensions(dimensions);
  };

  const handleDebugReset = () => {
    setClickHistory([]);
    setWaypointHistory([]);
  };

  const handleCoordinateSelect = (normalized: { x: number; y: number }, screenPosition: { x: number; y: number }) => {
    if (isDebugMode) {
      setClickHistory(prev => [...prev, {
        id: prev.length + 1,
        pixels: screenPosition,
        percent: {
          x: normalized.x * 100,
          y: normalized.y * 100
        },
        scale: 1
      }]);
    }

    setPendingPoint(normalized);
    setDialogPosition(screenPosition);
    setDialogOpen(true);
  };

  const handleWaypointSubmit = (name: string, category: string) => {
    if (!pendingPoint) return;

    const screenPosition = {
      x: pendingPoint.x * (imageDimensions?.width || 0),
      y: pendingPoint.y * (imageDimensions?.height || 0)
    };

    if (isDebugMode) {
      setWaypointHistory(prev => [...prev, {
        id: prev.length + 1,
        pixels: screenPosition,
        percent: {
          x: pendingPoint.x * 100,
          y: pendingPoint.y * 100
        },
        scale: 1
      }]);
    }

    onWaypointAdd({
      x: pendingPoint.x * 100,
      y: pendingPoint.y * 100,
      name,
      category
    });
    setPendingPoint(null);
    setDialogOpen(false);
  };

  return (
    <div 
      className="flex-1 bg-workspace h-full"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {!mapUrl ? (
        <MapUploadInterface onMapUpload={onMapUpload} />
      ) : (
        <>
          <MapInteractionHandler
            mapUrl={mapUrl}
            waypoints={waypoints.map(wp => ({
              ...wp,
              x: wp.x / 100,
              y: wp.y / 100
            }))}
            isAddingWaypoint={isAddingWaypoint}
            onCoordinateSelect={handleCoordinateSelect}
            imageRef={imageRef}
            onImageLoad={handleImageLoad}
          />
          {isDebugMode && (
            <DebugOverlay
              cursorPosition={{ x: 0, y: 0 }}
              cursorPercent={{ x: 0, y: 0 }}
              position={{ x: 0, y: 0 }}
              scale={1}
              imageDimensions={imageDimensions}
              clickHistory={clickHistory}
              waypointHistory={waypointHistory}
              onReset={handleDebugReset}
            />
          )}
          <WaypointDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onSubmit={handleWaypointSubmit}
            categories={categories}
            onCategoryAdd={onCategoryAdd}
            position={dialogPosition}
          />
        </>
      )}
    </div>
  );
};