import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface Craft {
  title: string;
  materials: string[];
  steps: string[];
  duration: string;
}

export async function generateCraft(topic: string = "general"): Promise<Craft | null> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Genera una manualidad creativa para niños de 0 a 6 años. El tema es: ${topic}. 
      La manualidad debe ser simple, segura y divertida. 
      Responde en español.`,
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
  } catch (error) {
    console.error("Error generating craft:", error);
    return null;
  }
}
