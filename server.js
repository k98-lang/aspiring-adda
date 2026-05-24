import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();
// Load .env.local fallback for local development
dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Google GenAI (Server Side Only)
// Try standard API_KEY first, fallback to GEMINI_API_KEY
const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || 'PLACEHOLDER_API_KEY';
const ai = new GoogleGenAI({ apiKey });

// API Endpoint: Proxy for Gemini Generation
app.post('/api/generate', async (req, res) => {
  try {
    const { model, prompt, config } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Call Gemini API
    const response = await ai.models.generateContent({
      model: model || 'gemini-3-flash-preview',
      contents: prompt,
      config: config || {}
    });

    // Send back the generated text
    res.json({ text: response.text });

  } catch (error) {
    console.error('Gemini API Error:', error);
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
  console.log(`Server running on http://localhost:${PORT}`);
});