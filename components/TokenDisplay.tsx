import React, { useMemo } from 'react';
import { Token, TokenStats } from '../types';
import { Hash, Type, AlignJustify, Info } from 'lucide-react';

interface TokenDisplayProps {
  text: string;
  tokens: Token[];
  stats: TokenStats;
}

// A palette of distinct, pleasing colors for tokens
const TOKEN_COLORS = [
  'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
  'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200',
  'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200',
  'bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-200',
  'bg-violet-100 text-violet-800 border-violet-200 hover:bg-violet-200',
  'bg-cyan-100 text-cyan-800 border-cyan-200 hover:bg-cyan-200',
];

const TokenDisplay: React.FC<TokenDisplayProps> = ({ text, tokens, stats }) => {
  
  // Create a visualized text stream where gaps are also shown (optional, but tokens are key)
  // For simplicity and clarity in "Tokenization", we just show the tokens in order.
  
  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <Hash className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Total Tokens</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">{stats.totalTokens}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <Type className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Unique</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">{stats.uniqueTokens}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <AlignJustify className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Length</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">{stats.averageLength.toFixed(1)}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <Info className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Chars</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">{stats.characterCount}</div>
        </div>
      </div>

      {/* Visualization Area */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col min-h-[400px]">
        <div className="p-4 border-b border-slate-100 bg-slate-50 rounded-t-xl flex justify-between items-center">
            <h3 className="font-semibold text-slate-800">Token Stream</h3>
            <span className="text-xs text-slate-500">Hover tokens for details</span>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto">
          {tokens.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <p>No tokens matched.</p>
                <p className="text-sm">Check your text or regex settings.</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 content-start">
                {tokens.map((token, idx) => {
                    const colorClass = TOKEN_COLORS[idx % TOKEN_COLORS.length];
                    return (
                        <div
                            key={`${token.index}-${idx}`}
                            className={`group relative px-2 py-1 rounded-md border text-sm font-mono cursor-default transition-all duration-200 ${colorClass}`}
                        >
                            {token.value}
                            
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 w-48 p-2 bg-slate-900 text-white text-xs rounded shadow-xl pointer-events-none">
                                <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                    <span className="text-slate-400">ID:</span>
                                    <span>{token.id}</span>
                                    <span className="text-slate-400">Index:</span>
                                    <span>{token.index}</span>
                                    <span className="text-slate-400">Length:</span>
                                    <span>{token.value.length}</span>
                                </div>
                                <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                            </div>
                        </div>
                    );
                })}
            </div>
          )}
        </div>
      </div>

      {/* Vocabulary Table (Mini) */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
            <h3 className="text-sm font-semibold text-slate-800">Vocabulary Sample (First 20 unique)</h3>
        </div>
        <div className="p-4 overflow-x-auto">
            <div className="flex gap-2">
                {Array.from(new Set(tokens.map(t => t.value))).slice(0, 20).map((val, i) => (
                    <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded border border-slate-200 font-mono whitespace-nowrap">
                        {val}
                    </span>
                ))}
                {new Set(tokens.map(t => t.value)).size > 20 && (
                    <span className="px-2 py-1 text-slate-400 text-xs italic">...and more</span>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default TokenDisplay;
