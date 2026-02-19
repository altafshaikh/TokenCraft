import React, { useState } from 'react';
import { BPETokenizer } from '../utils/bpeTokenizer';
import { TokenizerConfig } from '../types';
import { Play, RotateCcw, Save, Database, Plus, X } from 'lucide-react';
import TokenizerBuilder from './TokenizerBuilder';

interface TrainerProps {
    tokenizer: BPETokenizer;
    onModelTrained: (model: BPETokenizer) => void;
    initialConfig: TokenizerConfig;
}

const DEFAULT_CORPUS = `The quick brown fox jumps over the lazy dog.
Machine learning is fascinating.
Tokenization is the first step in NLP.
Byte Pair Encoding (BPE) is a popular algorithm.
This is a test corpus to see how vocabulary is built.
Foxes are clever animals.
Dogs are loyal companions.`;

const Trainer: React.FC<TrainerProps> = ({ tokenizer, onModelTrained, initialConfig }) => {
    const [regexConfig, setRegexConfig] = useState<TokenizerConfig>(initialConfig);
    const [corpus, setCorpus] = useState(DEFAULT_CORPUS);
    const [vocabSize, setVocabSize] = useState(200);
    const [specialTokens, setSpecialTokens] = useState<string[]>(["<UNK>", "<PAD>", "<EOS>"]);
    const [newSpecialToken, setNewSpecialToken] = useState("");
    const [isTraining, setIsTraining] = useState(false);
    const [trainStats, setTrainStats] = useState<{vocabSize: number} | null>(null);

    const handleAddSpecialToken = () => {
        if (newSpecialToken && !specialTokens.includes(newSpecialToken)) {
            setSpecialTokens([...specialTokens, newSpecialToken]);
            setNewSpecialToken("");
        }
    };

    const handleRemoveSpecialToken = (token: string) => {
        setSpecialTokens(specialTokens.filter(t => t !== token));
    };

    const runTraining = async () => {
        setIsTraining(true);
        // Small timeout to allow UI to update
        setTimeout(() => {
            try {
                const newTokenizer = new BPETokenizer();
                newTokenizer.train(corpus, vocabSize, regexConfig, specialTokens);
                onModelTrained(newTokenizer);
                setTrainStats({ vocabSize: newTokenizer.vocab.size });
            } catch (e) {
                console.error(e);
                alert("Training failed. Check your regex or corpus.");
            } finally {
                setIsTraining(false);
            }
        }, 100);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* Left Col: Configuration */}
            <div className="flex flex-col gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <Database className="w-5 h-5 text-indigo-600" />
                        1. Pre-Tokenization
                    </h3>
                    <p className="text-sm text-slate-500 mb-4">
                        Before learning tokens, we must split the raw text into words or chunks using Regex.
                    </p>
                    <div className="border border-slate-100 rounded-lg p-2 bg-slate-50">
                        <TokenizerBuilder config={regexConfig} onConfigChange={setRegexConfig} />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex-1">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">3. Training Corpus</h3>
                    <textarea 
                        className="w-full h-48 p-3 text-sm font-mono border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 resize-none"
                        value={corpus}
                        onChange={(e) => setCorpus(e.target.value)}
                        placeholder="Paste text here to train your tokenizer..."
                    />
                    <div className="text-xs text-slate-400 mt-2 text-right">
                        {corpus.length} characters
                    </div>
                </div>
            </div>

            {/* Right Col: Parameters & Actions */}
            <div className="flex flex-col gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">2. Vocabulary Settings</h3>
                    
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Target Vocabulary Size</label>
                        <input 
                            type="number" 
                            min="10" 
                            max="5000"
                            value={vocabSize}
                            onChange={(e) => setVocabSize(parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                            The algorithm will merge characters until this limit is reached.
                        </p>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Special Tokens</label>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {specialTokens.map(token => (
                                <span key={token} className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md text-xs font-mono border border-indigo-100 flex items-center gap-1">
                                    {token}
                                    <button onClick={() => handleRemoveSpecialToken(token)} className="hover:text-indigo-900"><X className="w-3 h-3"/></button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={newSpecialToken}
                                onChange={(e) => setNewSpecialToken(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddSpecialToken()}
                                placeholder="Add token (e.g. <SEP>)"
                                className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button 
                                onClick={handleAddSpecialToken}
                                className="px-3 py-2 bg-slate-100 text-slate-600 rounded-md hover:bg-slate-200"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-xl shadow-lg p-6 text-white flex flex-col items-center justify-center gap-4 flex-1 min-h-[200px]">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-2">Ready to Train?</h2>
                        <p className="text-indigo-100 text-sm max-w-xs mx-auto">
                            The tokenizer will learn from your corpus and build a vocabulary of {vocabSize} tokens.
                        </p>
                    </div>
                    
                    <button 
                        onClick={runTraining}
                        disabled={isTraining}
                        className={`px-8 py-3 bg-white text-indigo-700 rounded-full font-bold shadow-lg hover:shadow-xl transform transition-all active:scale-95 flex items-center gap-2 ${isTraining ? 'opacity-70 cursor-wait' : 'hover:-translate-y-1'}`}
                    >
                        {isTraining ? <RotateCcw className="w-5 h-5 animate-spin"/> : <Play className="w-5 h-5 fill-current"/>}
                        {isTraining ? 'Training...' : 'Train Tokenizer'}
                    </button>

                    {trainStats && (
                        <div className="mt-4 bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm text-sm">
                            Training Complete! Vocab Size: {trainStats.vocabSize}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Trainer;
