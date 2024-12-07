import React, { useRef, useCallback, useState, useEffect } from 'react';
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
    
    // Start a shorter hold timer
    clearHoldTimer();
    holdTimerRef.current = window.setTimeout(() => {
      setIsHolding(true);
    }, 200); // Reduced to 200ms for more responsive feedback
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragStartPosition || !mouseDownTime) return;

    const deltaX = Math.abs(e.clientX - dragStartPosition.x);
    const deltaY = Math.abs(e.clientY - dragStartPosition.y);
    const deltaTime = Date.now() - mouseDownTime;
    
    // Consider it a drag if:
    // 1. Moved more than 3 pixels (reduced threshold)
    // 2. OR moved more than 1 pixel and held for more than 100ms
    if (deltaX > 3 || deltaY > 3 || ((deltaX > 1 || deltaY > 1) && deltaTime > 100)) {
      setIsDragging(true);
      setIsHolding(true); // Show grab cursor immediately when starting to drag
      clearHoldTimer();
    }
  }, [dragStartPosition, mouseDownTime]);

  const handleMouseUp = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const isQuickClick = mouseDownTime && (Date.now() - mouseDownTime < 200);
    
    if (!isDragging && !isHolding && isQuickClick && isAddingWaypoint && imageRef.current) {
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
    }

    // Reset all states
    clearHoldTimer();
    setIsDragging(false);
    setIsHolding(false);
    setDragStartPosition(null);
    setMouseDownTime(null);
  }, [isDragging, isHolding, isAddingWaypoint, imageRef, onCoordinateSelect, mouseDownTime]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if not typing in an input field
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
        mapUrl={mapUrl}
        waypoints={waypoints}
        imageRef={imageRef}
        onImageLoad={onImageLoad}
        onZoomCallbacksChange={(callbacks) => {
          zoomCallbacksRef.current = callbacks;
        }}
      />
    </div>
  );
}; 
