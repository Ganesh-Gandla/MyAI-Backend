import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();
const key = process.env.GEMINI_API_KEY

const ai = new GoogleGenAI(key);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
    res.send("Hello World...");
});

app.post("/ask", async (req, res) => {

    let {question} = req.body

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: question,
    });
    console.log(response.text);

    res.send({
        _status: true,
        _message: "content found...",
        finalData: response.text
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
