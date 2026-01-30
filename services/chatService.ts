
import { GoogleGenAI } from "@google/genai";

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export const chatWithAI = async (
    messages: ChatMessage[],
    apiKey: string
): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey });

    // Build conversation history
    const conversationHistory = messages.map(msg =>
        `${msg.role === 'user' ? 'Felhasználó' : 'Asszisztens'}: ${msg.content}`
    ).join('\n');

    const prompt = `
    Te egy segítőkész asszisztens vagy, aki segít a felhasználónak megfogalmazni önmagát 2-3 mondatban.
    
    FELADATOD:
    - Kérdezz rá a kommunikációs stílusára (közvetlen, barátságos, professzionális, laza, stb.)
    - Kérdezz rá az értékeire az üzleti kapcsolatokban (őszinteség, bizalom, eredmények, stb.)
    - Kérdezz rá egyedi tulajdonságaira (humor, empátia, gyorsaság, stb.)
    - Tegyél fel 1-2 kérdést egyszerre, ne túl sokat
    - Légy barátságos és támogató
    
    BESZÉLGETÉS EDDIG:
    ${conversationHistory}
    
    Add meg a következő válaszodat röviden és barátságosan.
    Ha már elegendő információd van (3-4 válasz után), akkor generálj egy tömör, 2-3 mondatos önleírást
    és kezdd így: "KÉSZ: [az önleírás szövege]"
  `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: prompt,
        });

        return response.text || "Sajnálom, nem tudtam választ generálni.";
    } catch (error: any) {
        console.error("Chat AI error:", error);
        throw new Error("Hiba történt a beszélgetés során.");
    }
};
