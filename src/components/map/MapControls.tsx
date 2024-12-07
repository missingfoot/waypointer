import React from 'react';
import { ZoomIn, ZoomOut, Maximize, Fullscreen } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onFitToView: () => void;
}

export const MapControls: React.FC<MapControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onFitToView,
}) => {
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <div 
      className="absolute bottom-4 right-4 flex flex-col bg-background rounded-lg shadow-lg border border-border overflow-hidden"
      onMouseDown={stopPropagation}
      onClick={stopPropagation}
      onDoubleClick={stopPropagation}
      onMouseUp={stopPropagation}
      onMouseMove={stopPropagation}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          stopPropagation(e);
          onZoomIn();
        }}
        className="h-10 w-10 rounded-none hover:bg-accent"
      >
        <ZoomIn className="h-4 w-4 scale-125" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          stopPropagation(e);
          onZoomOut();
        }}
        className="h-10 w-10 rounded-none hover:bg-accent"
      >
        <ZoomOut className="h-4 w-4 scale-125" />
      </Button>
      <div className="h-[1px] bg-border" />
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          stopPropagation(e);
          onZoomReset();
        }}
        className="h-10 w-10 rounded-none hover:bg-accent"
      >
        <Maximize className="h-4 w-4 scale-125" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          stopPropagation(e);
          onFitToView();
        }}
        className="h-10 w-10 rounded-none hover:bg-accent"
      >
        <Fullscreen className="h-4 w-4 scale-125" />
      </Button>
    </div>
  );
};