import { useState, useMemo } from 'react';
import { ClickHistoryItem, WaypointHistoryItem, Point } from '../types';

export function useDebugMode() {
  const [clickHistory, setClickHistory] = useState<ClickHistoryItem[]>([]);
  const [waypointHistory, setWaypointHistory] = useState<WaypointHistoryItem[]>([]);
  const [cursorPosition, setCursorPosition] = useState<Point>({ x: 0, y: 0 });
  const [cursorPercent, setCursorPercent] = useState<Point>({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState<Point>({ x: 0, y: 0 });

  const handleDebugReset = () => {
    setClickHistory([]);
    setWaypointHistory([]);
  };

  const addClickToHistory = (pixels: Point, percent: Point, currentScale: number) => {
    setClickHistory(prev => [...prev, {
      id: prev.length + 1,
      pixels,
      percent,
      scale: currentScale,
      timestamp: Date.now(),
      type: 'click' as const
    }]);
  };

  const addWaypointToHistory = (pixels: Point, percent: Point, currentScale: number) => {
    setWaypointHistory(prev => [...prev, {
      id: prev.length + 1,
      pixels,
      percent,
      scale: currentScale,
      timestamp: Date.now(),
      type: 'waypoint' as const
    }]);
  };

  const updateCursorPosition = (
    cursorPos: Point, 
    percent: Point, 
    newScale: number,
    panPosition: Point
  ) => {
    setCursorPosition(cursorPos);
    setCursorPercent(percent);
    setScale(newScale);
    setPosition(panPosition);
  };

  // Combine and sort both histories chronologically
  const combinedHistory = useMemo(() => {
    const combined = [
      ...clickHistory.map(click => ({ ...click, type: 'click' as const })),
      ...waypointHistory.map(waypoint => ({ ...waypoint, type: 'waypoint' as const }))
    ].sort((a, b) => a.timestamp - b.timestamp);
    return combined;
  }, [clickHistory, waypointHistory]);

  return {
    clickHistory,
    waypointHistory,
    combinedHistory,
    cursorPosition,
    cursorPercent,
    scale,
    position,
    handleDebugReset,
    addClickToHistory,
    addWaypointToHistory,
    updateCursorPosition
  };
} 