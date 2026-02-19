import React, { useState } from 'react';
import { Code2, Share2, HelpCircle, Layers, PlayCircle } from 'lucide-react';
import Trainer from './components/Trainer';
import Playground from './components/Playground';
import { PRESET_TOKENIZERS } from './constants';
import { BPETokenizer } from './utils/bpeTokenizer';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'train' | 'play'>('train');
  const [tokenizer, setTokenizer] = useState<BPETokenizer>(new BPETokenizer());

  // Handle when a new model is trained in the Trainer component
  const handleModelTrained = (newModel: BPETokenizer) => {
      setTokenizer(newModel);
      setActiveTab('play'); // Auto switch to playground
  };

  return (
    <div className="min-h-screen flex flex-col text-slate-800 bg-slate-50/50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-sm">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">TokenCraft</h1>
                <p className="text-xs text-slate-500">Custom Tokenizer Builder</p>
            </div>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-lg">
             <button 
                onClick={() => setActiveTab('train')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'train' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
                <Layers className="w-4 h-4" />
                Build & Train
             </button>
             <button 
                onClick={() => setActiveTab('play')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'play' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
                <PlayCircle className="w-4 h-4" />
                Playground
             </button>
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="https://ai.google.dev" 
              target="_blank" 
              rel="noreferrer" 
              className="text-slate-500 hover:text-indigo-600 transition-colors"
              title="Powered by Gemini"
            >
                <HelpCircle className="w-5 h-5" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
         {activeTab === 'train' ? (
             <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                 <div className="mb-6">
                     <h2 className="text-2xl font-bold text-slate-900">Design Your Tokenizer</h2>
                     <p className="text-slate-500">Configure pre-tokenization rules and train your BPE model on custom text.</p>
                 </div>
                 <Trainer 
                    tokenizer={tokenizer} 
                    onModelTrained={handleModelTrained} 
                    initialConfig={PRESET_TOKENIZERS[0]}
                 />
             </div>
         ) : (
             <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                 <div className="mb-6">
                     <h2 className="text-2xl font-bold text-slate-900">Test Your Model</h2>
                     <p className="text-slate-500">Encode text into tokens and decode IDs back to text.</p>
                 </div>
                 <Playground tokenizer={tokenizer} />
             </div>
         )}
      </main>
      
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
            <p>Built with React & Gemini. TokenCraft helps you understand how LLMs see text.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
