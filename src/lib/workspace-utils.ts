import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export interface WorkspaceData {
  version: string;
  metadata: {
    projectName: string;
    exportDate: string;
    lastModified: string;
    imageMetadata: {
      filename: string;
      width: number;
      height: number;
      type: string;
      size: number;
    };
  };
  waypoints: Array<{
    id: string;
    x: number;
    y: number;
    name: string;
    category: string;
    timestamp: number;
    sequence: number;
  }>;
  categories: Array<{
    id: string;
    name: string;
    color: string;
    createdAt: string;
  }>;
  statistics: {
    totalWaypoints: number;
    totalCategories: number;
    categoryCounts: Record<string, number>;
  };
}

export class WorkspaceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WorkspaceError';
  }
}

export class NoImageError extends WorkspaceError {
  constructor() {
    super('No map image to export');
  }
}

export class InvalidFileError extends WorkspaceError {
  constructor() {
    super('Invalid file format');
  }
}

export class NoJsonError extends WorkspaceError {
  constructor() {
    super('Missing workspace data');
  }
}

export class InvalidVersionError extends WorkspaceError {
  constructor() {
    super('Unsupported export file version');
  }
}

export async function exportWorkspace(
  projectName: string,
  mapUrl: string,
  waypoints: Array<any>,
  categories: Array<any>
): Promise<void> {
  try {
    // Create a new ZIP file
    const zip = new JSZip();
    
    // Fetch the image blob from the URL
    const imageResponse = await fetch(mapUrl);
    const imageBlob = await imageResponse.blob();
    const imageMetadata = {
      filename: 'map' + getFileExtFromMimeType(imageBlob.type),
      width: 0, // Will be populated when image loads
      height: 0,
      type: imageBlob.type,
      size: imageBlob.size
    };

    // Get image dimensions
    await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        imageMetadata.width = img.width;
        imageMetadata.height = img.height;
        resolve(null);
      };
      img.onerror = reject;
      img.src = mapUrl;
    });

    // Add image to ZIP
    zip.file(imageMetadata.filename, imageBlob);

    // Create workspace data
    const workspaceData: WorkspaceData = {
      version: "1.0",
      metadata: {
        projectName,
        exportDate: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        imageMetadata
      },
      waypoints: waypoints.map(wp => ({
        ...wp,
        timestamp: wp.timestamp || Date.now(),
        sequence: wp.sequence || 0,
      })),
      categories: categories.map(cat => ({
        ...cat,
        createdAt: new Date().toISOString()
      })),
      statistics: {
        totalWaypoints: waypoints.length,
        totalCategories: categories.length,
        categoryCounts: categories.reduce((acc, cat) => {
          acc[cat.name] = waypoints.filter(wp => wp.category === cat.name).length;
          return acc;
        }, {} as Record<string, number>)
      }
    };

    // Add workspace data to ZIP
    zip.file('workspace.json', JSON.stringify(workspaceData, null, 2));

    // Generate ZIP file
    const zipBlob = await zip.generateAsync({ type: 'blob' });

    // Create filename with date
    const date = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const sanitizedProjectName = projectName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const filename = `${sanitizedProjectName}_${date}.zip`;

    // Save the file
    saveAs(zipBlob, filename);
  } catch (error) {
    console.error('Export error:', error);
    throw error;
  }
}

export async function importWorkspace(
  file: File
): Promise<{
  workspaceData: WorkspaceData;
  imageUrl: string;
}> {
  try {
    // Read the ZIP file
    const zip = await JSZip.loadAsync(file);
    
    // Find and parse workspace.json
    const workspaceFile = zip.file('workspace.json');
    if (!workspaceFile) {
      throw new NoJsonError();
    }

    // Parse workspace data
    const workspaceJson = await workspaceFile.async('string');
    const workspaceData = JSON.parse(workspaceJson) as WorkspaceData;

    // Validate version
    if (workspaceData.version !== '1.0') {
      throw new InvalidVersionError();
    }

    // Find and process image file
    const imageFile = zip.file(workspaceData.metadata.imageMetadata.filename);
    if (!imageFile) {
      throw new NoImageError();
    }

    // Create object URL for image
    const imageBlob = await imageFile.async('blob');
    const imageUrl = URL.createObjectURL(imageBlob);

    // Process waypoints (ensure all required fields exist)
    workspaceData.waypoints = workspaceData.waypoints.map((waypoint, index) => ({
      ...waypoint,
      id: waypoint.id?.match(/^[a-zA-Z0-9_]+$/) 
        ? waypoint.id 
        : `wp_${Date.now()}_${index + 1}`,
      x: Math.max(0, Math.min(100, waypoint.x)),
      y: Math.max(0, Math.min(100, waypoint.y)),
      name: waypoint.name || 'Unnamed Waypoint',
      category: waypoint.category || 'Default',
      timestamp: waypoint.timestamp || Date.now(),
      sequence: waypoint.sequence || index + 1
    }));

    // Sort waypoints by sequence
    workspaceData.waypoints.sort((a, b) => a.sequence - b.sequence);

    return { workspaceData, imageUrl };
  } catch (error) {
    console.error('Import error:', error);
    if (error instanceof WorkspaceError) {
      throw error;
    }
    throw new InvalidFileError();
  }
}

function getFileExtFromMimeType(mimeType: string): string {
  const extensions: Record<string, string> = {
    'image/png': '.png',
    'image/jpeg': '.jpg',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'image/svg+xml': '.svg'
  };
  return extensions[mimeType] || '.png';
} 