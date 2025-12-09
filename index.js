import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'; // <--- import cors
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = 4000;

const ai = new GoogleGenAI({}); // Uses GEMINI_API_KEY from .env

// -----------------------------
// Enable CORS
// -----------------------------
app.use(cors({
  origin: 'http://localhost:3000', // allow requests from React dev server
}));

app.use(bodyParser.json());

// POST /ask
app.post('/ask', async (req, res) => {
  const { question, documentText } = req.body;

  if (!question || !documentText) {
    return res.status(400).json({ error: 'question and documentText are required' });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Document: ${documentText}\n\nQuestion: ${question}\nAnswer in a few words:`,
    });

    res.json({ answer: response.text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get answer from AI' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
