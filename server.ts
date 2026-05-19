import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON and large payloads (for images)
  app.use(express.json({ limit: '10mb' }));

  // Gemini Initialization
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API Routes
  app.post("/api/analyze", async (req, res) => {
    try {
      const { images, text } = req.body;

      if (!images || images.length === 0) {
        return res.status(400).json({ error: "No images provided for analysis." });
      }

      const prompt = `
        ACT AS: SIGNAL STRATEGIC INTELLIGENCE ANALYST.
        OBJECTIVE: HIGH-CONFIDENCE HEURISTIC SCAN.
        GOAL: DETECT SYNTHETIC ENTITIES OR SCAMMER PATTERNS.
        
        CRITERIA:
        1. LINGUISTIC ENTROPY: Robotic cadence or sales-funnel scripts.
        2. KNOWLEDGE GAPS: Localization failures.
        3. PHOTO FORENSICS: Stock aesthetics, GAN markers, or photo-mismatch.
        4. BEHAVIORAL RED-FLAGS: Immediate external app pivot, bio keywords.
        5. VERIFICATION FAILURES: Refusal of specific selfie-protocol.

        RETURN SCHEMA:
        - score: 0-100 (HIGH = RISK)
        - classification: "REAL", "SUSPICIOUS", "BOT"
        - reasoning: Professional intel report.
        - markers: Tactical red-flags.
      `;

      const parts = images.map((base64Data: string) => ({
        inlineData: {
          mimeType: "image/jpeg", // Assuming JPEG for now, adjust if needed
          data: base64Data.split(",")[1] || base64Data,
        },
      }));

      if (text) {
        parts.push({ text: `Additional context or chat transcript: ${text}` });
      }
      
      parts.push({ text: prompt });

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ parts }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              classification: { type: Type.STRING },
              reasoning: { type: Type.STRING },
              markers: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["score", "classification", "reasoning", "markers"]
          }
        }
      });

      const analysis = JSON.parse(response.text || "{}");
      res.json(analysis);

    } catch (error: any) {
      console.error("Analysis error:", error);
      res.status(500).json({ error: error.message || "Failed to analyze profile." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
