import { useState, useRef } from 'react';

export const useMapControls = () => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const newScale = Math.min(scale + 0.25, 4);
    const scaleFactor = (newScale - scale);
    
    setScale(newScale);
    setPosition(prev => ({
      x: prev.x - (centerX * scaleFactor),
      y: prev.y - (centerY * scaleFactor)
    }));
  };

  const handleZoomOut = () => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const newScale = Math.max(scale - 0.25, 0.5);
    const scaleFactor = (scale - newScale);
    
    setScale(newScale);
    setPosition(prev => ({
      x: prev.x + (centerX * scaleFactor),
      y: prev.y + (centerY * scaleFactor)
    }));
  };

  const handleZoomReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
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

  return {
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
  };
};