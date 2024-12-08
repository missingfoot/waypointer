import React, { useRef, useState, useCallback, useEffect } from 'react';
import { MapUploadInterface } from './map/MapUploadInterface';
import { MapInteractionHandler } from './map/MapInteractionHandler';
import { DebugOverlay } from './map/DebugOverlay';
import { WaypointDialog } from './dialogs/WaypointDialog';
import { useDebugMode } from '@/hooks/useDebugMode';
import { useWaypointDialog } from '@/hooks/useWaypointDialog';
import { showErrorToast } from '@/utils/toast';
import { normalizedToScreen, normalizedToPercent } from '@/utils/coordinates';
import { Waypoint, Category, Dimensions, Point } from '@/types';

interface MapWorkspaceProps {
  onMapUpload: (file: File) => void;
  mapUrl: string | null;
  waypoints: Waypoint[];
  onWaypointAdd: (point: { x: number; y: number; name: string; category: string }) => void;
  onWaypointEdit: (id: string, updates: { name: string; category: string }) => void;
  isAddingWaypoint: boolean;
  categories: Category[];
  onCategoryAdd: (name: string, color: string) => void;
  isDebugMode: boolean;
  setIsDebugMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MapWorkspace: React.FC<MapWorkspaceProps> = ({
  onMapUpload,
  mapUrl,
  waypoints,
  onWaypointAdd,
  onWaypointEdit,
  isAddingWaypoint,
  categories,
  onCategoryAdd,
  isDebugMode,
  setIsDebugMode,
}) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageDimensions, setImageDimensions] = useState<Dimensions | null>(null);
  const [transformState, setTransformState] = useState({ scale: 1, positionX: 0, positionY: 0 });

  const {
    clickHistory,
    waypointHistory,
    cursorPosition,
    cursorPercent,
    scale,
    position,
    handleDebugReset,
    addClickToHistory,
    addWaypointToHistory,
    updateCursorPosition
  } = useDebugMode();

  const {
    dialogOpen,
    setDialogOpen,
    dialogPosition,
    editingWaypoint,
    pendingPoint,
    handleWaypointClick,
    handleCoordinateSelect,
    handleWaypointSubmit
  } = useWaypointDialog({
    onWaypointAdd: (point) => {
      onWaypointAdd(point);
      if (isDebugMode && imageDimensions && pendingPoint) {
        const screenPos = normalizedToScreen(pendingPoint, imageDimensions);
        addWaypointToHistory(
          screenPos,
          { x: point.x, y: point.y },
          transformState.scale
        );
      }
    },
    onWaypointEdit,
    waypoints
  });

  const handleImageLoad = (dimensions: Dimensions) => {
    setImageDimensions(dimensions);
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isDebugMode && imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const percentX = (x / rect.width) * 100;
      const percentY = (y / rect.height) * 100;
      updateCursorPosition(
        { x, y },
        { x: percentX, y: percentY },
        transformState.scale,
        { x: transformState.positionX, y: transformState.positionY }
      );
    }
  }, [isDebugMode, transformState, updateCursorPosition]);

  const handleTransformChange = useCallback((scale: number, x: number, y: number) => {
    setTransformState({ scale, positionX: x, positionY: y });
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onMapUpload(file);
    } else {
      showErrorToast('Please upload an image file');
    }
  };

  // Add keyboard shortcut for debug mode
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'b' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        setIsDebugMode?.(!isDebugMode);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isDebugMode, setIsDebugMode]);

  return (
    <div 
      className="relative w-full h-full"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onMouseMove={handleMouseMove}
    >
      {!mapUrl ? (
        <MapUploadInterface onMapUpload={onMapUpload} />
      ) : (
        <>
          <MapInteractionHandler
            mapUrl={mapUrl}
            waypoints={waypoints}
            isAddingWaypoint={isAddingWaypoint}
            onCoordinateSelect={(normalized, screenPosition) => {
              if (isDebugMode) {
                addClickToHistory(
                  screenPosition,
                  { x: normalized.x * 100, y: normalized.y * 100 },
                  transformState.scale
                );
              }
              handleCoordinateSelect(normalized, screenPosition);
            }}
            onWaypointClick={handleWaypointClick}
            imageRef={imageRef}
            onImageLoad={handleImageLoad}
            categories={categories}
            onTransformChange={handleTransformChange}
          />
          {isDebugMode && (
            <DebugOverlay
              clickHistory={clickHistory}
              waypointHistory={waypointHistory}
              combinedHistory={[...clickHistory, ...waypointHistory].sort((a, b) => a.timestamp - b.timestamp)}
              onReset={handleDebugReset}
              cursorPosition={cursorPosition}
              cursorPercent={cursorPercent}
              position={position}
              scale={scale}
              imageDimensions={imageDimensions}
            />
          )}
          <WaypointDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onSubmit={handleWaypointSubmit}
            categories={categories}
            onCategoryAdd={onCategoryAdd}
            position={dialogPosition}
            editMode={!!editingWaypoint}
            initialData={editingWaypoint ? waypoints.find(w => w.id === editingWaypoint) : undefined}
          />
        </>
      )}
    </div>
  );
};