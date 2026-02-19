import React, { useState } from 'react';
import { Settings, Wand2, RefreshCw, AlertCircle } from 'lucide-react';
import { PRESET_TOKENIZERS } from '../constants';
import { TokenizerConfig } from '../types';
import { generateTokenizerWithGemini } from '../services/geminiService';

interface TokenizerBuilderProps {
  config: TokenizerConfig;
  onConfigChange: (config: TokenizerConfig) => void;
}

const TokenizerBuilder: React.FC<TokenizerBuilderProps> = ({ config, onConfigChange }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = PRESET_TOKENIZERS.find((p) => p.name === e.target.value);
    if (selected) {
      onConfigChange(selected);
      setError(null);
    }
  };

  const handleRegexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onConfigChange({ ...config, regex: e.target.value, name: 'Custom' });
    setError(null);
  };

  const handleFlagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onConfigChange({ ...config, flags: e.target.value, name: 'Custom' });
  };

  const handleAiGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setError(null);
    try {
      const newConfig = await generateTokenizerWithGemini(prompt);
      if (newConfig) {
        onConfigChange(newConfig);
      } else {
        setError("AI could not generate a valid config.");
      }
    } catch (err) {
      setError("Failed to generate tokenizer. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* AI Builder Section */}
      <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
        <label className="block text-xs font-semibold text-indigo-900 mb-1 flex items-center gap-1">
          <Wand2 className="w-3 h-3" />
          AI Magic Builder
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAiGenerate()}
            placeholder="e.g. Keep emails and #hashtags..."
            className="flex-1 px-2 py-1 text-xs border border-indigo-200 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
          <button
            onClick={handleAiGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="px-3 py-1 bg-indigo-600 text-white text-xs font-medium rounded hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-1 transition-colors"
          >
            {isGenerating ? <RefreshCw className="w-3 h-3 animate-spin" /> : 'Go'}
          </button>
        </div>
        {error && <div className="mt-1 text-xs text-red-600">{error}</div>}
      </div>

      {/* Manual Configuration */}
      <div className="flex flex-col gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Strategies</label>
          <select
            value={PRESET_TOKENIZERS.some(p => p.name === config.name) ? config.name : "Custom"}
            onChange={handlePresetChange}
            className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="Custom">Custom / AI Generated</option>
            {PRESET_TOKENIZERS.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Regex Pattern</label>
          <div className="font-mono text-xs flex items-center border border-slate-300 rounded overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
            <span className="bg-slate-100 px-2 py-1.5 text-slate-500 border-r border-slate-300">/</span>
            <input
              type="text"
              value={config.regex}
              onChange={handleRegexChange}
              className="flex-1 px-2 py-1.5 outline-none text-slate-800 min-w-0"
              placeholder="\w+"
            />
            <span className="bg-slate-100 px-2 py-1.5 text-slate-500 border-l border-slate-300">/</span>
            <input
              type="text"
              value={config.flags}
              onChange={handleFlagsChange}
              className="w-12 px-1 py-1.5 outline-none text-slate-800 bg-slate-50 text-center"
              placeholder="g"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenizerBuilder;
