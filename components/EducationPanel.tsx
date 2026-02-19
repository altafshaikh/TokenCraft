import React from 'react';
import { BookOpen, AlertTriangle, Layers, Globe } from 'lucide-react';

const EducationPanel: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 bg-indigo-50/50 flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-indigo-600" />
        <h3 className="font-semibold text-sm text-slate-800">Tokenizer Challenges & Concepts</h3>
      </div>
      
      <div className="p-5 space-y-6 text-sm text-slate-600">
        
        <section>
          <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
            <Layers className="w-4 h-4 text-amber-500" />
            1. The "Vocabulary" Trade-off
          </h4>
          <p className="mb-2">
            Tokenizers balance between <strong>Character Level</strong> (tiny vocab, long sequences) and <strong>Word Level</strong> (huge vocab, many unknowns).
          </p>
          <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs">
            <ul className="list-disc pl-4 space-y-1">
              <li><strong>Small Vocab (e.g., 200 tokens):</strong> Your custom model splits words often (e.g., "i", "n", "g"). Good for flexibility, bad for model efficiency.</li>
              <li><strong>Large Vocab (e.g., GPT-4's ~100k):</strong> Memorizes whole words like "Tokenization". Efficient, but the model file is larger.</li>
            </ul>
          </div>
        </section>

        <section>
          <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            2. The Space & Punctuation Problem
          </h4>
          <p>
            Computers see spaces as just another character. Tokenizers must decide: is <code>" apple"</code> (with space) different from <code>"apple"</code>?
          </p>
          <p className="mt-2 text-xs italic">
            <strong>Observe:</strong> In GPT-4 mode, notice how some tokens have a leading space (visualized often as a distinct block). In your custom BPE, check your Regex rules in the left panel to see if you are capturing spaces!
          </p>
        </section>

        <section>
          <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-emerald-500" />
            3. Unicode & Byte Fallback
          </h4>
          <p>
            How do we handle emojis (😊) or rare scripts? Modern tokenizers (like GPT-4's <code>cl100k_base</code>) often process text as raw <strong>bytes</strong> (UTF-8) rather than characters.
          </p>
          <p className="mt-2">
            This ensures they never encounter an "Unknown Token" (UNK), because they can always fall back to representing a character byte-by-byte.
          </p>
        </section>

      </div>
    </div>
  );
};

export default EducationPanel;
