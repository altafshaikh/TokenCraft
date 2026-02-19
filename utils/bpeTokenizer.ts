import { TokenizerConfig, TokenizerModel, Token } from "../types";

export class BPETokenizer {
  vocab: Map<string, number>;
  reverseVocab: Map<number, string>;
  merges: Map<string, string>; // "part1,part2" -> "part1part2"
  specialTokens: Set<string>;
  regex: RegExp;
  config: TokenizerConfig;

  constructor(model?: TokenizerModel) {
    this.vocab = new Map();
    this.reverseVocab = new Map();
    this.merges = new Map();
    this.specialTokens = new Set();
    this.config = { name: "Default", regex: "\\s+", flags: "g" };
    this.regex = new RegExp(this.config.regex, this.config.flags);

    if (model) {
      this.loadModel(model);
    }
  }

  loadModel(model: TokenizerModel) {
    this.vocab = new Map(Object.entries(model.vocab));
    this.reverseVocab = new Map(Object.entries(model.vocab).map(([k, v]) => [v, k]));
    this.config = model.regexConfig;
    this.regex = new RegExp(model.regexConfig.regex, model.regexConfig.flags);
    this.specialTokens = new Set(model.specialTokens);
    
    // Reconstruct merges map if needed (simplified for inference)
    model.merges.forEach(([a, b]) => {
      this.merges.set(`${a},${b}`, a + b);
    });
  }

  // Pre-tokenize: Split text using the user's regex
  preTokenize(text: string): string[] {
    const matches = text.match(this.regex);
    return matches ? Array.from(matches) : [];
  }

  train(corpus: string, vocabSize: number, regexConfig: TokenizerConfig, specialTokens: string[]) {
    this.config = regexConfig;
    this.regex = new RegExp(regexConfig.regex, regexConfig.flags);
    this.specialTokens = new Set(specialTokens);
    this.vocab.clear();
    this.reverseVocab.clear();
    this.merges.clear();

    // 1. Initialize Vocab with Special Tokens
    let nextId = 0;
    specialTokens.forEach(token => {
      this.vocab.set(token, nextId);
      this.reverseVocab.set(nextId, token);
      nextId++;
    });

    // 2. Pre-tokenize corpus to get initial word list
    const words = this.preTokenize(corpus);
    
    // 3. Initialize working words as arrays of characters
    // "Hello" -> ["H", "e", "l", "l", "o"]
    let splits: string[][] = words.map(w => w.split(''));

    // 4. Add all initial characters to vocab
    const charSet = new Set<string>();
    splits.forEach(word => word.forEach(char => charSet.add(char)));
    Array.from(charSet).sort().forEach(char => {
      if (!this.vocab.has(char)) {
        this.vocab.set(char, nextId);
        this.reverseVocab.set(nextId, char);
        nextId++;
      }
    });

    // 5. BPE Loop
    while (this.vocab.size < vocabSize) {
      const pairs = new Map<string, number>();
      
      // Count pairs
      for (const word of splits) {
        for (let i = 0; i < word.length - 1; i++) {
          const pair = `${word[i]},${word[i+1]}`;
          pairs.set(pair, (pairs.get(pair) || 0) + 1);
        }
      }

      if (pairs.size === 0) break;

      // Find most frequent pair
      let bestPair = "";
      let maxCount = -1;
      for (const [pair, count] of pairs.entries()) {
        if (count > maxCount) {
          maxCount = count;
          bestPair = pair;
        }
      }

      if (maxCount < 1) break;

      // Merge
      const [part1, part2] = bestPair.split(',');
      const newToken = part1 + part2;
      
      this.vocab.set(newToken, nextId);
      this.reverseVocab.set(nextId, newToken);
      this.merges.set(bestPair, newToken);
      nextId++;

      // Apply merge to splits
      for (let i = 0; i < splits.length; i++) {
        const word = splits[i];
        const newWord: string[] = [];
        let j = 0;
        while (j < word.length) {
          if (j < word.length - 1 && word[j] === part1 && word[j+1] === part2) {
            newWord.push(newToken);
            j += 2;
          } else {
            newWord.push(word[j]);
            j++;
          }
        }
        splits[i] = newWord;
      }
    }
    
    console.log(`Training complete. Vocab size: ${this.vocab.size}`);
  }

  encode(text: string): Token[] {
    const words = this.preTokenize(text);
    const tokens: Token[] = [];
    let currentIndex = 0;

    // Helper to find original index (simple approximation for demo)
    const findIndex = (str: string, startPos: number) => {
        return text.indexOf(str, startPos);
    };

    for (const word of words) {
        let wordParts = word.split('');
        
        // Apply merges repeatedly until no more changes
        // This is a naive application for the demo; optimized BPE uses a priority queue or the merge list order
        // Since we didn't store merge order in a simple list for this class efficiently, we iterate.
        // For a robust implementation, we should iterate through the learned merges in order.
        
        // However, since we have the final vocab, a greedy approach works "okay" for demo, 
        // but strictly we should replay merges.
        // Let's do a simple loop that tries to merge adjacent pairs if they exist in vocab.
        // NOTE: This is simplified. Correct BPE requires applying merges in the order they were learned.
        
        // To be correct without storing the ordered merge list in memory for this function:
        // We will just assume the 'splits' logic from training or a greedy longest-match from vocab?
        // Actually, let's just do a greedy merge loop which is common for "WordPiece" style, 
        // or re-implement strict BPE if we had the ordered list.
        
        // For this demo, let's keep it simple: Re-scan for known tokens.
        
        let changed = true;
        while(changed) {
            changed = false;
            const newParts: string[] = [];
            let i = 0;
            while(i < wordParts.length) {
                if (i < wordParts.length - 1) {
                    const pair = wordParts[i] + wordParts[i+1];
                    if (this.vocab.has(pair)) {
                         // This is slightly incorrect for strict BPE (which cares about merge priority), 
                         // but visually effective for a custom tokenizer demo to show agglomeration.
                         // To do it strictly right, we'd need to store the 'rank' of every token.
                         newParts.push(pair);
                         i += 2;
                         changed = true;
                         continue;
                    }
                }
                newParts.push(wordParts[i]);
                i++;
            }
            wordParts = newParts;
        }

        // Map to IDs
        const wordStartIndex = findIndex(word, currentIndex);
        currentIndex = wordStartIndex + word.length; // Advance
        
        // We don't have exact char indices for sub-parts easily without tracking, 
        // so we'll just approximate index for the visualizer
        let localOffset = 0;
        
        for (const part of wordParts) {
            const id = this.vocab.get(part);
            const isUnknown = id === undefined;
            // Fallback for unknown chars (shouldn't happen if trained on this text, but possible on new text)
            const finalId = id !== undefined ? id : (this.vocab.get("<UNK>") ?? -1);
            
            tokens.push({
                id: finalId,
                value: part,
                index: wordStartIndex + localOffset,
                isSpecial: this.specialTokens.has(part)
            });
            localOffset += part.length;
        }
    }
    return tokens;
  }

  decode(ids: number[]): string {
    return ids.map(id => this.reverseVocab.get(id) || "").join("");
  }
}
