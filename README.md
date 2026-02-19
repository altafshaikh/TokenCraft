# TokenCraft - Interactive Tokenizer Builder

TokenCraft is an educational and interactive web application designed to help users understand, build, and visualize text tokenizers for Large Language Models (LLMs).

It allows users to train their own Byte Pair Encoding (BPE) models, customize pre-tokenization rules using Regex, and compare their results directly against industry-standard tokenizers like OpenAI's GPT-4.

## Features

### 🛠 Custom Tokenizer Builder
- **Train Custom BPE Models:** Input your own training corpus and define a target vocabulary size. The app runs the Byte Pair Encoding algorithm in the browser to generate a custom vocabulary.
- **Regex Pre-Tokenization:** Configure how text is initially split before the BPE merge process (e.g., split by whitespace, keep punctuation, or handle specific patterns like emails).
- **AI-Powered Configuration:** Integrated with **Google Gemini**, allowing you to describe your desired tokenization strategy in plain English (e.g., "Keep hashtags and mentions together") and automatically generate the complex Regex for it.

### 👁 Visual Pipeline & Debugging
- **Step-by-Step Visualization:** Watch the tokenization process unfold in real-time. See how raw text is split by regex, then mapped to integer IDs based on your learned vocabulary.
- **Detailed Token Inspection:** Hover over tokens to see their IDs, character lengths, and types.
- **Animated Playback:** Controls to play, pause, and replay the tokenization logic step-by-step for educational demos.

### ⚖️ Live Comparison
- **GPT-4 Benchmarking:** Instantly compare your custom tokenizer's output against the standard `cl100k_base` tokenizer used by GPT-4.
- **Efficiency Stats:** View metrics like Total Token Count and Characters per Token to measure compression efficiency.

## Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS
- **AI Integration:** Google GenAI SDK (Gemini 1.5/2.5 models)
- **Icons:** Lucide React
- **Standard Tokenizer Library:** `js-tiktoken` (for GPT-4 comparison)

## How It Works

1.  **Configuration:**
    - Select a preset strategy (e.g., "Word & Punctuation") or use the AI Builder to generate a custom Regex.
    - Set the desired Vocabulary Size (e.g., 300 tokens).

2.  **Training:**
    - When you click "Re-Train Model", the app takes the text in the "Training Corpus" box.
    - It pre-tokenizes the corpus using your Regex.
    - It iteratively merges the most frequent adjacent character pairs until the vocabulary size limit is reached (BPE Algorithm).

3.  **Testing:**
    - Type into the "Test Input Text" area.
    - The "Process View" shows how your model breaks down the sentence.
    - The "Compare GPT-4" view shows how OpenAI handles the exact same text.

## Running the Project

This project relies on standard ES Modules and can be run directly in modern environments or bundled via tools like Vite.

1.  **Environment Variables:**
    - The app requires a Google Gemini API Key for the AI Builder features.
    - This is expected to be available in `process.env.API_KEY`.

2.  **Dependencies:**
    - All dependencies are loaded via `esm.sh` in the `importmap` within `index.html`. No `npm install` is strictly required for the runtime if served statically, though a build step is recommended for production.
