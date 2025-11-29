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
You are Tathya — a short, factual chatbot. 
Keep answers simple, accurate, polite.
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
