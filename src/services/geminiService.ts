import { GoogleGenAI, Type } from "@google/genai";

/**
 * Access the API key. 
 * We use a safe access pattern to avoid crashes if it's missing during initialization.
 */
const getApiKey = () => {
  // Try both standard and Vite-specific patterns
  return import.meta.env.VITE_GEMINI_API_KEY || (process.env as any).GEMINI_API_KEY || "";
};

export interface Craft {
  title: string;
  materials: string[];
  steps: string[];
  duration: string;
}

/**
 * Validates if the API key is present
 */
export function isApiKeyConfigured(): boolean {
  const key = getApiKey();
  return !!key && key !== 'undefined' && key !== '';
}

/**
 * Lazy initialization to prevent app crash if key is missing
 */
function getAIClient() {
  const key = getApiKey();
  if (!key || key === 'undefined') {
    throw new Error("MISSING_API_KEY");
  }
  return new GoogleGenAI({ apiKey: key });
}

export async function generateCraft(topic: string = "general"): Promise<Craft | null> {
  try {
    const ai = getAIClient();
    
    // Using the NEW @google/genai pattern: ai.models.generateContent
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Genera una manualidad creativa para niños de 0 a 6 años. El tema es: ${topic}. 
      La manualidad debe ser simple, segura y divertida. 
      Responde estrictamente en formato JSON en español.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Título de la manualidad" },
            materials: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Lista de materiales necesarios" 
            },
            steps: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Pasos claros y breves para realizarla" 
            },
            duration: { type: Type.STRING, description: "Duración estimada (ej: 10 min)" }
          },
          required: ["title", "materials", "steps", "duration"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as Craft;
  } catch (error: any) {
    console.error("Error generating craft:", error);
    if (error.message === "MISSING_API_KEY") {
      throw error;
    }
    return null;
  }
}
