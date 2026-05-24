import { GoogleGenAI } from '@google/genai';

// Whitelist allowed origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'https://aspiring-adda.netlify.app' // Replace with production domain if different
];

export default async function handler(req, res) {
  // CORS configuration
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
     return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { model, prompt, config } = req.body;
    
    // Robust Input Validation
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required and must be a string' });
    }

    if (prompt.length > 5000) {
      return res.status(400).json({ error: 'Prompt exceeds length limit of 5000 characters' });
    }

    // Whitelist allowed models to prevent billing fraud or system abuse
    const allowedModels = ['gemini-3-flash-preview', 'gemini-2.0-flash', 'gemini-1.5-flash'];
    const safeModel = allowedModels.includes(model) ? model : 'gemini-3-flash-preview';

    // Load API Key from environment
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'Server API Key is not configured' });
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Call Gemini
    const response = await ai.models.generateContent({
      model: safeModel,
      contents: prompt,
      config: config || {}
    });

    // Return the text
    return res.status(200).json({ text: response.text });

  } catch (error) {
    console.error('Gemini API Error:', error);
    // Secure error handling: do not leak inner errors
    return res.status(500).json({ error: 'Failed to generate content' });
  }
}
