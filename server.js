import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Check API Key
if (!process.env.API_KEY) {
    console.warn("WARNING: API_KEY is missing in .env file. AI features will fail.");
} else {
    console.log("API_KEY loaded successfully.");
}

// API Endpoint: Proxy for Gemini Generation
app.post('/api/generate', async (req, res) => {
  console.log(`[Local Server] Received API Request: ${req.body.model}`);

  if (!process.env.API_KEY) {
      console.error("[Local Server] Failed: API Key missing");
      return res.status(500).json({ error: 'API Key missing in .env file' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const { model, prompt, config } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Clean config for safety
    if (config?.thinkingConfig?.thinkingBudget === 0) {
        delete config.thinkingConfig;
    }

    // Call Gemini API
    const response = await ai.models.generateContent({
      model: model || 'gemini-3-flash-preview',
      contents: prompt,
      config: config || {}
    });

    console.log("[Local Server] Response generated successfully");
    // Send back the generated text
    res.json({ text: response.text });

  } catch (error) {
    console.error('[Local Server] Gemini API Error:', error);
    res.status(500).json({ error: 'Failed to generate content', details: error.message });
  }
});

// Serve Static Frontend (Production)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if 'dist' exists (built frontend)
app.use(express.static(path.join(__dirname, 'dist')));

// Catch-all handler for SPA (sends index.html for any unknown route)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n--- LOCAL SERVER RUNNING ---`);
  console.log(`Backend: http://localhost:${PORT}`);
  console.log(`To use AI in development, ensure this terminal stays open.`);
  console.log(`----------------------------\n`);
});