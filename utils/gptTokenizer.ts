import { Token } from "../types";

// Dynamic import type wrapper would be ideal but for simplicity we use any for the module
let tiktokenModule: any = null;
let enc: any = null;

export const getGPTTokens = async (text: string): Promise<Token[]> => {
  try {
    // Dynamically import js-tiktoken to avoid top-level load errors
    if (!tiktokenModule) {
        try {
            // @ts-ignore - dynamic import from importmap
            tiktokenModule = await import("js-tiktoken");
        } catch (e) {
            console.error("Failed to load js-tiktoken module", e);
            return [];
        }
    }

    if (!enc && tiktokenModule) {
        try {
            enc = tiktokenModule.encodingForModel("gpt-4"); 
        } catch (e) {
            console.warn("Could not load gpt-4 model, trying cl100k_base directly", e);
            try {
                enc = tiktokenModule.getEncoding("cl100k_base");
            } catch (e2) {
                console.error("Failed to load GPT tokenizer completely", e2);
                return [];
            }
        }
    }

    if (!enc) return [];

    const encoded = enc.encode(text);
    const tokens: Token[] = [];
    
    let currentIndex = 0;
    
    // We decode one by one for visualization purposes.
    for (const id of encoded) {
      const decoded = enc.decode([id]);
      let fragment = "";

      if (typeof decoded === "string") {
          fragment = decoded;
      } else {
          // Ensure it is a Uint8Array before passing to TextDecoder
          // js-tiktoken might return a plain array in some environments/bundles
          const uint8 = decoded instanceof Uint8Array ? decoded : new Uint8Array(decoded);
          fragment = new TextDecoder().decode(uint8);
      }
      
      tokens.push({
        id: id,
        value: fragment,
        index: currentIndex, 
        type: "GPT-4"
      });
      currentIndex += fragment.length;
    }

    return tokens;
  } catch (error) {
    console.error("Error in getGPTTokens:", error);
    return [];
  }
};
