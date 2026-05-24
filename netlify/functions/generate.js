const { GoogleGenAI } = require('@google/genai');

// Whitelist allowed origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'https://aspiring-adda.netlify.app' // Replace with production domain if different
];

exports.handler = async (event, context) => {
    const origin = event.headers.origin;
    const corsHeaders = {
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    };

    if (allowedOrigins.includes(origin)) {
        corsHeaders['Access-Control-Allow-Origin'] = origin;
    }

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: ''
        };
    }

    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return { 
            statusCode: 405, 
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Method Not Allowed' }) 
        };
    }

    try {
        const { model, prompt, config } = JSON.parse(event.body || '{}');

        // Robust Input Validation
        if (!prompt || typeof prompt !== 'string') {
            return { 
                statusCode: 400, 
                headers: corsHeaders,
                body: JSON.stringify({ error: 'Prompt is required and must be a string' }) 
            };
        }

        if (prompt.length > 5000) {
            return { 
                statusCode: 400, 
                headers: corsHeaders,
                body: JSON.stringify({ error: 'Prompt exceeds the limit of 5000 characters' }) 
            };
        }

        // Whitelist allowed models to prevent billing fraud or system abuse
        const allowedModels = ['gemini-3-flash-preview', 'gemini-2.0-flash', 'gemini-1.5-flash'];
        const safeModel = allowedModels.includes(model) ? model : 'gemini-2.0-flash';

        const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
        if (!apiKey) {
            return { 
                statusCode: 500, 
                headers: corsHeaders,
                body: JSON.stringify({ error: 'Server API Key not configured' }) 
            };
        }

        const ai = new GoogleGenAI({ apiKey });

        const response = await ai.models.generateContent({
            model: safeModel,
            contents: prompt,
            config: config || {},
        });

        return {
            statusCode: 200,
            headers: { 
                ...corsHeaders,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ text: response.text }),
        };
    } catch (error) {
        console.error('Gemini API Error:', error);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Failed to generate content' }),
        };
    }
};
