import { GoogleGenAI, Type } from "@google/genai";
import { TokenizerConfig } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateTokenizerWithGemini = async (
  prompt: string
): Promise<TokenizerConfig | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Create a JavaScript Regular Expression (Regex) that functions as a tokenizer based on this user description: "${prompt}".
      
      The regex should match the *tokens* themselves, not the delimiters. 
      For example, if the user wants to split by space, the regex should match non-space characters (\\S+).
      If the user wants to keep emails together, the regex should explicitly match email patterns OR other words.

      Return the result as a JSON object.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            regex: {
              type: Type.STRING,
              description: "The JavaScript regex pattern string (without slashes). Escape backslashes correctly.",
            },
            flags: {
              type: Type.STRING,
              description: "Regex flags (e.g., 'g', 'gi'). Usually 'g' is required.",
            },
            description: {
              type: Type.STRING,
              description: "A short explanation of how this regex works.",
            },
            name: {
              type: Type.STRING,
              description: "A short, creative name for this tokenizer strategy.",
            },
          },
          required: ["regex", "flags", "description", "name"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as TokenizerConfig;
    }
    return null;
  } catch (error) {
    console.error("Error generating tokenizer:", error);
    throw error;
  }
};

export const explainTokenizer = async (regex: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Explain what this Regular Expression does in the context of text tokenization in one simple sentence: /${regex}/`,
        });
        return response.text || "No explanation available.";
    } catch (e) {
        return "Could not generate explanation.";
    }
}
