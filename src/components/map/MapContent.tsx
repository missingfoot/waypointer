import React, { useRef, useState, useEffect } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { MapControls } from './MapControls';

interface MapContentProps {
  mapUrl: string;
  waypoints: Array<{
    id: string;
    x: number;  // normalized (0-1)
    y: number;  // normalized (0-1)
    name: string;
    category: string;
  }>;
  onWaypointClick?: (id: string) => void;
  imageRef?: React.RefObject<HTMLImageElement>;
  onImageLoad?: (dimensions: { width: number; height: number }) => void;
  onZoomCallbacksChange?: (callbacks: { 
    zoomIn: () => void; 
    zoomOut: () => void; 
    resetZoom: () => void;
    fitToView: () => void;
  }) => void;
}

export const MapContent: React.FC<MapContentProps> = ({
  mapUrl,
  waypoints,
  onWaypointClick,
  imageRef: externalImageRef,
  onImageLoad,
  onZoomCallbacksChange,
}) => {
  const internalImageRef = useRef<HTMLImageElement>(null);
  const imageRef = externalImageRef || internalImageRef;
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const hasCalledOnLoadRef = useRef(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleLoad = () => {
      if (imageRef.current && !hasCalledOnLoadRef.current) {
        const newDimensions = {
          width: imageRef.current.naturalWidth,
          height: imageRef.current.naturalHeight
        };
        setDimensions(newDimensions);
        onImageLoad?.(newDimensions);
        hasCalledOnLoadRef.current = true;
      }
    };

    const img = imageRef.current;
    if (img) {
      if (img.complete) {
        handleLoad();
      } else {
        img.addEventListener('load', handleLoad);
      }
    }

    return () => {
      img?.removeEventListener('load', handleLoad);
    };
  }, [imageRef, onImageLoad, mapUrl]);

  return (
    <TransformWrapper
      initialScale={1}
      minScale={0.5}
      maxScale={4}
      centerOnInit={true}
      wheel={{ step: 0.25 }}
      alignmentAnimation={{ sizeX: 100, sizeY: 100 }}
      limitToBounds={true}
    >
      {({ zoomIn, zoomOut, resetTransform, centerView, setTransform }) => {
        const handleFitToView = () => {
          if (!wrapperRef.current || !imageRef.current || !dimensions) return;

          const wrapper = wrapperRef.current.getBoundingClientRect();
          const imageAspectRatio = dimensions.width / dimensions.height;
          const wrapperAspectRatio = wrapper.width / wrapper.height;

          let scale;
          if (imageAspectRatio > wrapperAspectRatio) {
            // Image is wider than wrapper relative to height
            scale = (wrapper.width / dimensions.width) * 0.95;
          } else {
            // Image is taller than wrapper relative to width
            scale = (wrapper.height / dimensions.height) * 0.95;
          }

          const x = wrapper.width / 2 - (dimensions.width * scale) / 2;
          const y = wrapper.height / 2 - (dimensions.height * scale) / 2;

          setTransform(x, y, scale, 300);
        };

        const handleResetView = () => {
          if (!wrapperRef.current || !dimensions) return;
          
          const wrapper = wrapperRef.current.getBoundingClientRect();
          const x = wrapper.width / 2 - dimensions.width / 2;
          const y = wrapper.height / 2 - dimensions.height / 2;
          
          setTransform(x, y, 1, 300);
        };

        // Expose zoom callbacks to parent
        React.useEffect(() => {
          onZoomCallbacksChange?.({
            zoomIn: () => zoomIn(0.25),
            zoomOut: () => zoomOut(0.25),
            resetZoom: handleResetView,
            fitToView: handleFitToView
          });
        }, [zoomIn, zoomOut, setTransform]);

        return (
          <>
            <div ref={wrapperRef} className="w-full h-full">
              <TransformComponent
                wrapperStyle={{
                  width: '100%',
                  height: '100%'
                }}
              >
                <div className="relative">
                  <img
                    ref={imageRef}
                    src={mapUrl}
                    alt="Venue Map"
                    className="pointer-events-none shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
                    style={{
                      width: dimensions?.width || 'auto',
                      height: dimensions?.height || 'auto',
                      maxWidth: 'none',
                      maxHeight: 'none'
                    }}
                    draggable={false}
                  />
                  {dimensions && waypoints.map((waypoint) => (
                    <div
                      key={waypoint.id}
                      className="absolute w-4 h-4 -ml-2 -mt-2 bg-blue-500 rounded-full border-2 border-white shadow-md cursor-pointer animate-fade-in hover:bg-blue-600 transition-colors"
                      style={{
                        left: `${waypoint.x * dimensions.width}px`,
                        top: `${waypoint.y * dimensions.height}px`,
                      }}
                      onClick={() => onWaypointClick?.(waypoint.id)}
                      title={waypoint.name}
                    />
                  ))}
                </div>
              </TransformComponent>
            </div>
            <MapControls
              onZoomIn={() => zoomIn(0.25)}
              onZoomOut={() => zoomOut(0.25)}
              onZoomReset={handleResetView}
              onFitToView={handleFitToView}
            />
          </>
        );
      }}
    </TransformWrapper>
  );
};