import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";

dotenv.config();

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1", // ✅ REQUIRED
});

// const key = process.env.GEMINI_API_KEY;

// const ai = new GoogleGenAI({ apiKey: key });

const app = express();

// Middleware
app.use(cors({
    origin: "https://my-ai-frontend-beta.vercel.app"
}));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
    res.send("Hello World...");
});

app.post("/ask", async (req, res) => {
    try {
        const { question } = req.body;

        if (!question || !question.trim()) {
            return res.status(400).send({
                status: false,
                message: "Question is required",
            });
        }

        const response = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile", // ✅ UPDATED MODEL
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: question },
            ],
        });

        const answer =
            response?.choices?.[0]?.message?.content || "No response generated.";

        res.send({
            status: true,
            finalData: answer,
        });

    } catch (error) {
        console.error("FULL ERROR:", error);

        res.status(500).send({
            status: false,
            message: error.message,
            error: error.response?.data || "No response data"
        });
    }
});

// app.post("/ask", async (req, res) => {
//   try {
//     const { question } = req.body;

//     const response = await ai.models.generateContent({
//       model: "gemini-3-flash-preview",
//       contents: question,
//     });

//     res.send({
//       status: true,
//       message: "content found...",
//       finalData: response.text,
//     });
//   } catch (error) {
//     res.status(500).send({
//       status: false,
//       message: "Error generating response",
//       error: error.message,
//     });
//   }
// });

// ✅ IMPORTANT: Export app (instead of app.listen)
export default app;