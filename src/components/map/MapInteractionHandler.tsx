import React, { useRef, useCallback, useState, useEffect, forwardRef } from 'react';
import { MapContent, MapContentHandle } from './MapContent';

interface MapInteractionHandlerProps {
  mapUrl: string;
  waypoints: Array<{
    id: string;
    x: number;
    y: number;
    name: string;
    category: string;
    categoryColor?: string;
  }>;
  isAddingWaypoint: boolean;
  onCoordinateSelect: (normalized: { x: number; y: number }, screenPosition: { x: number; y: number }) => void;
  onWaypointClick: (waypointId: string, screenPosition: { x: number; y: number }) => void;
  imageRef: React.RefObject<HTMLImageElement>;
  onImageLoad: (dimensions: { width: number; height: number }) => void;
  categories: Array<{ id: string; name: string; color: string }>;
  onTransformChange?: (scale: number, x: number, y: number) => void;
}

export const MapInteractionHandler = forwardRef<MapContentHandle, MapInteractionHandlerProps>(({
  mapUrl,
  waypoints,
  isAddingWaypoint,
  onCoordinateSelect,
  onWaypointClick,
  imageRef,
  onImageLoad,
  categories,
  onTransformChange,
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [dragStartPosition, setDragStartPosition] = useState<{ x: number; y: number } | null>(null);
  const [mouseDownTime, setMouseDownTime] = useState<number | null>(null);
  const holdTimerRef = useRef<number | null>(null);
  const zoomCallbacksRef = useRef<{
    zoomIn?: () => void;
    zoomOut?: () => void;
    resetZoom?: () => void;
    fitToView?: () => void;
  }>({});

  const clearHoldTimer = () => {
    if (holdTimerRef.current !== null) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setDragStartPosition({ x: e.clientX, y: e.clientY });
    setMouseDownTime(Date.now());
    
    clearHoldTimer();
    holdTimerRef.current = window.setTimeout(() => {
      setIsHolding(true);
    }, 200);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragStartPosition || !mouseDownTime) return;

    const deltaX = Math.abs(e.clientX - dragStartPosition.x);
    const deltaY = Math.abs(e.clientY - dragStartPosition.y);
    const deltaTime = Date.now() - mouseDownTime;
    
    if (deltaX > 3 || deltaY > 3 || ((deltaX > 1 || deltaY > 1) && deltaTime > 100)) {
      setIsDragging(true);
      setIsHolding(true);
      clearHoldTimer();
    }
  }, [dragStartPosition, mouseDownTime]);

  const handleMouseUp = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const isQuickClick = mouseDownTime && (Date.now() - mouseDownTime < 200);
    const target = e.target as HTMLElement;
    const isWaypointClick = target.closest('[data-waypoint-id]');
    
    if (!isDragging && !isHolding && isQuickClick) {
      if (isWaypointClick) {
        const waypointId = isWaypointClick.getAttribute('data-waypoint-id');
        if (waypointId) {
          onWaypointClick(waypointId, { x: e.clientX, y: e.clientY });
        }
      } else if (isAddingWaypoint && imageRef.current) {
        const rect = imageRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        if (x >= 0 && x <= 1 && y >= 0 && y <= 1) {
          onCoordinateSelect(
            { x, y },
            { x: e.clientX, y: e.clientY }
          );
        }
      }
    }

    clearHoldTimer();
    setIsDragging(false);
    setIsHolding(false);
    setDragStartPosition(null);
    setMouseDownTime(null);
  }, [isDragging, isHolding, isAddingWaypoint, imageRef, onCoordinateSelect, onWaypointClick, mouseDownTime]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === '=' || e.key === '+') {
        e.preventDefault();
        zoomCallbacksRef.current.zoomIn?.();
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        zoomCallbacksRef.current.zoomOut?.();
      } else if (e.key === '0') {
        e.preventDefault();
        zoomCallbacksRef.current.resetZoom?.();
      } else if (e.key === '1') {
        e.preventDefault();
        zoomCallbacksRef.current.fitToView?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearHoldTimer();
    };
  }, []);

  const handleMouseLeave = () => {
    clearHoldTimer();
    setIsDragging(false);
    setIsHolding(false);
    setDragStartPosition(null);
    setMouseDownTime(null);
  };

  const getCursor = () => {
    if (!isAddingWaypoint) return 'cursor-grab';
    if (isDragging || isHolding) return 'cursor-grabbing';
    return 'cursor-crosshair';
  };

  return (
    <div 
      ref={containerRef}
      className={`w-full h-full relative select-none ${
        mapUrl ? 'bg-[#eeeeee] dark:bg-[#141414]' : 'bg-white dark:bg-gray-900'
      } ${getCursor()}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <MapContent
        ref={ref}
        mapUrl={mapUrl}
        waypoints={waypoints.map(wp => {
          const category = categories?.find(cat => cat.name === wp.category);
          return {
            ...wp,
            x: wp.x / 100,
            y: wp.y / 100,
            categoryColor: category?.color || '#9b87f5'
          };
        })}
        imageRef={imageRef}
        onImageLoad={onImageLoad}
        onZoomCallbacksChange={(callbacks) => {
          zoomCallbacksRef.current = callbacks;
        }}
        onWaypointClick={(id) => {
          const waypoint = waypoints?.find(w => w.id === id);
          if (waypoint) {
            const rect = imageRef.current?.getBoundingClientRect();
            if (rect) {
              const x = rect.left + (waypoint.x / 100) * rect.width;
              const y = rect.top + (waypoint.y / 100) * rect.height;
              onWaypointClick(id, { x, y });
            }
          }
        }}
        onTransformChange={onTransformChange}
      />
    </div>
  );
}); 
