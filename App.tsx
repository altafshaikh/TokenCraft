import React, { useState, useEffect, useCallback } from 'react';
import { Code2, RefreshCw, Settings2, Database, ALargeSmall, Split, Layers } from 'lucide-react';
import TokenizerBuilder from './components/TokenizerBuilder';
import TokenDisplay from './components/TokenDisplay';
import ProcessVisualizer from './components/ProcessVisualizer';
import EducationPanel from './components/EducationPanel';
import { TokenizerConfig, Token, TokenStats } from './types';
import { PRESET_TOKENIZERS } from './constants';
import { BPETokenizer, DebugStep } from './utils/bpeTokenizer';
import { getGPTTokens } from './utils/gptTokenizer';

const DEFAULT_CORPUS = `Tokenization is the foundation of Large Language Models.
It translates raw text into numbers (IDs) that the model can process.
Different strategies (like BPE vs WordPiece) result in different efficiencies.
Emojis 🤖 and complex scripts often require byte-level fallback.`;

const DEFAULT_INPUT = "Hello! I am learning about Tokenization 🤖 today.";

const App: React.FC = () => {
  // --- View Mode ---
  const [viewMode, setViewMode] = useState<'custom' | 'compare'>('custom');

  // --- Configuration State ---
  const [regexConfig, setRegexConfig] = useState<TokenizerConfig>(PRESET_TOKENIZERS[0]);
  const [corpus, setCorpus] = useState(DEFAULT_CORPUS);
  const [vocabSize, setVocabSize] = useState(300);
  const [specialTokensString, setSpecialTokensString] = useState("<UNK>, <PAD>");
  
  // --- Model State ---
  const [tokenizer, setTokenizer] = useState<BPETokenizer | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  
  // --- Live Test State ---
  const [inputText, setInputText] = useState(DEFAULT_INPUT);
  
  // Custom Model Tokens & Steps
  const [customTokens, setCustomTokens] = useState<Token[]>([]);
  const [customDebugSteps, setCustomDebugSteps] = useState<DebugStep[]>([]);
  const [customStats, setCustomStats] = useState<TokenStats>({ totalTokens: 0, uniqueTokens: 0, averageLength: 0, characterCount: 0 });
  
  // GPT Model Tokens
  const [gptTokens, setGptTokens] = useState<Token[]>([]);
  const [gptStats, setGptStats] = useState<TokenStats>({ totalTokens: 0, uniqueTokens: 0, averageLength: 0, characterCount: 0 });

  // --- Helpers ---
  const calcStats = (tokens: Token[], text: string): TokenStats => {
      const uniqueCount = new Set(tokens.map(t => t.id)).size;
      const totalLen = tokens.reduce((acc, t) => acc + t.value.length, 0);
      return {
          totalTokens: tokens.length,
          uniqueTokens: uniqueCount,
          averageLength: tokens.length > 0 ? totalLen / tokens.length : 0,
          characterCount: text.length,
      };
  };

  // --- Input Processing ---
  const processInput = useCallback(async (text: string, currentTokenizer: BPETokenizer) => {
      if (!currentTokenizer) return;
      
      try {
          // 1. Custom Tokenizer
          // Use a small timeout to not block UI if processing is heavy
          const { tokens: cTokens, steps } = currentTokenizer.encodeDebug(text);
          setCustomTokens(cTokens);
          setCustomDebugSteps(steps);
          setCustomStats(calcStats(cTokens, text));

          // 2. GPT Tokenizer
          // Now async to handle dynamic import
          try {
             const gTokens = await getGPTTokens(text);
             setGptTokens(gTokens);
             setGptStats(calcStats(gTokens, text));
          } catch (gptError) {
             console.error("GPT Tokenizer processing failed", gptError);
             setGptTokens([]);
          }
      } catch (e) {
          console.error("Processing error", e);
      }
  }, []);

  // --- Training Logic ---
  const handleTrain = useCallback(() => {
    setIsTraining(true);
    // Use setTimeout to unblock UI render
    setTimeout(() => {
        try {
            const specialTokens = specialTokensString.split(',').map(s => s.trim()).filter(s => s.length > 0);
            
            // Re-instantiate tokenizer
            const newTokenizer = new BPETokenizer();
            newTokenizer.train(corpus, vocabSize, regexConfig, specialTokens);
            
            setTokenizer(newTokenizer);
            
            // Immediate update after training
            processInput(inputText, newTokenizer);
        } catch (e) {
            console.error("Training Error", e);
        } finally {
            setIsTraining(false);
        }
    }, 50);
  }, [corpus, vocabSize, regexConfig, specialTokensString, inputText, processInput]);

  // Initial load
  useEffect(() => {
    handleTrain();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const text = e.target.value;
      setInputText(text);
      if (tokenizer) {
          processInput(text, tokenizer);
      }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 h-16 px-6 sticky top-0 z-40 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-sm">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
                <h1 className="font-bold text-slate-900 leading-none">TokenCraft Lab</h1>
                <p className="text-[10px] text-slate-500 font-medium tracking-wide mt-1">INTERACTIVE TOKENIZER PLAYGROUND</p>
            </div>
        </div>

        <div className="flex items-center bg-slate-100 p-1 rounded-lg">
            <button 
                onClick={() => setViewMode('custom')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-2 transition-all ${viewMode === 'custom' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <Layers className="w-3 h-3" />
                Process View
            </button>
            <button 
                onClick={() => setViewMode('compare')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-2 transition-all ${viewMode === 'compare' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <Split className="w-3 h-3" />
                Compare GPT-4
            </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-4rem)] overflow-hidden">
        
        {/* --- LEFT PANEL: CONFIGURATION (Scrollable) --- */}
        <div className="w-full lg:w-[380px] bg-white border-r border-slate-200 flex flex-col h-full overflow-y-auto z-20 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
            <div className="p-5 flex flex-col gap-8">
                
                {/* Intro / Educational Context */}
                <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
                    <h3 className="text-indigo-900 font-bold text-sm mb-1">How do LLMs read?</h3>
                    <p className="text-xs text-indigo-700/80 leading-relaxed">
                        LLMs don't read words. They read <strong>tokens</strong>. A token can be a word, part of a word, or even a single space.
                        Efficient tokenizers (like GPT-4's) have large vocabularies to minimize the token count.
                    </p>
                </div>

                {/* 1. Vocabulary Settings */}
                <section>
                    <div className="flex items-center gap-2 mb-3 text-slate-800 font-bold text-xs uppercase tracking-wider">
                        <Settings2 className="w-4 h-4 text-indigo-500" />
                        Custom Tokenizer Settings
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                                Vocabulary Size
                                <span className="text-indigo-600 bg-indigo-50 px-1.5 rounded">{vocabSize}</span>
                            </label>
                            <input 
                                type="range" 
                                min="100" 
                                max="2000" 
                                step="50"
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                value={vocabSize}
                                onChange={(e) => setVocabSize(parseInt(e.target.value))}
                            />
                            <p className="text-[10px] text-slate-400 mt-1">
                                Higher vocab = larger chunks (better compression), but more complex model.
                            </p>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Regex Splitting Rule</label>
                            <div className="bg-slate-50 p-2 rounded border border-slate-200">
                                <TokenizerBuilder config={regexConfig} onConfigChange={setRegexConfig} />
                            </div>
                        </div>
                    </div>
                </section>

                <hr className="border-slate-100" />

                {/* 2. Training Data */}
                <section className="flex-1 flex flex-col min-h-[150px]">
                    <div className="flex items-center gap-2 mb-3 text-slate-800 font-bold text-xs uppercase tracking-wider">
                        <Database className="w-4 h-4 text-indigo-500" />
                        Training Corpus
                    </div>
                    <textarea 
                        className="flex-1 w-full p-3 text-xs font-mono border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 bg-white resize-y min-h-[120px]"
                        value={corpus}
                        onChange={(e) => setCorpus(e.target.value)}
                        placeholder="Paste text here to train your custom tokenizer..."
                    />
                     <button 
                        onClick={handleTrain}
                        disabled={isTraining}
                        className="mt-3 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 disabled:opacity-50"
                    >
                        {isTraining ? <RefreshCw className="w-3 h-3 animate-spin"/> : <RefreshCw className="w-3 h-3"/>}
                        RE-TRAIN MODEL
                    </button>
                </section>
                
                {/* Educational Panel Component */}
                <EducationPanel />

            </div>
        </div>

        {/* --- RIGHT PANEL: PLAYGROUND & COMPARISON --- */}
        <div className="flex-1 flex flex-col bg-slate-50/50 h-full overflow-hidden">
            
            {/* Input Area */}
            <div className="p-6 pb-4 flex-shrink-0 bg-white border-b border-slate-200 z-10">
                 <label className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">
                    <ALargeSmall className="w-4 h-4 text-indigo-500" />
                    Test Input Text
                </label>
                <div className="relative group">
                    <textarea 
                        className="w-full h-28 p-4 text-lg text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none resize-none transition-all shadow-inner leading-relaxed"
                        value={inputText}
                        onChange={handleInputChange}
                        placeholder="Type something here to see how it gets tokenized..."
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-slate-400 pointer-events-none">
                        {inputText.length} chars
                    </div>
                </div>
            </div>

            {/* Results Area */}
            <div className="flex-1 p-6 overflow-hidden">
                {viewMode === 'custom' ? (
                     <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-100 bg-indigo-50/50 flex items-center gap-2">
                             <Layers className="w-4 h-4 text-indigo-600" />
                             <h3 className="font-bold text-sm text-indigo-900">Tokenizer Pipeline Visualization</h3>
                        </div>
                        <ProcessVisualizer steps={customDebugSteps} regexPattern={regexConfig.regex} />
                     </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                        {/* Custom Tokenizer Result */}
                        <div className="flex flex-col h-full min-h-0">
                            <TokenDisplay 
                                tokens={customTokens} 
                                stats={customStats} 
                                title="Your Custom Tokenizer"
                                description={`BPE Model (Vocab: ${vocabSize}) • Trained on corpus`}
                                colorTheme="indigo"
                            />
                        </div>

                        {/* GPT Comparison Result */}
                        <div className="flex flex-col h-full min-h-0 animate-in fade-in slide-in-from-right-4 duration-500">
                                <TokenDisplay 
                                tokens={gptTokens} 
                                stats={gptStats} 
                                title="OpenAI GPT-4"
                                description="Standard cl100k_base • Pre-trained (~100k Vocab)"
                                colorTheme="emerald"
                            />
                        </div>
                    </div>
                )}
            </div>

        </div>

      </main>
    </div>
  );
};

export default App;
