import React from 'react';
import { DebugStep } from '../utils/bpeTokenizer';
import { ArrowDown, ScanLine, FileText, ArrowRight, Layers } from 'lucide-react';

interface ProcessVisualizerProps {
  steps: DebugStep[];
  regexPattern: string;
}

const ProcessVisualizer: React.FC<ProcessVisualizerProps> = ({ steps, regexPattern }) => {
  if (!steps || steps.length === 0) {
    return (
        <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <Layers className="w-12 h-12 mb-2 opacity-20" />
            <p className="text-sm">Start typing to see the tokenization pipeline...</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 h-full overflow-y-auto">
        
        {/* Step 1: Pre-Tokenization */}
        <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-indigo-100 -z-10"></div>
            <div className="flex items-start gap-4">
                <div className="bg-indigo-100 p-2 rounded-lg text-indigo-700 mt-1 shadow-sm shrink-0 z-10">
                    <ScanLine className="w-5 h-5" />
                </div>
                <div className="flex-1">
                    <h3 className="text-sm font-bold text-slate-800 mb-1">1. Pre-Tokenization (Splitting)</h3>
                    <p className="text-xs text-slate-500 mb-3">
                        The text is first split into chunks using your Regex: <code className="bg-slate-100 px-1 rounded border border-slate-200 text-indigo-600 font-mono text-[10px]">{regexPattern}</code>
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                        {steps.map((step, idx) => (
                            <div key={idx} className="bg-white border border-indigo-200 text-indigo-900 px-3 py-1.5 rounded-md font-mono text-sm shadow-sm whitespace-pre relative group">
                                {step.preToken}
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-indigo-200">
                                    <ArrowDown className="w-3 h-3" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Step 2: Tokenization & IDs */}
        <div className="relative">
            <div className="flex items-start gap-4">
                <div className="bg-emerald-100 p-2 rounded-lg text-emerald-700 mt-1 shadow-sm shrink-0 z-10">
                    <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1">
                    <h3 className="text-sm font-bold text-slate-800 mb-1">2. Token Lookup & IDs</h3>
                    <p className="text-xs text-slate-500 mb-3">
                        Each chunk is broken down into tokens found in the Vocabulary. 
                        Common words like "ing" might be single tokens (IDs).
                    </p>

                    <div className="flex flex-wrap gap-x-2 gap-y-4">
                        {steps.map((step, idx) => (
                            <div key={idx} className="flex flex-col items-center bg-slate-50/50 p-2 rounded border border-slate-100 min-w-[30px]">
                                {/* The Connection visual */}
                                <div className="text-[10px] text-slate-400 mb-1 font-mono border-b border-slate-200 w-full text-center pb-1 truncate max-w-[80px]">
                                    "{step.preToken}"
                                </div>
                                
                                <div className="flex gap-1">
                                    {step.subTokens.map((t, tIdx) => (
                                        <div key={tIdx} className="flex flex-col items-center group relative">
                                            <span 
                                                className={`px-2 py-1 rounded text-sm font-mono border shadow-sm transition-transform hover:scale-110 cursor-help
                                                ${t.isSpecial ? 'bg-slate-800 text-white border-slate-900' : 'bg-emerald-50 text-emerald-800 border-emerald-200'}`}
                                            >
                                                {t.value}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-400 mt-1 font-mono">
                                                {t.id}
                                            </span>
                                            
                                            {/* Tooltip */}
                                            <div className="absolute bottom-full mb-1 hidden group-hover:block z-20 bg-slate-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">
                                                ID: {t.id} | Len: {t.value.length}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Legend */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex gap-4 text-xs text-slate-500">
             <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-indigo-100 border border-indigo-200 rounded"></div>
                Regex Match
             </div>
             <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-emerald-50 border border-emerald-200 rounded"></div>
                Vocabulary Token
             </div>
             <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-slate-800 border border-slate-900 rounded"></div>
                Special Token
             </div>
        </div>

    </div>
  );
};

export default ProcessVisualizer;
