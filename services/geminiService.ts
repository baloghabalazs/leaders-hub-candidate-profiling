
import { GoogleGenAI, Type } from "@google/genai";
import { CandidateData, AnalysisResult } from "../types";

export const analyzeCandidate = async (data: CandidateData): Promise<AnalysisResult> => {
  // Mindig új példányt hozunk létre a legfrissebb API kulcs biztosításához
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Te egy világszínvonalú network marketing stratéga és hipnotikus copywriting szakértő vagy a Leaders Hub közösségben.
    A feladatod, hogy elemezz egy jelöltet és készíts professzionális megközelítési stratégiát.
    
    Jelölt adatai:
    - Kor: ${data.age}, Gyerekek: ${data.hasChildren ? 'Igen' : 'Nem'}, Állapot: ${data.maritalStatus}
    - Lakhely: ${data.residence}, Szakma: ${data.occupation}
    - Jellemzők: ${data.traits.join(', ')}
    - Motiváció: ${data.motivation}, Idő: ${data.timeAvailability}
    - Értékesítési múlt: ${data.salesExperience ? 'Igen' : 'Nem'}
    - DISC: ${data.discType || 'Elemezd ki a profil alapján'}
    - Megjegyzés: ${data.notes}

    FELADATOK:
    1. PROFIL ÖSSZEGZÉS: 2-3 mondatos szakértői elemzés.
    2. DISC: Becsült D, I, S, C értékek (0-100).
    3. GOLDEN COPYWRITING (4 db): 
       - 2 db LEHETŐSÉG/ÜZLET: Fókusz a szabadságon, közösségen és mentoráláson.
       - 2 db MEGOLDÁS/TERMÉK: Fókusz a konkrét előnyökön.
       - Minden üzenethez írj egy "psychology" magyarázatot.
    4. KIFOGÁSKEZELÉS: 3 tipikus kifogás és válasz.

    FONTOS: Használj modern magyar üzleti tegezést. Kerüld az MLM-es kliséket.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            profileSummary: { type: Type.STRING },
            motivations: { type: Type.ARRAY, items: { type: Type.STRING } },
            approachTips: { type: Type.ARRAY, items: { type: Type.STRING } },
            discAnalysis: {
              type: Type.OBJECT,
              properties: {
                d: { type: Type.NUMBER },
                i: { type: Type.NUMBER },
                s: { type: Type.NUMBER },
                c: { type: Type.NUMBER }
              },
              required: ["d", "i", "s", "c"]
            },
            openingMessages: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  title: { type: Type.STRING },
                  text: { type: Type.STRING },
                  psychology: { type: Type.STRING }
                },
                required: ["type", "title", "text", "psychology"]
              }
            },
            objections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  objection: { type: Type.STRING },
                  rebuttal: { type: Type.STRING }
                },
                required: ["objection", "rebuttal"]
              }
            }
          },
          required: ["profileSummary", "motivations", "approachTips", "openingMessages", "objections", "discAnalysis"]
        }
      }
    });

    const jsonStr = response.text || "{}";
    return JSON.parse(jsonStr.trim());
  } catch (error: any) {
    console.error("AI Analysis failed:", error);
    // Ha a hiba entitás hiányra utal, az API kulcs választó újraindítása javasolt az App.tsx-ben
    throw error;
  }
};
