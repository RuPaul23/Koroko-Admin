// ==============================================================================
// KOROKO-ADMIN — Gemini AI API Integration Endpoint
// 1. Auto name generation based on uploaded design image / themes
// 2. Apparel model image generation using Imagen / Gemini
// ==============================================================================

import path from 'node:path';
import fs from 'node:fs';

function loadEnvFile() {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const separator = trimmed.indexOf('=');
        if (separator <= 0) continue;
        const key = trimmed.slice(0, separator).trim();
        const value = trimmed.slice(separator + 1).trim();
        if (!process.env[key]) process.env[key] = value;
      }
    }
  } catch (e) {}
}

loadEnvFile();

export default async function handler(req, res) {
  // CORS
  const origin = req.headers.origin || '';
  res.setHeader('Access-Control-Allow-Origin', origin || '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const geminiApiKey = process.env.GEMINI_API_KEY || '';
  const { action, imageData, category, prompt } = req.body || {};

  try {
    // 1. Generate Product Title and Description from Design Image
    if (action === 'generate-name') {
      const promptText = `You are the lead creative director for "KOROKO", a high-end Tokyo minimalist and cyberpunk streetwear brand (https://koroko.in).
Category: ${category || 'oversized'}.
Look at this uploaded garment graphic/concept or user description: "${prompt || 'streetwear graphic artwork'}".
Generate:
1. A punchy, authentic streetwear product title (Maximum 4-6 words, uppercase or title case, e.g. "SHIBUYA NOIR OVERSIZED TEE", "NEO-TOKYO ACID WASH DROP HOODIE").
2. A 2-sentence luxury Japanese streetwear catalog description highlighting premium combed cotton and DTF print.
Return strictly valid JSON with keys: "title" and "description". Do not wrap in markdown quotes.`;

      // Call Gemini 1.5 Flash / Pro
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(geminiApiKey)}`;
      
      const parts = [{ text: promptText }];
      if (imageData && imageData.includes('base64,')) {
        const mimeType = imageData.substring(imageData.indexOf(':') + 1, imageData.indexOf(';'));
        const base64Data = imageData.split('base64,')[1];
        parts.push({
          inlineData: {
            mimeType: mimeType || 'image/png',
            data: base64Data
          }
        });
      }

      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts }]
        })
      });

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      let parsed = null;
      try {
        const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        parsed = JSON.parse(cleaned);
      } catch (e) {
        parsed = {
          title: rawText.split('\n')[0].replace(/["#*]/g, '').trim() || 'TOKYO CYPHER OVERSIZED TEE',
          description: rawText || 'Crafted with premium combed heavyweight cotton and authentic high-density Japanese street graphics.'
        };
      }

      return res.status(200).json({ success: true, result: parsed });
    }

    // 2. Generate Apparel Model / Graphic Image using Gemini / Imagen
    if (action === 'generate-image') {
      const userPrompt = prompt || `Professional studio photography of a 240 GSM oversized streetwear t-shirt on an editorial model, cyberpunk Tokyo dark aesthetic, dramatic contrast lighting, pitch black background, hyper-detailed`;

      const imagenUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${encodeURIComponent(geminiApiKey)}`;

      const response = await fetch(imagenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instances: [{ prompt: userPrompt }],
          parameters: {
            sampleCount: 1,
            aspectRatio: '1:1',
            outputOptions: { mimeType: 'image/jpeg' }
          }
        })
      });

      const data = await response.json();
      if (data.predictions && data.predictions[0]?.bytesBase64Encoded) {
        return res.status(200).json({
          success: true,
          imageUrl: `data:image/jpeg;base64,${data.predictions[0].bytesBase64Encoded}`
        });
      }

      // If Imagen model is not permitted, fallback to curated high-resolution Tokyo editorial imagery
      const fallbacks = [
        'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&auto=format&fit=crop&q=80'
      ];
      return res.status(200).json({
        success: true,
        imageUrl: fallbacks[Math.floor(Math.random() * fallbacks.length)],
        note: 'Fallback to curated editorial graphic'
      });
    }

    return res.status(400).json({ success: false, error: 'Unknown action' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
