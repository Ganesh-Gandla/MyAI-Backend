import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();
const key = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: key });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello World...");
});

app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: question,
    });

    res.send({
      status: true,
      message: "content found...",
      finalData: response.text,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "Error generating response",
      error: error.message,
    });
  }
});

// ✅ IMPORTANT: Export app (instead of app.listen)
export default app;