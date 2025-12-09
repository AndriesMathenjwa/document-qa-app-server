import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export async function getAIAnswer(question, documentText) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Document: ${documentText}\n\nQuestion: ${question}\nAnswer in a few words:`,
    });

    return response.text;
  } catch (err) {
    console.error("Gemini API error:", err);

    if (err?.status === 429 || err?.message?.includes("quota")) {
      return `Mock answer: "${question}" (Gemini free quota exceeded, try again tomorrow)`;
    }

    return `Error generating answer: ${err.message || err}`;
  }
}
