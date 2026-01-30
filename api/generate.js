import { GoogleGenAI } from '@google/genai';

// --- Shared AI Logic ---
const generateContent = async (apiKey, body) => {
    const { model, prompt, config } = body;
    const ai = new GoogleGenAI({ apiKey });

    // Add default safety to prevent empty responses
    const aiModel = model || 'gemini-3-flash-preview';

    console.log(`[AI] Generating for model: ${aiModel}`);

    // If thinkingConfig is present with 0, delete it to prevent stalls
    if (config?.thinkingConfig?.thinkingBudget === 0) {
        delete config.thinkingConfig;
    }

    try {
        const response = await ai.models.generateContent({
            model: aiModel,
            contents: prompt,
            config: config || {}
        });

        // Some models might block content, resulting in empty text
        if (!response.text) {
             console.warn("[AI] Response text is empty. Checking candidates...");
             // Check if it was blocked
             if (response.candidates && response.candidates.length > 0) {
                 const finishReason = response.candidates[0].finishReason;
                 if (finishReason !== 'STOP') {
                     throw new Error(`AI stopped generation: ${finishReason}`);
                 }
             }
             return "{}"; // Return empty JSON object fallback
        }

        return response.text;
    } catch (err) {
        console.error("[AI] Generate Error:", err);
        throw err;
    }
};

// --- Vercel Handler (Default Export) ---
export default async function vercelHandler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        if (!process.env.API_KEY) {
            console.error("[Config] API_KEY missing");
            return res.status(500).json({ error: 'Server Config Error: API Key missing' });
        }

        const text = await generateContent(process.env.API_KEY, req.body);
        return res.status(200).json({ text });

    } catch (error) {
        console.error('Vercel API Error:', error);
        return res.status(500).json({ error: error.message || 'AI Generation Failed' });
    }
}

// --- Netlify Handler (Named Export) ---
export const handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    try {
        if (!process.env.API_KEY) {
            console.error("[Config] API_KEY missing");
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Server Config Error: API Key missing' })
            };
        }

        const body = JSON.parse(event.body || '{}');
        const text = await generateContent(process.env.API_KEY, body);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ text })
        };

    } catch (error) {
        console.error('Netlify API Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message || 'AI Generation Failed' })
        };
    }
};