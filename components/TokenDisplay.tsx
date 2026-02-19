import React from 'react';
import { Token, TokenStats } from '../types';
import { Hash, Type, AlignJustify, Info } from 'lucide-react';

interface TokenDisplayProps {
  tokens: Token[];
  stats: TokenStats;
  title: string;
  colorTheme?: 'indigo' | 'emerald';
  description?: string;
}

const TokenDisplay: React.FC<TokenDisplayProps> = ({ tokens, stats, title, colorTheme = 'indigo', description }) => {
  
  // Dynamic color assignment
  const getTokenColor = (token: Token) => {
    if (token.isSpecial) return 'bg-slate-800 text-white border-slate-900';
    
    // GPT vs Custom themes
    const indigoColors = [
      'bg-indigo-100 text-indigo-900 border-indigo-200',
      'bg-blue-100 text-blue-900 border-blue-200',
      'bg-violet-100 text-violet-900 border-violet-200',
      'bg-sky-100 text-sky-900 border-sky-200',
    ];
    const emeraldColors = [
      'bg-emerald-100 text-emerald-900 border-emerald-200',
      'bg-teal-100 text-teal-900 border-teal-200',
      'bg-green-100 text-green-900 border-green-200',
      'bg-lime-100 text-lime-900 border-lime-200',
    ];

    const palette = colorTheme === 'emerald' ? emeraldColors : indigoColors;
    return palette[token.id % palette.length];
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className={`px-4 py-3 border-b border-slate-100 flex justify-between items-center ${colorTheme === 'emerald' ? 'bg-emerald-50/50' : 'bg-indigo-50/50'}`}>
        <div>
            <h3 className={`font-bold text-sm flex items-center gap-2 ${colorTheme === 'emerald' ? 'text-emerald-900' : 'text-indigo-900'}`}>
                {title}
            </h3>
            {description && <p className="text-[10px] text-slate-500 mt-0.5">{description}</p>}
        </div>
        <div className="flex gap-3 text-[10px] font-mono text-slate-500">
            <span title="Token Count" className="flex items-center gap-1"><Hash className="w-3 h-3"/> {stats.totalTokens}</span>
            <span title="Avg Length" className="flex items-center gap-1"><AlignJustify className="w-3 h-3"/> {stats.averageLength.toFixed(1)}</span>
        </div>
      </div>
        
      {/* Stream */}
      <div className="p-4 flex-1 overflow-y-auto bg-slate-50/30">
        {tokens.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-300 text-sm">
              <p>Waiting for input...</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-1 content-start font-mono text-sm">
              {tokens.map((token, idx) => (
                  <div
                      key={`${token.index}-${idx}`}
                      className={`group relative px-1.5 py-0.5 rounded border transition-all hover:scale-105 hover:shadow-sm cursor-default whitespace-pre ${getTokenColor(token)}`}
                  >
                      {token.value}
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20 w-max max-w-[200px] bg-slate-800 text-white text-xs rounded-md shadow-xl p-2 pointer-events-none text-left">
                          <div className="font-bold border-b border-slate-600 pb-1 mb-1 truncate">"{token.value}"</div>
                          <div className="grid grid-cols-2 gap-x-3 gap-y-1 opacity-90 text-[10px]">
                              <span>ID:</span> <span className="font-mono text-amber-300">{token.id}</span>
                              <span>Length:</span> <span>{token.value.length} chars</span>
                              {token.isSpecial && <span className="col-span-2 text-rose-300">Special Token</span>}
                          </div>
                      </div>
                  </div>
              ))}
          </div>
        )}
      </div>

      {/* Footer / IDs */}
      <div className="px-4 py-2 bg-white border-t border-slate-100 text-[10px] text-slate-400 font-mono truncate">
         IDs: [{tokens.map(t => t.id).join(', ')}]
      </div>
    </div>
  );
};

export default TokenDisplay;
