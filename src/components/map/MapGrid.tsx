import React from 'react';

interface MapGridProps {
  scale: number;
}

export const MapGrid: React.FC<MapGridProps> = ({ scale }) => {
  // Create a 10x10 grid (A-J, 1-10)
  const letters = Array.from('ABCDEFGHIJ');
  const numbers = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Vertical lines */}
      {letters.map((letter, i) => (
        <div
          key={`v-${letter}`}
          className="absolute top-0 bottom-0 border-r border-gray-300/30"
          style={{
            left: `${(i + 1) * 10}%`,
            transform: `scale(${1/scale}, 1)`,
            transformOrigin: 'left'
          }}
        />
      ))}
      
      {/* Horizontal lines */}
      {numbers.map((num, i) => (
        <div
          key={`h-${num}`}
          className="absolute left-0 right-0 border-b border-gray-300/30"
          style={{
            top: `${(i + 1) * 10}%`,
            transform: `scale(1, ${1/scale})`,
            transformOrigin: 'top'
          }}
        />
      ))}

      {/* Grid labels */}
      <div className="absolute top-0 left-0 w-full h-full">
        {letters.map((letter, i) => (
          <div
            key={`label-${letter}`}
            className="absolute top-1 text-xs text-gray-500"
            style={{
              left: `${i * 10 + 5}%`,
              transform: `scale(${1/scale})`,
              transformOrigin: 'center'
            }}
          >
            {letter}
          </div>
        ))}
        {numbers.map((num, i) => (
          <div
            key={`label-${num}`}
            className="absolute left-1 text-xs text-gray-500"
            style={{
              top: `${i * 10 + 5}%`,
              transform: `scale(${1/scale})`,
              transformOrigin: 'center'
            }}
          >
            {num}
          </div>
        ))}
      </div>
    </div>
  );
};