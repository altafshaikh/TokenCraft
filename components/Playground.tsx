import React, { useState, useEffect } from 'react';
import { BPETokenizer } from '../utils/bpeTokenizer';
import { Token } from '../types';
import { ArrowRight, ArrowDown, Code, Type } from 'lucide-react';

interface PlaygroundProps {
    tokenizer: BPETokenizer;
}

const Playground: React.FC<PlaygroundProps> = ({ tokenizer }) => {
    const [inputText, setInputText] = useState("Hello world! This is a test.");
    const [encodedTokens, setEncodedTokens] = useState<Token[]>([]);
    
    const [inputIds, setInputIds] = useState("");
    const [decodedText, setDecodedText] = useState("");

    // Encoding Effect
    useEffect(() => {
        if (!tokenizer) return;
        try {
            const tokens = tokenizer.encode(inputText);
            setEncodedTokens(tokens);
            // Also auto-populate the decoder input with these IDs for convenience
            setInputIds(tokens.map(t => t.id).join(", "));
        } catch (e) {
            console.error(e);
        }
    }, [inputText, tokenizer]);

    // Decoding Effect
    useEffect(() => {
        if (!tokenizer) return;
        try {
            const ids = inputIds.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
            const text = tokenizer.decode(ids);
            setDecodedText(text);
        } catch (e) {
            console.error(e);
        }
    }, [inputIds, tokenizer]);

    // Colors for visualization
    const getColor = (id: number) => {
        const colors = [
            'bg-blue-100 text-blue-900 border-blue-200',
            'bg-emerald-100 text-emerald-900 border-emerald-200',
            'bg-amber-100 text-amber-900 border-amber-200',
            'bg-rose-100 text-rose-900 border-rose-200',
            'bg-violet-100 text-violet-900 border-violet-200',
            'bg-cyan-100 text-cyan-900 border-cyan-200',
        ];
        return colors[id % colors.length];
    };

    return (
        <div className="flex flex-col gap-8 h-full">
            
            {/* Encoder Section */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="md:col-span-12 bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center gap-2">
                    <Code className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-semibold text-slate-800">Encoder (Text to IDs)</h3>
                </div>
                
                <div className="md:col-span-5 p-6 border-r border-slate-100">
                    <label className="block text-sm font-medium text-slate-500 mb-2">Input Text</label>
                    <textarea 
                        className="w-full h-32 p-3 text-lg border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Type something..."
                    />
                </div>
                
                <div className="md:col-span-2 flex items-center justify-center text-slate-300">
                    <ArrowRight className="w-8 h-8 hidden md:block" />
                    <ArrowDown className="w-8 h-8 md:hidden" />
                </div>

                <div className="md:col-span-5 p-6 bg-slate-50/50">
                    <label className="block text-sm font-medium text-slate-500 mb-2">Tokens & IDs</label>
                    <div className="flex flex-wrap gap-2 content-start h-32 overflow-y-auto">
                        {encodedTokens.map((t, idx) => (
                            <div key={idx} className={`group relative px-2 py-1 rounded text-sm font-mono cursor-help border ${getColor(t.id)}`}>
                                {t.value}
                                <span className="ml-1 opacity-50 text-xs">#{t.id}</span>
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                    Token: "{t.value}" | ID: {t.id}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-200">
                         <div className="text-xs text-slate-500 font-mono break-all">
                             [{encodedTokens.map(t => t.id).join(', ')}]
                         </div>
                    </div>
                </div>
            </div>

            {/* Decoder Section */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="md:col-span-12 bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center gap-2">
                    <Type className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-semibold text-slate-800">Decoder (IDs to Text)</h3>
                </div>
                
                <div className="md:col-span-5 p-6 border-r border-slate-100">
                    <label className="block text-sm font-medium text-slate-500 mb-2">Input IDs (comma separated)</label>
                    <textarea 
                        className="w-full h-32 p-3 text-lg font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                        value={inputIds}
                        onChange={(e) => setInputIds(e.target.value)}
                        placeholder="12, 45, 99..."
                    />
                </div>
                
                <div className="md:col-span-2 flex items-center justify-center text-slate-300">
                    <ArrowRight className="w-8 h-8 hidden md:block" />
                    <ArrowDown className="w-8 h-8 md:hidden" />
                </div>

                <div className="md:col-span-5 p-6 bg-slate-50/50">
                    <label className="block text-sm font-medium text-slate-500 mb-2">Reconstructed Text</label>
                    <div className="p-4 bg-white border border-slate-200 rounded-lg h-32 overflow-y-auto whitespace-pre-wrap">
                        {decodedText}
                    </div>
                </div>
            </div>

            {/* Vocab View */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                 <h3 className="font-semibold text-slate-800 mb-4">Learned Vocabulary ({tokenizer.vocab.size} tokens)</h3>
                 <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto p-2 bg-slate-50 rounded-lg border border-slate-100">
                     {Array.from(tokenizer.vocab.entries()).sort((a,b) => a[1] - b[1]).map(([token, id]) => (
                         <div key={id} className="text-xs px-2 py-1 bg-white border border-slate-200 rounded text-slate-600 font-mono" title={`ID: ${id}`}>
                             <span className="text-slate-400 mr-1">{id}:</span>
                             <span className="font-bold text-indigo-700">{token}</span>
                         </div>
                     ))}
                 </div>
            </div>
        </div>
    );
};

export default Playground;
