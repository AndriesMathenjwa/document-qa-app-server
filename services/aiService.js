import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export async function getAIAnswer(question, documentText) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Document: ${documentText}\n\nQuestion: ${question}\nAnswer in a few words:`,
  });

  return response.text;
}
