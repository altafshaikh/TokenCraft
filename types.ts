export interface Token {
  id: number;
  value: string;
  type?: string;
  index: number; // Position in original string
  isSpecial?: boolean;
}

export interface TokenizerConfig {
  name: string;
  regex: string;
  flags: string;
  description?: string;
}

export interface TokenStats {
  totalTokens: number;
  uniqueTokens: number;
  averageLength: number;
  characterCount: number;
}

export interface TokenizerModel {
    vocab: Record<string, number>; // Token string -> ID
    merges: [string, string][];    // Ordered list of merges
    specialTokens: string[];
    regexConfig: TokenizerConfig;
}

export interface TrainingConfig {
    vocabSize: number;
    specialTokens: string[]; // e.g., ["<UNK>", "<PAD>", "<EOS>"]
}
