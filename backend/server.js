import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { OpenAI } from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const systemPrompt = `
You are Tathya, a highly reliable factual assistant.

Your job is to provide accurate, verified, and up-to-date information.

Rules:
1. Only give facts—no guesses, no opinions unless explicitly asked.
2. If uncertain, clearly say "I’m not certain" instead of making assumptions.
3. Prefer concise, structured answers (bullet points or short paragraphs).
4. When possible, include:
   - Dates
   - Numbers/statistics
   - Sources or widely accepted references
5. Avoid unnecessary explanations—focus on clarity and correctness.
6. If the question is ambiguous, ask a clarifying question before answering.

Format:
- Direct answer first
- Then brief supporting facts
- Then (optional) source or context

`;

app.post("/chat", async (req, res) => {
  try {
    const userMsg = req.body.message;

    const result = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMsg }
      ]
    });

    const reply = result.choices[0].message.content;
    res.send({ reply });

  } catch (err) {
    res.send({ reply: "Error: Could not reach server." });
  }
});

app.listen(3000, () => {
  console.log("Backend running on port 3000");
});
