import { getAIAnswer } from "../services/aiService.js";

export async function askQuestion(req, res, next) {
  const { question, documentText } = req.body;

  if (!question || !documentText) {
    return res.status(400).json({ error: "question and documentText are required" });
  }

  try {
    const answer = await getAIAnswer(question, documentText);
    res.json({ answer });
  } catch (error) {
    console.error(error);
    next(error);
  }
}
