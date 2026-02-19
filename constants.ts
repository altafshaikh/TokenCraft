import { TokenizerConfig } from './types';

export const PRESET_TOKENIZERS: TokenizerConfig[] = [
  {
    name: 'Whitespace',
    regex: '\\S+',
    flags: 'g',
    description: 'Splits text by whitespace characters. Matches any non-whitespace sequence.',
  },
  {
    name: 'Word & Punctuation',
    regex: '\\w+|[^\\w\\s]+',
    flags: 'g',
    description: 'Matches words (alphanumeric) and sequences of punctuation separately.',
  },
  {
    name: 'Simple Word',
    regex: '[a-zA-Z]+',
    flags: 'g',
    description: 'Extracts only alphabetic words, ignoring numbers and punctuation.',
  },
  {
    name: 'Twitter / Social',
    regex: '[#@]?[\\w]+|[^\\w\\s]+',
    flags: 'g',
    description: 'Keeps hashtags (#tag) and mentions (@user) together as single tokens.',
  },
  {
    name: 'Code (Simple)',
    regex: '\\w+|==|!=|<=|>=|&&|\\|\\||\\p{P}',
    flags: 'gu',
    description: 'Attempts to keep code operators together while splitting keywords.',
  },
];

export const DEFAULT_TEXT = `Hello, Tokenizer!
This is a sample text to test your "custom" build.
Try adding an email like test@example.com or a #hashtag to see how it splits.`;
