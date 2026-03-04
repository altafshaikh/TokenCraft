import React, { useEffect, useState } from 'react';
import { Coins, AlertCircle, RefreshCcw } from 'lucide-react';

interface TokenPotProps {
  usedTokens: number;
  maxTokens?: number;
  showStats?: boolean;
}

const GPT4_INPUT_COST_PER_1K = 0.03; // $0.03 per 1k tokens (GPT-4 original pricing)

const TokenPot: React.FC<TokenPotProps> = ({ usedTokens, maxTokens = 1000, showStats = true }) => {
  const [remainingTokens, setRemainingTokens] = useState(maxTokens);
  
  // Calculate remaining tokens
  useEffect(() => {
    setRemainingTokens(Math.max(0, maxTokens - usedTokens));
  }, [usedTokens, maxTokens]);

  // Calculate cost
  const cost = (usedTokens / 1000) * GPT4_INPUT_COST_PER_1K;
  
  // Animation values
  const fillPercentage = Math.max(0, (remainingTokens / maxTokens) * 100);
  const usedPercentage = 100 - fillPercentage;
  
  // Color interpolation based on fill level
  const color = fillPercentage > 50 ? '#6366f1' : fillPercentage > 20 ? '#eab308' : '#ef4444';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center gap-6 h-full">
      
      {/* The Pot Visualization */}
      <div className="relative w-32 h-40 flex-shrink-0">
        {/* Pot Container */}
        <div className="absolute inset-0 border-4 border-slate-300 border-t-0 rounded-b-3xl bg-slate-50 overflow-hidden shadow-inner">
          {/* Liquid Level */}
          <div 
            className="absolute bottom-0 left-0 right-0 w-full transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            style={{ 
              height: `${fillPercentage}%`,
              backgroundColor: color,
              opacity: 0.8
            }}
          >
            {/* Bubbles/Texture */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-white/30 w-full" />
          </div>

          {/* Used Level Indicator (Red Tint) */}
          <div 
            className="absolute top-0 left-0 right-0 w-full bg-red-500/10 border-b border-red-500/20 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            style={{ 
              height: `${usedPercentage}%`,
            }}
          />
          
          {/* Start Marker */}
          <div className="absolute top-0 left-0 right-0 border-b border-dashed border-slate-400 w-full opacity-50 flex items-center justify-end pr-1">
             <span className="text-[8px] text-slate-400 font-mono">START</span>
          </div>
          
          {/* Grid lines for measurement */}
          <div className="absolute inset-0 flex flex-col justify-between py-4 pointer-events-none opacity-20">
             <div className="border-t border-slate-900 w-full"></div>
             <div className="border-t border-slate-900 w-full"></div>
             <div className="border-t border-slate-900 w-full"></div>
          </div>
        </div>
        
        {/* Label */}
        <div className="absolute -bottom-8 w-full text-center text-xs font-bold text-slate-500">
          TOKEN POT
        </div>
      </div>

      {/* Stats & Info */}
      <div className="w-full space-y-4 pt-4 border-t border-slate-100">
        
        <div className="text-center">
          <h3 className="text-sm font-bold text-slate-900 flex items-center justify-center gap-2">
            <Coins className="w-4 h-4 text-amber-500" />
            Token Budget
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Starting with {maxTokens} tokens.
          </p>
        </div>

        {!showStats ? (
            <div className="flex flex-col items-center justify-center py-6 space-y-2 animate-pulse">
                <RefreshCcw className="w-5 h-5 text-indigo-400 animate-spin" />
                <span className="text-xs font-medium text-slate-400">Calculating usage...</span>
            </div>
        ) : (
            <>
                <div className="grid grid-cols-2 gap-3 animate-in fade-in zoom-in duration-300">
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <div className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mb-0.5">Remaining</div>
                        <div className="text-lg font-mono font-bold text-slate-800 leading-none">
                            {remainingTokens}
                            <span className="text-[10px] text-slate-400 font-normal ml-1">/ {maxTokens}</span>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <div className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mb-0.5">Used</div>
                        <div className="text-lg font-mono font-bold text-indigo-600 leading-none">
                            {usedTokens}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between bg-indigo-50 border border-indigo-100 p-2 rounded-lg animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider">Est. Cost (GPT-4)</span>
                        <span className="font-mono text-sm font-bold text-indigo-900">${cost.toFixed(5)}</span>
                    </div>
                    <div className="text-[9px] text-indigo-400 text-right leading-tight">
                        $0.03 / 1k
                    </div>
                </div>
            </>
        )}
      </div>

    </div>
  );
};

export default TokenPot;
