import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = process.env.PORT || 4000;

const ai = new GoogleGenAI({});

const allowedOrigins = [
  "http://localhost:3000",
  "https://document-qa-app-eta.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));

app.post("/ask", async (req, res) => {
  const { question, documentText } = req.body;

  if (!question || !documentText) {
    return res
      .status(400)
      .json({ error: "question and documentText are required" });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Document: ${documentText}\n\nQuestion: ${question}\nAnswer in a few words:`,
    });

    res.json({ answer: response.text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get answer from AI" });
  }
});

app.use((err, req, res, next) => {
  if (err.status === 413) {
    return res
      .status(413)
      .json({ error: "Payload too large." });
  }
  next(err);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
