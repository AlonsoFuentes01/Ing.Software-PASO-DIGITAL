import React, { useMemo } from 'react';

interface QRGeneratorProps {
  value: string;
  size?: number;
}

export default function QRGenerator({ value, size = 160 }: QRGeneratorProps) {
  // Let's generate a stable pseudorandom grid based on the string value hash
  const grid = useMemo(() => {
    // Basic hash of value string
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      hash = value.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const sizeInDots = 21; // standard version 1 QR size
    const tempGrid: boolean[][] = [];
    
    for (let r = 0; r < sizeInDots; r++) {
      tempGrid[r] = [];
      for (let c = 0; c < sizeInDots; c++) {
        // Finder patterns (3 corners)
        const isTopLeftFinder = r < 7 && c < 7;
        const isTopRightFinder = r < 7 && c >= sizeInDots - 7;
        const isBottomLeftFinder = r >= sizeInDots - 7 && c < 7;
        
        if (isTopLeftFinder) {
          // outer border (7x7), inner hollow, center dot (3x3)
          const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
          const isInnerSpace = r === 1 || r === 5 || c === 1 || c === 5;
          tempGrid[r][c] = isBorder || !isInnerSpace;
        } else if (isTopRightFinder) {
          const tc = c - (sizeInDots - 7);
          const isBorder = r === 0 || r === 6 || tc === 0 || tc === 6;
          const isInnerSpace = r === 1 || r === 5 || tc === 1 || tc === 5;
          tempGrid[r][c] = isBorder || !isInnerSpace;
        } else if (isBottomLeftFinder) {
          const tr = r - (sizeInDots - 7);
          const isBorder = tr === 0 || tr === 6 || c === 0 || c === 6;
          const isInnerSpace = tr === 1 || tr === 5 || c === 1 || c === 5;
          tempGrid[r][c] = isBorder || !isInnerSpace;
        } else if (r >= 9 && r <= 11 && c >= 9 && c <= 11) {
          // Center logo area: let's leave it mostly blank/special for a custom icon
          tempGrid[r][c] = false;
        } else {
          // Pseudorandom generation based on hash & coordinates
          const noise = Math.sin((r * 12.9898 + c * 78.233 + hash) * 43758.5453123);
          tempGrid[r][c] = (noise - Math.floor(noise)) > 0.45;
        }
      }
    }
    return tempGrid;
  }, [value]);

  return (
    <div className="flex flex-col items-center justify-center p-3 bg-white border-2 border-slate-200 rounded-xl shadow-sm relative group">
      <svg
        width={size}
        height={size}
        viewBox="0 0 21 21"
        shapeRendering="crispEdges"
        className="text-slate-900 transition-transform duration-300 group-hover:scale-[1.02]"
        id="qr-svg"
      >
        <rect width="21" height="21" fill="#FFFFFF" />
        {grid.map((row, r) =>
          row.map((active, c) => {
            if (!active) return null;
            return (
              <rect
                key={`${r}-${c}`}
                x={c}
                y={r}
                width="1"
                height="1"
                fill="currentColor"
              />
            );
          })
        )}
        
        {/* Chilean Custom Shield Emblem in the very center */}
        <g transform="translate(9, 9)">
          {/* White card backing */}
          <rect x="-0.1" y="-0.1" width="3.2" height="3.2" fill="#FFFFFF" rx="0.5" />
          
          {/* Custom micro shield with blue top and red bottom, or custom star */}
          <rect x="0.3" y="0.3" width="2.4" height="1.2" fill="#003399" />
          <rect x="0.3" y="1.5" width="2.4" height="1.2" fill="#C8102E" />
          {/* Tiny star */}
          <polygon points="1.5,0.5 1.7,1.0 2.2,1.0 1.8,1.3 2.0,1.8 1.5,1.5 1.0,1.8 1.2,1.3 0.8,1.0 1.3,1.0" fill="#FFFFFF" transform="scale(0.8) translate(0.4, 0.2)" />
        </g>
      </svg>
      
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-slate-400 m-1 rounded-tl-sm"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-slate-400 m-1 rounded-tr-sm"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-slate-400 m-1 rounded-bl-sm"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-slate-400 m-1 rounded-br-sm"></div>
    </div>
  );
}
