import { Point, Dimensions } from '../types';

export function normalizeCoordinates(point: Point, dimensions: Dimensions): Point {
  return {
    x: point.x / dimensions.width,
    y: point.y / dimensions.height
  };
}

export function screenToNormalized(point: Point, rect: DOMRect): Point {
  return {
    x: (point.x - rect.left) / rect.width,
    y: (point.y - rect.top) / rect.height
  };
}

export function normalizedToScreen(normalized: Point, dimensions: Dimensions): Point {
  return {
    x: normalized.x * dimensions.width,
    y: normalized.y * dimensions.height
  };
}

export function percentToNormalized(percent: Point): Point {
  return {
    x: percent.x / 100,
    y: percent.y / 100
  };
}

export function normalizedToPercent(normalized: Point): Point {
  return {
    x: normalized.x * 100,
    y: normalized.y * 100
  };
} 