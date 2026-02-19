import React, { useState, useEffect, useRef } from 'react';
import { DebugStep } from '../utils/bpeTokenizer';
import { ArrowDown, ScanLine, FileText, Play, FastForward, RotateCcw, Pause, Layers } from 'lucide-react';

interface ProcessVisualizerProps {
  steps: DebugStep[];
  regexPattern: string;
}

const ProcessVisualizer: React.FC<ProcessVisualizerProps> = ({ steps, regexPattern }) => {
  const [visibleCount, setVisibleCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Reset animation when input changes (steps change)
  useEffect(() => {
    setVisibleCount(0);
    setIsPlaying(true);
  }, [steps]);

  // Animation Loop
  useEffect(() => {
    let interval: any;
    if (isPlaying && visibleCount < steps.length) {
      interval = setInterval(() => {
        setVisibleCount((prev) => prev + 1);
      }, 400); // Speed of animation
    } else if (visibleCount >= steps.length) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, visibleCount, steps.length]);

  // Auto-scroll to follow animation
  useEffect(() => {
    if (isPlaying && bottomRef.current) {
        // Only scroll if we are mostly at the bottom already to avoid annoying user if they scrolled up
        bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [visibleCount, isPlaying]);

  const handleReplay = () => {
    setVisibleCount(0);
    setIsPlaying(true);
  };

  const handleSkip = () => {
    setVisibleCount(steps.length);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (visibleCount >= steps.length) {
        handleReplay();
    } else {
        setIsPlaying(!isPlaying);
    }
  };

  if (!steps || steps.length === 0) {
    return (
        <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <Layers className="w-12 h-12 mb-2 opacity-20" />
            <p className="text-sm">Start typing to see the tokenization pipeline...</p>
        </div>
    );
  }

  // Progress Bar calculation
  const progress = Math.min(100, (visibleCount / steps.length) * 100);

  return (
    <div className="flex flex-col h-full overflow-hidden relative">
        
        {/* Controls Header */}
        <div className="px-4 py-2 border-b border-slate-100 bg-white flex items-center justify-between z-20 shrink-0">
            <div className="flex items-center gap-2">
                <button 
                    onClick={togglePlay}
                    className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition-colors"
                    title={isPlaying ? "Pause" : "Play"}
                >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current"/> : <Play className="w-4 h-4 fill-current"/>}
                </button>
                <button 
                    onClick={handleReplay}
                    className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-indigo-600 transition-colors"
                    title="Replay"
                >
                    <RotateCcw className="w-4 h-4"/>
                </button>
                <div className="h-4 w-[1px] bg-slate-200 mx-1"></div>
                <div className="text-xs font-mono text-slate-400">
                    Step {Math.min(visibleCount, steps.length)} / {steps.length}
                </div>
            </div>
            
            <button 
                onClick={handleSkip}
                className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded hover:bg-indigo-50 transition-colors"
            >
                <FastForward className="w-3 h-3" />
                Show All
            </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 w-full bg-slate-100 shrink-0">
            <div 
                className="h-full bg-indigo-500 transition-all duration-300 ease-out" 
                style={{ width: `${progress}%` }}
            />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth">
            
            {/* Step 1: Pre-Tokenization */}
            <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-indigo-100 -z-10"></div>
                <div className="flex items-start gap-4">
                    <div className="bg-indigo-100 p-2 rounded-lg text-indigo-700 mt-1 shadow-sm shrink-0 z-10 ring-4 ring-white">
                        <ScanLine className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-bold text-slate-800 mb-1">1. Pre-Tokenization (Splitting)</h3>
                        <p className="text-xs text-slate-500 mb-3">
                            The text is first split into chunks using your Regex: <code className="bg-slate-100 px-1 rounded border border-slate-200 text-indigo-600 font-mono text-[10px]">{regexPattern}</code>
                        </p>
                        
                        <div className="flex flex-wrap gap-2 min-h-[40px]">
                            {steps.map((step, idx) => {
                                const isVisible = idx < visibleCount;
                                const isNew = idx === visibleCount - 1 && isPlaying;
                                return (
                                    <div 
                                        key={idx} 
                                        className={`bg-white border text-indigo-900 px-3 py-1.5 rounded-md font-mono text-sm shadow-sm whitespace-pre relative group transition-all duration-500 ease-out transform
                                        ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-90 absolute'}
                                        ${isNew ? 'ring-2 ring-indigo-400 border-indigo-400 bg-indigo-50' : 'border-indigo-200'}
                                        `}
                                        style={{ transitionDelay: `${isVisible ? 0 : 0}ms` }} // Immediate hide, smooth show
                                    >
                                        {step.preToken}
                                        {isVisible && (
                                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-indigo-200 animate-bounce">
                                                <ArrowDown className="w-3 h-3" />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Step 2: Tokenization & IDs */}
            <div className="relative pb-10">
                <div className="flex items-start gap-4">
                    <div className="bg-emerald-100 p-2 rounded-lg text-emerald-700 mt-1 shadow-sm shrink-0 z-10 ring-4 ring-white">
                        <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-bold text-slate-800 mb-1">2. Token Lookup & IDs</h3>
                        <p className="text-xs text-slate-500 mb-3">
                            Each chunk is broken down into tokens found in the Vocabulary. 
                        </p>

                        <div className="flex flex-wrap gap-x-2 gap-y-4 min-h-[60px]">
                            {steps.map((step, idx) => {
                                const isVisible = idx < visibleCount;
                                return (
                                    <div 
                                        key={idx} 
                                        className={`flex flex-col items-center bg-slate-50/50 p-2 rounded border border-slate-100 min-w-[30px] transition-all duration-500 ease-out delay-100 transform
                                        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 absolute'}
                                        `}
                                    >
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
                                );
                            })}
                            <div ref={bottomRef} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="mt-4 pt-4 border-t border-slate-100 flex gap-4 text-xs text-slate-500 fixed bottom-0 right-0 left-0 bg-white/90 backdrop-blur px-6 py-2 lg:absolute lg:bg-transparent lg:backdrop-filter-none">
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
    </div>
  );
};

export default ProcessVisualizer;
