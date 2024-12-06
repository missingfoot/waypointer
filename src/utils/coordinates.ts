import { NormalizedCoordinate, ScreenCoordinate, Transform } from '../types/coordinates';

interface ImageDimensions {
  width: number;
  height: number;
}

// Convert screen coordinates to normalized coordinates (0-1)
export function screenToNormalized(
  screen: ScreenCoordinate,
  transform: Transform,
  imageDimensions: ImageDimensions
): NormalizedCoordinate {
  // Remove pan offset and convert to normalized coordinates (0-1)
  // Scale is handled by the DOM transform
  return {
    x: (screen.x - transform.position.x) / (imageDimensions.width * transform.scale),
    y: (screen.y - transform.position.y) / (imageDimensions.height * transform.scale)
  };
}

// Convert normalized coordinates (0-1) to screen coordinates
export function normalizedToScreen(
  normalized: NormalizedCoordinate,
  transform: Transform,
  imageDimensions: ImageDimensions
): ScreenCoordinate {
  // Convert normalized (0-1) to screen coordinates
  // Scale is handled by the DOM transform
  return {
    x: transform.position.x + (normalized.x * imageDimensions.width * transform.scale),
    y: transform.position.y + (normalized.y * imageDimensions.height * transform.scale)
  };
}

// Get cursor position in both coordinate spaces
export function getCursorCoordinates(
  event: React.MouseEvent,
  containerRect: DOMRect,
  transform: Transform,
  imageDimensions: ImageDimensions
) {
  // Get screen coordinates relative to container
  const screen: ScreenCoordinate = {
    x: event.clientX - containerRect.left,
    y: event.clientY - containerRect.top
  };

  // Convert to normalized coordinates
  const normalized = screenToNormalized(screen, transform, imageDimensions);

  return {
    screen,
    normalized
  };
} 