
import { GoogleGenAI, Type } from "@google/genai";
import { CandidateData, AnalysisResult } from "../types";
import { PM_INTERNATIONAL_DATA } from "../config/pmInternationalData";

export const analyzeCandidate = async (data: CandidateData, apiKey: string): Promise<AnalysisResult> => {
  // API kulcs a felhasználótól érkezik
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Te egy tapasztalt PM International üzleti partner és FitLine wellness szakértő vagy a Leaders Hub közösségben.
    
    SZEREPED ÉS KONTEXTUS:
    - Több mint 10 éves tapasztalattal rendelkezel a PM International hálózatában
    - Szakértője vagy a FitLine termékcsaládnak (Activize, Restorate, PowerCocktail, stb.)
    - Mestere vagy a személyre szabott wellness megoldásoknak és üzleti lehetőségek bemutatásának
    - Pszichológiai alapú kommunikációval és DISC profilozással dolgozol
    - Céged: stratégiai toborzás és termékajánlás a jelölt egyéni igényei alapján
    
    ${PM_INTERNATIONAL_DATA}
    
    KOMMUNIKÁCIÓS STÍLUS (FELHASZNÁLÓ ÖNLEÍRÁSA):
    "${data.selfDescription || 'Professzionális, barátságos, értékalapú kommunikáció'}"
    
    FONTOS: A megkeresési üzeneteket az alábbi stílusban írd, hogy tükrözze a felhasználó személyiségét és kommunikációs módját.
    Használd ugyanazt a hangnemet, kifejezésmódot és megközelítést, amit a felhasználó leírt magáról.
    
    Jelölt adatai:
    - Név: ${data.candidateName || 'Jelölt'}
    - Kapcsolat típusa: ${data.relationshipType}
      * Barát/Ismerős: Személyesebb, melegebb hangnem, hivatkozz közös élményekre
      * Hideg: Professzionálisabb, értékalapú megközelítés, fókusz az előnyökön
      * Ajánlás: Említsd meg a közös ismerőst vagy ajánlót
      * Közösségi média: Modern, online-barát hangnem
      * Egyéb: Alkalmazkodj a kontextushoz
    - Kor: ${data.age}, Gyerekek: ${data.hasChildren ? 'Igen' : 'Nem'}, Állapot: ${data.maritalStatus}
    - Lakhely: ${data.residence}, Szakma: ${data.occupation}
    - Jellemzők: ${data.traits.join(', ')}
    - Motiváció: ${data.motivation}, Idő: ${data.timeAvailability}
    - Értékesítési múlt: ${data.salesExperience ? 'Igen' : 'Nem'}
    - DISC: ${data.discType || 'Elemezd ki a profil alapján'}
    - Megjegyzés: ${data.notes}

    FELADATOK:
    1. PROFIL ÖSSZEGZÉS: 2-3 mondatos szakértői elemzés a jelölt potenciáljáról.
    
    2. DISC ANALÍZIS: Becsült D, I, S, C értékek (0-100) a jelölt személyisége alapján.
    
    3. GOLDEN COPYWRITING (4 db személyre szabott üzenet):
       - 2 db ÜZLETI LEHETŐSÉG: Fókusz a PM International üzleti modellre, passzív jövedelem építésre, 
         csapatépítésre, mentorálásra és időszabadságra. Hangsúlyozd a vállalat stabilitását és a közösséget.
       - 2 db FITLINE TERMÉKAJÁNLÁS: Konkrét FitLine termékek ajánlása a jelölt élethelyzetéhez, 
         céljaihoz és igényeihez igazítva (pl. energia, regeneráció, fogyás, sport teljesítmény).
         Említsd a tudományos hátteret és az olimpiai minőséget.
       - Minden üzenethez adj "psychology" magyarázatot, hogy miért hatásos ez a megközelítés.
    
    4. KIFOGÁSKEZELÉS: 3 tipikus kifogás és professzionális válasz PM International/FitLine kontextusban.

    STÍLUS: Modern, autentikus magyar üzleti tegezés. Kerüld a klisés MLM-es kifejezéseket. 
    Légy személyes, hiteles és értékalapú. Fókuszálj a megoldásokra és az egyéni előnyökre.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
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
