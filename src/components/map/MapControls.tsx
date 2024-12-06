import React from 'react';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
}

export const MapControls: React.FC<MapControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onZoomReset,
}) => {
  return (
    <div 
      className="absolute bottom-4 right-4 flex flex-col gap-0.5 bg-background rounded-lg shadow-lg border border-border overflow-hidden"
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          onZoomIn();
        }}
        className="h-8 w-8 rounded-none hover:bg-accent"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          onZoomReset();
        }}
        className="h-8 w-8 rounded-none hover:bg-accent border-y border-border"
      >
        <Maximize2 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          onZoomOut();
        }}
        className="h-8 w-8 rounded-none hover:bg-accent"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
    </div>
  );
};