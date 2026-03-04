# TokenCraft Lab - Interactive Tokenizer Playground

TokenCraft Lab is an interactive educational tool designed to help users understand how Large Language Models (LLMs) process text through **Tokenization**. It allows you to build, train, and visualize your own Byte Pair Encoding (BPE) tokenizer and compare it against industry standards like GPT-4.

## 🚀 Features

-   **Custom Tokenizer Builder**:
    -   Configure vocabulary size (100 - 2000 tokens).
    -   Define custom Regex splitting rules (e.g., split by whitespace, punctuation).
    -   Train a BPE model in real-time on a custom text corpus.
-   **Interactive Visualization**:
    -   Step-by-step breakdown of the tokenization pipeline (Pre-tokenization -> Merge Rules -> Final Tokens).
    -   "Token Pot" visualization to understand token budget and efficiency.
-   **GPT-4 Comparison**:
    -   Compare your custom tokenizer's output directly with OpenAI's `cl100k_base` (GPT-4) tokenizer.
    -   Analyze efficiency stats (Token Count, Characters per Token).
-   **Educational Insights**:
    -   Learn about the trade-offs between vocabulary size and model complexity.
    -   Understand how spaces, punctuation, and emojis are handled.

## 🛠️ Tech Stack

-   **Framework**: React 18 + Vite
-   **Styling**: Tailwind CSS
-   **Icons**: Lucide React
-   **Animations**: Motion (Framer Motion)
-   **Tokenization Libraries**:
    -   Custom BPE implementation (`src/utils/bpeTokenizer.ts`)
    -   `js-tiktoken` for GPT-4 tokenization

## 📦 Installation & Setup

1.  **Clone the repository** (if applicable) or download the source code.

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:3000` (or the port specified by your environment).

4.  **Build for production**:
    ```bash
    npm run build
    ```

5.  **Lint the code**:
    ```bash
    npm run lint
    ```

## ⚙️ Configuration

The application is designed to run as a client-side Single Page Application (SPA).

-   **Port**: The development server is configured to run on port `3000` by default.
-   **Environment Variables**:
    -   No specific environment variables are required for the core functionality.
    -   If you extend the app to use the Gemini API (via `@google/genai`), ensure you set `GEMINI_API_KEY` in your environment or `.env` file (though the current version focuses on local tokenization logic).

## 🧩 How to Use

1.  **Configure**: Use the Left Panel to set your Vocabulary Size and Regex rules.
2.  **Train**: Paste a training corpus (or use the default) and click "Re-Train Model".
3.  **Test**: Type text into the "Test Input Text" box in the Right Panel.
4.  **Visualize**: Watch the "Process View" to see how your text is split and merged.
5.  **Compare**: Switch to "Compare GPT-4" to see how your model stacks up against a state-of-the-art tokenizer.
