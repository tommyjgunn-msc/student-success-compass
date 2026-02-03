'use client';

import { PatternQuestion as PatternQuestionType } from '@/lib/types';

interface PatternQuestionProps {
  patternData: PatternQuestionType;
  options: { value: string | number; label: string }[];
  value: string | undefined;
  onChange: (value: string) => void;
}

// Map symbols to SVG components
function SymbolDisplay({ symbol, size = 'md' }: { symbol: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };
  
  const baseClass = `${sizeClasses[size]} flex items-center justify-center`;
  
  // Map text symbols to visual representations
  const symbolMap: Record<string, JSX.Element> = {
    // Circles
    '●': <div className={`${baseClass}`}><div className="w-full h-full rounded-full bg-compass-600" /></div>,
    '○': <div className={`${baseClass}`}><div className="w-full h-full rounded-full border-2 border-compass-600" /></div>,
    
    // Squares
    '■': <div className={`${baseClass}`}><div className="w-full h-full bg-growth-600" /></div>,
    '□': <div className={`${baseClass}`}><div className="w-full h-full border-2 border-growth-600" /></div>,
    
    // Triangles
    '▲': (
      <div className={`${baseClass}`}>
        <svg viewBox="0 0 24 24" className="w-full h-full fill-amber-600">
          <polygon points="12,2 22,22 2,22" />
        </svg>
      </div>
    ),
    '△': (
      <div className={`${baseClass}`}>
        <svg viewBox="0 0 24 24" className="w-full h-full stroke-amber-600 fill-none" strokeWidth="2">
          <polygon points="12,2 22,22 2,22" />
        </svg>
      </div>
    ),
    
    // Diamond
    '◆': (
      <div className={`${baseClass}`}>
        <svg viewBox="0 0 24 24" className="w-full h-full fill-purple-600">
          <polygon points="12,2 22,12 12,22 2,12" />
        </svg>
      </div>
    ),
    
    // Question mark for missing
    '?': (
      <div className={`${baseClass}`}>
        <div className="w-full h-full rounded-lg border-2 border-dashed border-ink-muted flex items-center justify-center">
          <span className="text-ink-muted text-xl font-bold">?</span>
        </div>
      </div>
    ),
  };
  
  // Handle compound symbols (multiple shapes in a cell)
  if (symbol.length > 1 && !symbolMap[symbol]) {
    return (
      <div className={`${sizeClasses[size]} flex items-center justify-center gap-0.5`}>
        {symbol.split('').map((s, i) => (
          <div key={i} className="w-3 h-3 flex items-center justify-center">
            {symbolMap[s] ? (
              <div className="w-full h-full scale-[0.3]">{symbolMap[s]}</div>
            ) : (
              <span className="text-xs">{s}</span>
            )}
          </div>
        ))}
      </div>
    );
  }
  
  return symbolMap[symbol] || <span className="text-2xl">{symbol}</span>;
}

export default function PatternQuestion({ patternData, options, value, onChange }: PatternQuestionProps) {
  return (
    <div className="space-y-6">
      {/* Pattern Grid */}
      {patternData.type === 'matrix' && patternData.grid && (
        <div className="flex justify-center">
          <div className="inline-grid gap-1 p-4 bg-surface-secondary rounded-xl">
            {patternData.grid.map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-1">
                {row.map((cell, cellIndex) => (
                  <div
                    key={cellIndex}
                    className={`
                      w-16 h-16 flex items-center justify-center rounded-lg
                      ${cell === '?' 
                        ? 'bg-compass-100 border-2 border-dashed border-compass-400' 
                        : 'bg-white border border-surface-tertiary'
                      }
                    `}
                  >
                    <SymbolDisplay symbol={cell} size="md" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Sequence */}
      {patternData.type === 'sequence' && patternData.sequence && (
        <div className="flex justify-center">
          <div className="flex items-center gap-2 p-4 bg-surface-secondary rounded-xl">
            {patternData.sequence.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-14 h-14 flex items-center justify-center bg-white rounded-lg border border-surface-tertiary">
                  <SymbolDisplay symbol={item} size="md" />
                </div>
                {index < patternData.sequence!.length - 1 && (
                  <span className="text-ink-muted">→</span>
                )}
              </div>
            ))}
            <span className="text-ink-muted">→</span>
            <div className="w-14 h-14 flex items-center justify-center bg-compass-100 rounded-lg border-2 border-dashed border-compass-400">
              <span className="text-compass-600 text-xl font-bold">?</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Answer Options */}
      <div className="flex justify-center gap-3 flex-wrap">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value as string)}
            className={`
              flex items-center justify-center gap-2 px-5 py-3 rounded-xl transition-all
              ${value === option.value
                ? 'bg-compass-500 text-white shadow-md ring-2 ring-compass-300'
                : 'bg-surface-secondary text-ink hover:bg-surface-tertiary'
              }
            `}
          >
            <span className="font-semibold">{option.value}.</span>
            <span className="text-lg">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
