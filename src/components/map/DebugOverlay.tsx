import React from 'react';
import { X } from 'lucide-react';

interface HistoryEntry {
  id: number;
  pixels: { x: number; y: number };
  percent: { x: number; y: number };
  scale: number;
}

interface DebugOverlayProps {
  cursorPosition: { x: number; y: number };
  cursorPercent: { x: number; y: number };
  position: { x: number; y: number };
  scale: number;
  imageDimensions: { width: number; height: number } | null;
  clickHistory: HistoryEntry[];
  waypointHistory: HistoryEntry[];
  onReset?: () => void;
}

export const DebugOverlay: React.FC<DebugOverlayProps> = ({
  cursorPosition,
  cursorPercent,
  position,
  scale,
  imageDimensions,
  clickHistory,
  waypointHistory,
  onReset,
}) => {
  return (
    <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm text-white p-2 rounded-lg text-xs font-mono max-h-[80vh] overflow-y-auto shadow-xl border border-white/10">
      <div className="flex justify-between items-center mb-2 gap-2">
        <span className="font-bold text-xs">Debug Info</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const history = `History:\n${clickHistory.map((click, index) => `
Click ${click.id}:
  px: (${Math.round(click.pixels.x)}, ${Math.round(click.pixels.y)})
  %: (${Math.round(click.percent.x)}, ${Math.round(click.percent.y)})
  scale: ${click.scale.toFixed(2)}x${waypointHistory[index] ? `\nWaypoint ${waypointHistory[index].id}:
  px: (${Math.round(waypointHistory[index].pixels.x)}, ${Math.round(waypointHistory[index].pixels.y)})
  %: (${Math.round(waypointHistory[index].percent.x)}, ${Math.round(waypointHistory[index].percent.y)})
  scale: ${waypointHistory[index].scale.toFixed(2)}x` : ''}`).join('\n')}`;
              navigator.clipboard.writeText(history);
            }}
            className="px-1.5 py-0.5 bg-white/10 rounded hover:bg-white/20 text-[10px] transition-colors"
          >
            Copy
          </button>
          {onReset && (
            <button
              onClick={onReset}
              className="px-1.5 py-0.5 bg-white/10 rounded hover:bg-white/20 text-[10px] transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>
      <div className="space-y-0.5 text-[10px] text-white/90">
        <div>Cursor (px): ({Math.round(cursorPosition.x)}, {Math.round(cursorPosition.y)})</div>
        <div>Cursor (%): ({Math.round(cursorPercent.x)}, {Math.round(cursorPercent.y)})</div>
        <div>Pan: ({Math.round(position.x)}, {Math.round(position.y)})</div>
        <div>Scale: {scale.toFixed(2)}x</div>
        {imageDimensions && (
          <div>Image: {imageDimensions.width}x{imageDimensions.height}</div>
        )}
      </div>
      <div className="mt-2 pt-2 border-t border-white/10">
        <div className="font-bold mb-1 text-[10px]">History:</div>
        <div className="space-y-2">
          {clickHistory.map((click, index) => (
            <div key={click.id} className="text-[10px]">
              <div className="text-blue-300/90">Click {click.id}:</div>
              <div className="pl-2 text-white/80">
                <div>px: ({Math.round(click.pixels.x)}, {Math.round(click.pixels.y)})</div>
                <div>%: ({Math.round(click.percent.x)}, {Math.round(click.percent.y)})</div>
                <div>scale: {click.scale.toFixed(2)}x</div>
              </div>
              {waypointHistory[index] && (
                <>
                  <div className="text-green-300/90">Waypoint {waypointHistory[index].id}:</div>
                  <div className="pl-2 text-white/80">
                    <div>px: ({Math.round(waypointHistory[index].pixels.x)}, {Math.round(waypointHistory[index].pixels.y)})</div>
                    <div>%: ({Math.round(waypointHistory[index].percent.x)}, {Math.round(waypointHistory[index].percent.y)})</div>
                    <div>scale: {waypointHistory[index].scale.toFixed(2)}x</div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 