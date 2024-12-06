// Normalized coordinates (0-1 range)
export interface NormalizedCoordinate {
  x: number;  // x position relative to image width (0-1)
  y: number;  // y position relative to image height (0-1)
}

// Screen space coordinates (in pixels)
export interface ScreenCoordinate {
  x: number;  // x position in screen pixels
  y: number;  // y position in screen pixels
}

// Transform state
export interface Transform {
  scale: number;
  position: ScreenCoordinate;
}

// Coordinate spaces
export interface CoordinateSpaces {
  normalized: NormalizedCoordinate;
  screen: ScreenCoordinate;
}

// History entry
export interface HistoryEntry {
  id: number;
  coordinates: CoordinateSpaces;
  transform: Transform;
} 