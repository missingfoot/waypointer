import { useState } from 'react';
import { Point, Waypoint } from '../types';

interface UseWaypointDialogProps {
  onWaypointAdd: (point: { x: number; y: number; name: string; category: string }) => void;
  onWaypointEdit: (id: string, updates: { name: string; category: string }) => void;
  waypoints: Waypoint[];
}

export function useWaypointDialog({ onWaypointAdd, onWaypointEdit, waypoints }: UseWaypointDialogProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogPosition, setDialogPosition] = useState<Point>({ x: 0, y: 0 });
  const [editingWaypoint, setEditingWaypoint] = useState<string | null>(null);
  const [pendingPoint, setPendingPoint] = useState<Point | null>(null);

  const handleWaypointClick = (waypointId: string, screenPosition: Point) => {
    const waypoint = waypoints.find(w => w.id === waypointId);
    if (waypoint) {
      setEditingWaypoint(waypointId);
      setDialogPosition(screenPosition);
      setDialogOpen(true);
    }
  };

  const handleCoordinateSelect = (normalized: Point, screenPosition: Point) => {
    setEditingWaypoint(null);
    setPendingPoint(normalized);
    setDialogPosition(screenPosition);
    setDialogOpen(true);
  };

  const handleWaypointSubmit = (name: string, category: string) => {
    if (editingWaypoint) {
      onWaypointEdit(editingWaypoint, { name, category });
      setEditingWaypoint(null);
    } else if (pendingPoint) {
      onWaypointAdd({
        x: pendingPoint.x * 100,
        y: pendingPoint.y * 100,
        name,
        category
      });
      setPendingPoint(null);
    }
    setDialogOpen(false);
  };

  return {
    dialogOpen,
    setDialogOpen,
    dialogPosition,
    setDialogPosition,
    editingWaypoint,
    setEditingWaypoint,
    pendingPoint,
    handleWaypointClick,
    handleCoordinateSelect,
    handleWaypointSubmit
  };
} 