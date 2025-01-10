import { useState } from 'react';
import { Waypoint, Category, Dimensions } from '../types';
import { createNewCategory, isCategoryNameTaken } from '../utils/categoryUtils';
import { showSuccessToast, showErrorToast } from '../utils/toast';
import { importWorkspace } from '../lib/workspace-utils';

export function useMapState() {
  const [mapUrl, setMapUrl] = useState<string | null>(null);
  const [mapDimensions, setMapDimensions] = useState<Dimensions | null>(null);
  const [projectName, setProjectName] = useState("My Project");
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAddingWaypoint, setIsAddingWaypoint] = useState(false);
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [waypointCounter, setWaypointCounter] = useState(0);

  const handleMapUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setMapDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };
    img.src = url;
    setMapUrl(url);
    showSuccessToast('Map uploaded successfully');
  };

  const handleMapDelete = () => {
    setMapUrl(null);
    setMapDimensions(null);
    showSuccessToast('Map deleted successfully');
  };

  const handleClearWaypoints = () => {
    setWaypoints([]);
    setWaypointCounter(0);
    showSuccessToast('All waypoints cleared');
  };

  const handleClearCategories = () => {
    setCategories([]);
    setWaypoints(waypoints.map(wp => ({ ...wp, category: '' })));
    showSuccessToast('All categories cleared');
  };

  const handleWaypointAdd = (point: { x: number; y: number; name: string; category: string }) => {
    const timestamp = Date.now();
    const sequence = waypointCounter + 1;
    setWaypointCounter(sequence);

    const newWaypoint: Waypoint = {
      id: `wp_${timestamp}_${sequence}`,
      timestamp,
      sequence,
      ...point,
    };

    setWaypoints(prev => [...prev].sort((a, b) => a.sequence - b.sequence));
    setWaypoints(prev => [...prev, newWaypoint]);
    
    if (!categories.some(cat => cat.name === point.category)) {
      const newCategory = createNewCategory(point.category, categories);
      setCategories(prev => [...prev, newCategory]);
    }
    
    showSuccessToast('Waypoint added successfully');
  };

  const handleWaypointDelete = (id: string) => {
    setWaypoints(waypoints.filter((wp) => wp.id !== id));
    showSuccessToast('Waypoint deleted successfully');
  };

  const handleCategoryAdd = (name: string, color: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    
    if (isCategoryNameTaken(trimmedName, categories)) {
      showErrorToast('Category already exists');
      return;
    }
    
    const newCategory = {
      id: Math.random().toString(36).substr(2, 9),
      name: trimmedName,
      color: color,
    };
    setCategories(prev => [...prev, newCategory]);
    showSuccessToast('Category added successfully');
  };

  const handleCategoryDelete = (id: string) => {
    setCategories(categories.filter((cat) => cat.id !== id));
    showSuccessToast('Category deleted successfully');
  };

  const handleWaypointEdit = (id: string, updates: { name: string; category: string }) => {
    setWaypoints(waypoints.map(wp => 
      wp.id === id 
        ? { ...wp, ...updates }
        : wp
    ));
    
    if (!categories.some(cat => cat.name === updates.category)) {
      const newCategory = createNewCategory(updates.category, categories);
      setCategories(prev => [...prev, newCategory]);
    }
    
    showSuccessToast('Waypoint updated successfully');
  };

  const handleImportWorkspace = (imageUrl: string, importedWaypoints: Waypoint[], importedCategories: Category[]) => {
    setMapUrl(imageUrl);
    // Ensure imported waypoints have sequence numbers if they don't already
    const waypointsWithSequence = importedWaypoints.map((wp, index) => ({
      ...wp,
      sequence: wp.sequence || index + 1,
      timestamp: wp.timestamp || Date.now()
    }));
    setWaypoints(waypointsWithSequence);
    setWaypointCounter(Math.max(...waypointsWithSequence.map(w => w.sequence || 0), 0));
    setCategories(importedCategories);
  };

  const handleLoadExample = async () => {
    try {
      const response = await fetch('/example-project.zip');
      const blob = await response.blob();
      const file = new File([blob], 'example-project.zip', { type: 'application/zip' });
      
      const { workspaceData, imageUrl } = await importWorkspace(file);
      
      const img = new Image();
      img.onload = () => {
        setMapDimensions({
          width: img.naturalWidth,
          height: img.naturalHeight
        });
      };
      img.src = imageUrl;
      
      setMapUrl(imageUrl);
      setWaypoints(workspaceData.waypoints);
      setCategories(workspaceData.categories);
      setWaypointCounter(Math.max(...workspaceData.waypoints.map(w => w.sequence || 0), 0));
      setProjectName(workspaceData.metadata.projectName);
      
      showSuccessToast('Example project loaded successfully');
    } catch (error) {
      console.error('Failed to load example project:', error);
      showErrorToast('Failed to load example project');
    }
  };

  return {
    mapUrl,
    mapDimensions,
    projectName,
    waypoints: waypoints.sort((a, b) => a.sequence - b.sequence),
    categories,
    isAddingWaypoint,
    isDebugMode,
    setProjectName,
    setIsAddingWaypoint,
    setIsDebugMode,
    handlers: {
      handleMapUpload,
      handleMapDelete,
      handleClearWaypoints,
      handleClearCategories,
      handleWaypointAdd,
      handleWaypointDelete,
      handleWaypointEdit,
      handleCategoryAdd,
      handleCategoryDelete,
      handleImportWorkspace,
      handleLoadExample
    }
  };
} 