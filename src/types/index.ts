export interface Point {
  x: number;
  y: number;
}

export interface Waypoint {
  id: string;
  x: number;  // percentage (0-100)
  y: number;  // percentage (0-100)
  name: string;
  category: string;
  timestamp?: number;  // when the waypoint was created
  sequence?: number;   // order in which waypoints were added
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface ClickHistoryItem {
  id: number;
  pixels: Point;
  percent: Point;
  scale: number;
  timestamp: number;  // when the click occurred
  type: 'click';     // discriminator for the type of history item
}

export interface WaypointHistoryItem {
  id: number;
  pixels: Point;
  percent: Point;
  scale: number;
  timestamp: number;  // when the waypoint was created
  type: 'waypoint';  // discriminator for the type of history item
}

export interface Dimensions {
  width: number;
  height: number;
} 