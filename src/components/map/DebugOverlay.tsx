import React from 'react';
import { X } from 'lucide-react';

interface HistoryEntry {
  id: number;
  pixels: { x: number; y: number };
  percent: { x: number; y: number };
  scale: number;
  timestamp: number;
  type: 'click' | 'waypoint';
}

interface DebugOverlayProps {
  cursorPosition: { x: number; y: number };
  cursorPercent: { x: number; y: number };
  position: { x: number; y: number };
  scale: number;
  imageDimensions: { width: number; height: number } | null;
  clickHistory: HistoryEntry[];
  waypointHistory: HistoryEntry[];
  combinedHistory: HistoryEntry[];
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
  combinedHistory,
  onReset,
}) => {
  return (
    <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm text-white p-2 rounded-lg text-xs font-mono max-h-[80vh] overflow-y-auto shadow-xl border border-white/10 z-50">
      <div className="flex justify-between items-center mb-2 gap-2">
        <span className="font-bold text-xs">Debug Info</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const history = `History:\n${combinedHistory.map(entry => `
${entry.type === 'click' ? 'Click' : 'Waypoint'} ${entry.id}:
  px: (${Math.round(entry.pixels.x)}, ${Math.round(entry.pixels.y)})
  %: (${Math.round(entry.percent.x)}, ${Math.round(entry.percent.y)})
  scale: ${entry.scale.toFixed(2)}x
  time: ${new Date(entry.timestamp).toLocaleTimeString()}`).join('\n')}`;
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
          {combinedHistory.map((entry) => (
            <div key={`${entry.type}-${entry.id}`} className="text-[10px]">
              <div className={entry.type === 'click' ? 'text-blue-300/90' : 'text-green-300/90'}>
                {entry.type === 'click' ? 'Click' : 'Waypoint'} {entry.id}:
              </div>
              <div className="pl-2 text-white/80">
                <div>px: ({Math.round(entry.pixels.x)}, {Math.round(entry.pixels.y)})</div>
                <div>%: ({Math.round(entry.percent.x)}, {Math.round(entry.percent.y)})</div>
                <div>scale: {entry.scale.toFixed(2)}x</div>
                <div>time: {new Date(entry.timestamp).toLocaleTimeString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 