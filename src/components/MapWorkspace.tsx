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
import type { MapContentHandle } from './map/MapContent';

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
  waypointDialogState: {
    open: boolean;
    position: { x: number; y: number };
    waypointId: string | null;
  };
  onWaypointClick: (waypointId: string, screenPosition: { x: number; y: number }) => void;
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
  waypointDialogState,
  onWaypointClick,
}) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const mapContentRef = useRef<MapContentHandle>(null);
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
    setDialogPosition,
    editingWaypoint,
    setEditingWaypoint,
    pendingPoint,
    handleCoordinateSelect: baseHandleCoordinateSelect,
    handleWaypointSubmit
  } = useWaypointDialog({
    onWaypointAdd: (point) => {
      onWaypointAdd(point);
      if (isDebugMode && imageDimensions && pendingPoint) {
        const screenPos = normalizedToScreen(pendingPoint, imageDimensions);
        const percentPos = normalizedToPercent(pendingPoint);
        addWaypointToHistory(screenPos, percentPos, transformState.scale);
      }
    },
    onWaypointEdit,
    waypoints
  });

  const handleCoordinateSelect = useCallback((point: Point, screenPosition: Point) => {
    if (isDebugMode && imageDimensions) {
      const percentPos = normalizedToPercent(point);
      addClickToHistory(screenPosition, percentPos, transformState.scale);
    }
    baseHandleCoordinateSelect(point, screenPosition);
  }, [isDebugMode, imageDimensions, addClickToHistory, transformState.scale, baseHandleCoordinateSelect]);

  // Update dialog state when waypointDialogState changes
  useEffect(() => {
    if (waypointDialogState.open) {
      setDialogOpen(true);
      setEditingWaypoint(waypointDialogState.waypointId);
      setDialogPosition(waypointDialogState.position);
    }
  }, [waypointDialogState, setDialogOpen, setEditingWaypoint, setDialogPosition]);

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

  const handleWaypointEdit = (waypointId: string) => {
    const waypoint = waypoints.find(w => w.id === waypointId);
    if (!waypoint || !imageRef.current) return;

    // Center the map on the waypoint
    mapContentRef.current?.centerOnWaypoint(waypointId);

    // Get the waypoint's screen position after centering
    const rect = imageRef.current.getBoundingClientRect();
    const screenPosition = {
      x: rect.left + (waypoint.x / 100) * rect.width,
      y: rect.top + (waypoint.y / 100) * rect.height
    };

    onWaypointClick(waypointId, screenPosition);
  };

  return (
    <div className="w-full h-full relative">
      {!mapUrl ? (
        <MapUploadInterface onMapUpload={onMapUpload} />
      ) : (
        <>
          <MapInteractionHandler
            ref={mapContentRef}
            mapUrl={mapUrl}
            waypoints={waypoints}
            isAddingWaypoint={isAddingWaypoint}
            onCoordinateSelect={handleCoordinateSelect}
            onWaypointClick={handleWaypointEdit}
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
              cursorPosition={cursorPosition}
              cursorPercent={cursorPercent}
              scale={scale}
              position={position}
              onReset={handleDebugReset}
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
            waypoint={editingWaypoint ? waypoints.find(w => w.id === editingWaypoint) : undefined}
            imageRef={imageRef}
          />
        </>
      )}
    </div>
  );
};