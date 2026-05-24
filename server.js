import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

dotenv.config();
// Load .env.local fallback for local development
dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Content Security Policy & Security Headers via Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'", 
        "'unsafe-inline'", 
        "https://cdn.tailwindcss.com", 
        "https://esm.sh"
      ],
      styleSrc: [
        "'self'", 
        "'unsafe-inline'", 
        "https://fonts.googleapis.com"
      ],
      fontSrc: [
        "'self'", 
        "https://fonts.gstatic.com"
      ],
      connectSrc: [
        "'self'", 
        "https://joqhxwdzuivxyvmlxzbc.supabase.co", 
        "wss://joqhxwdzuivxyvmlxzbc.supabase.co",
        "https://generativelanguage.googleapis.com"
      ],
      imgSrc: [
        "'self'", 
        "data:", 
        "https://logo.clearbit.com"
      ],
      frameAncestors: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// 2. Strict CORS Configuration (Whitelist Allowed Origins)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Blocked by CORS policy'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// 3. Body Size Limit (Prevent denial-of-service via huge payloads)
app.use(express.json({ limit: '10kb' }));

// 4. Rate Limiting for the AI Generation endpoint
const apiRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // Limit each IP to 20 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { error: 'Too many requests from this IP, please try again after a minute' }
});

// Initialize Google GenAI (Server Side Only)
// Only standard API_KEY or GEMINI_API_KEY is used. VITE_ prefix is client-facing, so we exclude it.
const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn('WARN: GEMINI_API_KEY is missing. AI Generation requests will fail.');
}
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// API Endpoint: Proxy for Gemini Generation
app.post('/api/generate', apiRateLimiter, async (req, res) => {
  try {
    const { model, prompt, config } = req.body;

    // 5. Robust Input Validation
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required and must be a string' });
    }

    if (prompt.length > 5000) {
      return res.status(400).json({ error: 'Prompt exceeds the limit of 5000 characters' });
    }

    if (!ai) {
      return res.status(500).json({ error: 'AI Generator is currently misconfigured' });
    }

    // Whitelist allowed models to prevent injection of unsupported/costly models
    const allowedModels = ['gemini-3-flash-preview', 'gemini-2.0-flash', 'gemini-1.5-flash'];
    const safeModel = allowedModels.includes(model) ? model : 'gemini-3-flash-preview';

    // Call Gemini API
    const response = await ai.models.generateContent({
      model: safeModel,
      contents: prompt,
      config: config || {}
    });

    // Send back the generated text
    res.json({ text: response.text });

  } catch (error) {
    console.error('Gemini API Error:', error);
    // 6. Error Sanitization: Do not leak internal stack traces or exact API details
    res.status(500).json({ error: 'An error occurred while generating content' });
  }
});

// Serve Static Frontend (Production)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if 'dist' exists (built frontend) and serve statically with safe cache headers
app.use(express.static(path.join(__dirname, 'dist'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }
}));

// Catch-all handler for SPA (sends index.html for any unknown route)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});